<?php
// Google reviews proxy: fetches rating + latest reviews from the Places API (New),
// caches them, and returns a small JSON payload for the reviews carousel.
// The API key stays on the server. Google returns at most 5 reviews per place.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$cfg = require __DIR__ . '/config.php';
$empty = json_encode(['rating' => null, 'count' => null, 'reviews' => []]);
if (empty($cfg['places_api_key']) || empty($cfg['place_id'])) { echo $empty; exit; }

$storage = __DIR__ . '/storage';
if (!is_dir($storage)) { @mkdir($storage, 0750, true); }
$cache = $storage . '/reviews.json';
if (is_file($cache) && filemtime($cache) > time() - $cfg['reviews_cache_hours'] * 3600) {
    readfile($cache);
    exit;
}

$ctx = stream_context_create(['http' => [
    'method' => 'GET', 'timeout' => 8,
    'header' => implode("\r\n", [
        'X-Goog-Api-Key: ' . $cfg['places_api_key'],
        'X-Goog-FieldMask: rating,userRatingCount,reviews,googleMapsUri',
    ]),
]]);
$raw = @file_get_contents('https://places.googleapis.com/v1/places/' . rawurlencode($cfg['place_id']) . '?languageCode=en', false, $ctx);
$data = $raw ? json_decode($raw, true) : null;

if (!$data || isset($data['error'])) {
    // Serve stale cache if we have one, otherwise nothing (the page keeps its placeholders).
    if (is_file($cache)) { readfile($cache); } else { echo $empty; }
    exit;
}

$out = [
    'rating'  => $data['rating'] ?? null,
    'count'   => $data['userRatingCount'] ?? null,
    'url'     => $data['googleMapsUri'] ?? null,
    'reviews' => array_map(fn($r) => [
        'author' => $r['authorAttribution']['displayName'] ?? 'Google user',
        'photo'  => $r['authorAttribution']['photoUri'] ?? '',
        'rating' => $r['rating'] ?? 5,
        'date'   => $r['relativePublishTimeDescription'] ?? '',
        'text'   => $r['text']['text'] ?? ($r['originalText']['text'] ?? ''),
    ], array_values(array_filter($data['reviews'] ?? [], fn($r) => ($r['rating'] ?? 0) >= 4))),
];
$json = json_encode($out);
@file_put_contents($cache, $json, LOCK_EX);
echo $json;
