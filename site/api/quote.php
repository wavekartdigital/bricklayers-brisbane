<?php
// Quote / call-back form handler.
// Emails the business (with attachments) and sends the customer a confirmation.
// Spam protection: honeypot field, minimum fill time, per-IP rate limit, optional reCAPTCHA v3.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

$cfg = require __DIR__ . '/config.php';
$storage = __DIR__ . '/storage';
if (!is_dir($storage)) { @mkdir($storage, 0750, true); }

function respond(bool $ok, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'error' => $error]);
    exit;
}
function field(string $k, int $max = 500): string {
    $v = $_POST[$k] ?? '';
    if (is_array($v)) { $v = implode(', ', $v); }
    $v = trim(strip_tags((string) $v));
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}
function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
function header_safe(string $s): string { return trim(preg_replace('/[\r\n]+/', ' ', $s)); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { respond(false, 'Method not allowed.', 405); }

// ── Spam checks ──
if (field('company_website') !== '') { respond(true); }                     // honeypot: pretend success
$started = (int) ($_POST['form_started'] ?? 0);
if ($started > 0 && (microtime(true) * 1000 - $started) < 3000) { respond(true); } // filled in < 3s: bot

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rlFile = $storage . '/ratelimit.json';
$rl = is_file($rlFile) ? (json_decode((string) file_get_contents($rlFile), true) ?: []) : [];
$now = time();
$rl = array_filter($rl, fn($ts) => $ts > $now - 600);
$hits = array_filter($rl, fn($ts, $k) => str_starts_with((string) $k, $ip . '|'), ARRAY_FILTER_USE_BOTH);
if (count($hits) >= 6) { respond(false, 'Too many submissions. Please wait a few minutes.', 429); }
$rl[$ip . '|' . $now . '|' . mt_rand()] = $now;
@file_put_contents($rlFile, json_encode($rl), LOCK_EX);

if (!empty($cfg['recaptcha_secret'])) {
    $token = field('recaptcha_token', 4000);
    $ctx = stream_context_create(['http' => [
        'method' => 'POST', 'timeout' => 6,
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query(['secret' => $cfg['recaptcha_secret'], 'response' => $token, 'remoteip' => $ip]),
    ]]);
    $res = json_decode((string) @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $ctx), true);
    if (empty($res['success']) || ($res['score'] ?? 0) < $cfg['recaptcha_min_score']) {
        respond(false, 'Our spam check could not verify your request. Please try again.', 400);
    }
}

// ── Validate ──
$type   = field('form_type') === 'quick' ? 'quick' : 'full';
$name   = field('name', 120);
$phone  = field('phone', 30);
$email  = field('email', 160);
$serviceNames = [
    'retaining-feature-walls' => 'Entrance, Retaining & Feature Walls',
    're-pointing'             => 'Re-Point Repair',
    'existing-work-pavers'    => 'Existing Work & Pavers',
    'wall-removal-repair'     => 'Walls Removed, Replaced or Just Made Safe',
    'brick-block'             => 'Brick & Block',
    'homes-developments'      => 'Homes & Developments',
    'other'                   => 'Other',
];
$services = array_values(array_filter(array_map(
    fn($s) => $serviceNames[(string) $s] ?? null,
    array_map('trim', explode(',', (string) ($_POST['services'] ?? ''))) // JS sends "slug-a, slug-b"
)));

$errors = [];
if ($name === '') { $errors[] = 'name'; }
if (!preg_match('/^(\+?61|0)[2-478](?:[ -]?\d){8}$/', $phone)) { $errors[] = 'phone'; }
if (!$services) { $errors[] = 'service'; }
if ($type === 'full') {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = 'email'; }
    if (mb_strlen(field('description', 4000)) < 10) { $errors[] = 'description'; }
    if (field('privacy_consent') !== 'yes') { $errors[] = 'consent'; }
}
if ($errors) { respond(false, 'Please check: ' . implode(', ', $errors) . '.', 422); }

