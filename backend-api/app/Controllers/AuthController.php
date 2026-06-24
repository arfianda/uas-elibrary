<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class AuthController extends BaseController
{
    use ResponseTrait;

    public function login()
    {
        helper('token');

        $json = $this->request->getJSON(true);
        $username = $json['username'] ?? '';
        $password = $json['password'] ?? '';

        if (empty($username) || empty($password)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'Username and password are required'
            ], 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $username)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->respond([
                'status'  => 401,
                'error'   => true,
                'message' => 'Invalid username or password'
            ], 401);
        }

        $tokenPayload = [
            'id'       => $user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'role'     => $user['role']
        ];

        $token = generate_token($tokenPayload);

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'id'       => $user['id'],
                'username' => $user['username'],
                'email'    => $user['email'],
                'role'     => $user['role']
            ]
        ], 200);
    }

    public function register()
    {
        $json = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($json)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'Request body is empty'
            ], 400);
        }

        $rules = [
            'username' => 'required|min_length[3]|max_length[50]|is_unique[users.username]',
            'email'    => 'required|valid_email|max_length[100]|is_unique[users.email]',
            'password' => 'required|min_length[6]|max_length[255]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages'=> $this->validator->getErrors()
            ], 400);
        }

        $userModel = new UserModel();
        $insertData = [
            'username' => $json['username'],
            'email'    => $json['email'],
            'password' => password_hash($json['password'], PASSWORD_BCRYPT),
            'role'     => 'member'
        ];

        if ($userModel->insert($insertData)) {
            return $this->respond([
                'status'  => 201,
                'error'   => false,
                'message' => 'Registration successful! You can now log in.'
            ], 201);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to register user.'
        ], 500);
    }
}
