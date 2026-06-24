<?php

if (!function_exists('generate_token')) {
    function generate_token(array $payload, string $secret = 'super-secret-key-123-read-rent-fun'): string
    {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload['exp'] = time() + 3600 * 24; // 24 hours expiration

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
}

if (!function_exists('validate_token')) {
    function validate_token(string $token, string $secret = 'super-secret-key-123-read-rent-fun'): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

        // Verify Signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        if (!hash_equals($expectedSignature, $base64UrlSignature)) {
            return null;
        }

        // Decode Payload
        $payloadJson = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload));
        $payload = json_decode($payloadJson, true);

        if (!$payload || !isset($payload['exp'])) {
            return null;
        }

        // Check Expiration
        if ($payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }
}
