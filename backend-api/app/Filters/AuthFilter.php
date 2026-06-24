<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        helper('token');

        $method = strtoupper($request->getMethod());
        if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
            // Bypass authentication for login and register requests
            $path = $request->getUri()->getPath();
            if (preg_match('/(?:^|\/)(?:login|register)$/i', $path)) {
                return;
            }

            $authHeader = $request->getHeaderLine('Authorization');

            if (empty($authHeader)) {
                return $this->unauthorizedResponse('Authorization header is missing.');
            }

            if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
                return $this->unauthorizedResponse('Invalid authorization header format. Use Bearer <token>.');
            }

            $token = $matches[1];
            $decoded = validate_token($token);

            if (!$decoded) {
                return $this->unauthorizedResponse('Unauthorized access. Invalid or expired token.');
            }

            // Check admin role for mutating books and genres
            if (preg_match('/api\/(?:books|genres)/i', $path)) {
                if (($decoded['role'] ?? 'member') !== 'admin') {
                    return $this->forbiddenResponse('Forbidden. Admin role required for this action.');
                }
            }

            $request->user = $decoded;
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing
    }

    private function unauthorizedResponse(string $message)
    {
        $response = response();
        $response->setStatusCode(401);
        
        // Ensure CORS headers are also set on error response
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        
        $response->setJSON([
            'status'  => 401,
            'error'   => true,
            'message' => $message
        ]);
        return $response;
    }

    private function forbiddenResponse(string $message)
    {
        $response = response();
        $response->setStatusCode(403);
        
        // Ensure CORS headers are set on error response
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        
        $response->setJSON([
            'status'  => 403,
            'error'   => true,
            'message' => $message
        ]);
        return $response;
    }
}
