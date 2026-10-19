<?php
// Server-side settings for the quote form and Google reviews feed.
// This file is blocked from web access by api/.htaccess. Keep secrets here, never in JS.
return [
    'business_email'   => 'info@bricklayersbrisbane.com.au',  // where new inquiries are sent
    'business_cc'      => '',                                 // optional, e.g. completebrick@hotmail.com
    'from_email'       => 'noreply@bricklayersbrisbane.com.au', // must be on your domain (SPF/DKIM) for deliverability
    'business_name'    => 'Bricklayers Brisbane',
    'business_phone'   => '0431 138 393',
    'reviews_url'      => '',  // Google Business Profile reviews link, used in the confirmation email

    // reCAPTCHA v3 (optional: honeypot, time-trap and rate limit are always on)
    'recaptcha_secret' => '',
    'recaptcha_min_score' => 0.5,

    // Google Places API (New): powers /api/reviews.php
    'places_api_key'   => '',  // server key restricted to Places API
    'place_id'         => '',  // find it at https://developers.google.com/maps/documentation/places/web-service/place-id
    'reviews_cache_hours' => 6,

    // Uploads
    'max_files'        => 5,
    'max_file_mb'      => 10,
    'max_email_mb'     => 20,  // attachments above this total are saved on the server, not emailed
];
