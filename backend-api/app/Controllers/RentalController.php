<?php

namespace App\Controllers;

use App\Models\RentalModel;
use App\Models\BookModel;
use CodeIgniter\API\ResponseTrait;

class RentalController extends BaseController
{
    use ResponseTrait;

    protected function getCurrentUser()
    {
        helper('token');
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
            return validate_token($matches[1]);
        }
        return null;
    }

    public function index()
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->respond([
                'status'  => 401,
                'error'   => true,
                'message' => 'Unauthorized. Invalid token.'
            ], 401);
        }

        $rentalModel = new RentalModel();

        if ($user['role'] === 'admin') {
            $rentals = $rentalModel
                ->select('rentals.*, users.username as user_name, users.email as user_email, books.title as book_title, books.author as book_author')
                ->join('users', 'users.id = rentals.user_id')
                ->join('books', 'books.id = rentals.book_id')
                ->orderBy('rentals.rent_date', 'DESC')
                ->findAll();
        } else {
            $rentals = $rentalModel
                ->select('rentals.*, books.title as book_title, books.author as book_author, books.cover_url as book_cover, books.pdf_path as book_pdf')
                ->join('books', 'books.id = rentals.book_id')
                ->where('rentals.user_id', $user['id'])
                ->orderBy('rentals.rent_date', 'DESC')
                ->findAll();
        }

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'data'    => $rentals
        ], 200);
    }

    public function create()
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->respond([
                'status'  => 401,
                'error'   => true,
                'message' => 'Unauthorized. Invalid token.'
            ], 401);
        }

        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        $bookId = $json['book_id'] ?? null;

        if (!$bookId) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'Book ID is required.'
            ], 400);
        }

        $bookModel = new BookModel();
        $book = $bookModel->find($bookId);
        if (!$book) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Book not found.'
            ], 404);
        }

        $rentalModel = new RentalModel();
        $activeRental = $rentalModel
            ->where('user_id', $user['id'])
            ->where('book_id', $bookId)
            ->where('status', 'rented')
            ->first();

        if ($activeRental) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'You already have an active rental for this book.'
            ], 400);
        }

        $insertData = [
            'user_id' => $user['id'],
            'book_id' => $bookId,
            'status'  => 'rented'
        ];

        if ($rentalModel->insert($insertData)) {
            $insertData['id'] = $rentalModel->getInsertID();
            return $this->respond([
                'status'  => 201,
                'error'   => false,
                'message' => 'Book rented successfully!',
                'data'    => $insertData
            ], 201);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to process rental.'
        ], 500);
    }

    public function returnBook($id = null)
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return $this->respond([
                'status'  => 401,
                'error'   => true,
                'message' => 'Unauthorized. Invalid token.'
            ], 401);
        }

        $rentalModel = new RentalModel();
        $rental = $rentalModel->find($id);

        if (!$rental) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Rental record not found.'
            ], 404);
        }

        if ($user['role'] !== 'admin' && (int)$user['id'] !== (int)$rental['user_id']) {
            return $this->respond([
                'status'  => 403,
                'error'   => true,
                'message' => 'You are not authorized to return this book.'
            ], 403);
        }

        if ($rental['status'] === 'returned') {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'This book has already been returned.'
            ], 400);
        }

        $updateData = [
            'status'      => 'returned',
            'return_date' => date('Y-m-d H:i:s')
        ];

        if ($rentalModel->update($id, $updateData)) {
            return $this->respond([
                'status'  => 200,
                'error'   => false,
                'message' => 'Book returned successfully!'
            ], 200);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to process return.'
        ], 500);
    }
}