// ── Collect details ──
$size = array_filter([
    field('size_length', 10) !== '' ? field('size_length', 10) . ' m long' : '',
    field('size_height', 10) !== '' ? field('size_height', 10) . ' m high' : '',
    field('size_area', 10)   !== '' ? field('size_area', 10) . ' m²' : '',
]);
$rows = $type === 'quick' ? [
    'Request'  => 'Quick call-back',
    'Name'     => $name,
    'Phone'    => $phone,
    'Service'  => implode(', ', $services),
    'Page'     => field('page', 200),
] : [
    'Services'            => implode(', ', $services),
    'Project type'        => field('project_type'),
    'Property type'       => field('property_type'),
    'Description'         => field('description', 4000),
    'Approx. size'        => implode(' · ', $size),
    'Material'            => field('material'),
    'Existing structure'  => field('existing_structure'),
    'Site access'         => field('site_access'),
    'Preferred start'     => field('start_date'),
    'Budget'              => field('budget'),
    'Approval'            => field('approval'),
    'Name'                => $name,
    'Phone'               => $phone,
    'Email'               => $email,
    'Address'             => field('address', 200),
    'Suburb'              => field('suburb', 80),
    'Contact via'         => field('contact_method'),
    'Best time'           => field('best_time'),
    'Heard about us'      => field('heard_about'),
    'Page'                => field('page', 200),
];
$rows = array_filter($rows, fn($v) => $v !== '');

// ── Attachments ──
$attachments = [];
$saved = [];
// Files arrive as attachment1, attachment2, … (one per field, matching Netlify Forms).
$uploads = array_filter($_FILES, fn($k) => preg_match('/^attachment\d+$/', (string) $k), ARRAY_FILTER_USE_KEY);
if ($uploads) {
    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'application/pdf'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $total = 0;
    $uploadDir = $storage . '/uploads/' . date('Ymd-His') . '-' . bin2hex(random_bytes(3));
    foreach ($uploads as $up) {
        if (count($attachments) + count($saved) >= $cfg['max_files']) { break; }
        if ($up['error'] !== UPLOAD_ERR_OK) { continue; }
        $orig = $up['name'];
        $tmp  = $up['tmp_name'];
        $size = (int) $up['size'];
        $mime = $finfo->file($tmp) ?: '';
        if (!in_array($mime, $allowed, true) || $size > $cfg['max_file_mb'] * 1048576) { continue; }
        $safe = preg_replace('/[^A-Za-z0-9._-]+/', '_', basename((string) $orig)) ?: 'file';
        if ($total + $size <= $cfg['max_email_mb'] * 1048576) {
            $attachments[] = ['name' => $safe, 'mime' => $mime, 'data' => (string) file_get_contents($tmp)];
            $total += $size;
        } else {
            if (!is_dir($uploadDir)) { @mkdir($uploadDir, 0750, true); }
            if (@move_uploaded_file($tmp, $uploadDir . '/' . $safe)) { $saved[] = $safe; }
        }
    }
    if ($saved) { $rows['Files saved on server'] = implode(', ', $saved) . ' (' . basename($uploadDir) . ')'; }
}

// ── Backup log (in case email fails) ──
$csv = fopen($storage . '/leads.csv', 'a');
if ($csv) { fputcsv($csv, array_merge([date('c'), $type, $ip], array_map(fn($k, $v) => "$k: $v", array_keys($rows), $rows))); fclose($csv); }

// ── Email helpers ──
function table(array $rows): string {
    $out = '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font:14px Arial,sans-serif;width:100%;max-width:640px">';
    foreach ($rows as $k => $v) {
        $out .= '<tr><th align="left" style="background:#f3ece1;border:1px solid #e5dccd;width:170px;vertical-align:top">' . h((string) $k) . '</th><td style="border:1px solid #e5dccd">' . nl2br(h((string) $v)) . '</td></tr>';
    }
    return $out . '</table>';
}
// Sends through the Resend API (HTTPS), for hosts that block outbound SMTP.
function send_resend(string $to, string $subject, string $html, array $cfg, string $replyTo, array $files, string $cc): bool {
    $payload = [
        'from' => header_safe($cfg['business_name']) . ' <' . $cfg['from_email'] . '>',
        'to' => [$to],
        'subject' => header_safe($subject),
        'html' => $html,
    ];
    if ($replyTo) { $payload['reply_to'] = header_safe($replyTo); }
    if ($cc) { $payload['cc'] = [header_safe($cc)]; }
    if ($files) {
        $payload['attachments'] = array_map(fn($f) => ['filename' => $f['name'], 'content' => base64_encode($f['data'])], $files);
    }
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $cfg['resend_api_key'], 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload),
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code < 200 || $code >= 300) {
        error_log("Resend failed ($code): " . substr((string) $res, 0, 300));
        return false;
    }
    return true;
}
function send_mail(string $to, string $subject, string $html, array $cfg, string $replyTo = '', array $files = [], string $cc = ''): bool {
    if (!empty($cfg['resend_api_key'])) {
        return send_resend($to, $subject, $html, $cfg, $replyTo, $files, $cc);
    }
    $boundary = 'bb_' . bin2hex(random_bytes(8));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . header_safe($cfg['business_name']) . ' <' . $cfg['from_email'] . '>',
        'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    ];
    if ($replyTo) { $headers[] = 'Reply-To: ' . header_safe($replyTo); }
    if ($cc) { $headers[] = 'Cc: ' . header_safe($cc); }
    $body  = "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "\r\n";
    foreach ($files as $f) {
        $body .= "--$boundary\r\nContent-Type: {$f['mime']}; name=\"{$f['name']}\"\r\nContent-Disposition: attachment; filename=\"{$f['name']}\"\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($f['data'])) . "\r\n";
    }
    $body .= "--$boundary--";
    $subj = '=?UTF-8?B?' . base64_encode(header_safe($subject)) . '?=';
    return @mail($to, $subj, $body, implode("\r\n", $headers), '-f' . $cfg['from_email']);
}

// ── 1. Notify the business ──
$suburb = field('suburb', 80);
$subject = ($type === 'quick' ? 'Call-back request: ' : 'New quote request: ') . implode(', ', $services) . ($suburb ? " · $suburb" : '') . " · $name";
$bizHtml = '<div style="font:14px Arial,sans-serif;color:#1d2024">'
    . '<h2 style="color:#b4472c;margin:0 0 12px">' . h($type === 'quick' ? 'Call-back request' : 'New quote request') . '</h2>'
    . '<p><a href="tel:' . h(preg_replace('/\s+/', '', $phone)) . '" style="background:#f5a623;color:#1d2024;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Call ' . h($name) . ': ' . h($phone) . '</a></p>'
    . table($rows)
    . ($attachments ? '<p>' . count($attachments) . ' file(s) attached.</p>' : '')
    . '</div>';
$sent = send_mail($cfg['business_email'], $subject, $bizHtml, $cfg, filter_var($email, FILTER_VALIDATE_EMAIL) ? "$name <$email>" : '', $attachments, $cfg['business_cc']);

// ── 2. Confirm to the customer ──
if ($type === 'full' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $custRows = $rows;
    unset($custRows['Page'], $custRows['Files saved on server']);
    $custHtml = '<div style="font:15px Arial,sans-serif;color:#1d2024;max-width:640px">'
        . '<h2 style="color:#b4472c">Thanks ' . h(explode(' ', $name)[0]) . ', we\'ve got your inquiry!</h2>'
        . '<p><b>We\'ll be in touch within 24 hours</b> to talk through your project and book a free site visit.</p>'
        . '<p>Need us sooner? Call <a href="tel:' . h(preg_replace('/\s+/', '', $cfg['business_phone'])) . '">' . h($cfg['business_phone']) . '</a>.</p>'
        . '<h3>Your request</h3>' . table($custRows)
        . ($cfg['reviews_url'] ? '<p style="margin-top:20px">See what our customers say: <a href="' . h($cfg['reviews_url']) . '">our Google reviews</a></p>' : '')
        . '<p style="color:#5b6168;margin-top:24px">' . h($cfg['business_name']) . ' · Licensed &amp; insured bricklayers · Brisbane</p></div>';
    send_mail($email, 'We\'ve received your quote request: ' . $cfg['business_name'], $custHtml, $cfg, $cfg['business_email']);
}

if (!$sent) {
    // The lead is saved in storage/leads.csv either way; still tell the customer to call.
    respond(false, 'Your inquiry was saved, but our email system had a problem.', 500);
}
respond(true);
