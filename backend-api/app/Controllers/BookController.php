<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class BookController extends ResourceController
{
    protected $modelName = 'App\Models\BookModel';
    protected $format    = 'json';

    public function index()
    {
        $books = $this->model
            ->select('books.*, genres.name as genre_name, genres.description as genre_description')
            ->join('genres', 'genres.id = books.genre_id', 'left')
            ->findAll();

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'data'    => $books
        ], 200);
    }

    public function show($id = null)
    {
        $book = $this->model
            ->select('books.*, genres.name as genre_name, genres.description as genre_description')
            ->join('genres', 'genres.id = books.genre_id', 'left')
            ->find($id);

        if (!$book) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Book not found'
            ], 404);
        }

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'data'    => $book
        ], 200);
    }

    public function create()
    {
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = $this->request->getJSON(true);
        }

        if (empty($data)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'Request body is empty'
            ], 400);
        }

        $rules = [
            'title'    => 'required|min_length[3]|max_length[200]',
            'author'   => 'required|min_length[3]|max_length[150]',
            'genre_id' => 'permit_empty|is_not_unique[genres.id]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages'=> $this->validator->getErrors()
            ], 400);
        }

        // Handle PDF upload
        $pdfFile = $this->request->getFile('pdf_file');
        $pdfPath = null;
        if ($pdfFile && $pdfFile->isValid() && !$pdfFile->hasMoved()) {
            if ($pdfFile->getMimeType() === 'application/pdf') {
                $newName = $pdfFile->getRandomName();
                $pdfFile->move(FCPATH . 'uploads/books', $newName);
                $pdfPath = 'uploads/books/' . $newName;
            } else {
                return $this->respond([
                    'status'  => 400,
                    'error'   => true,
                    'message' => 'Uploaded file must be a valid PDF.'
                ], 400);
            }
        } else {
            $pdfPath = $data['pdf_path'] ?? null;
        }

        $insertData = [
            'genre_id'  => !empty($data['genre_id']) ? $data['genre_id'] : null,
            'title'     => $data['title'],
            'author'    => $data['author'],
            'cover_url' => $data['cover_url'] ?? 'default-cover.png',
            'read_url'  => $data['read_url'] ?? null,
            'pdf_path'  => $pdfPath,
            'is_free'   => isset($data['is_free']) ? (int)$data['is_free'] : 1,
            'synopsis'  => $data['synopsis'] ?? null,
            'status'    => $data['status'] ?? 'available'
        ];

        if ($this->model->insert($insertData)) {
            $insertData['id'] = $this->model->getInsertID();
            return $this->respond([
                'status'  => 201,
                'error'   => false,
                'message' => 'Book created successfully',
                'data'    => $insertData
            ], 201);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to create book'
        ], 500);
    }

    public function update($id = null)
    {
        $book = $this->model->find($id);
        if (!$book) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Book not found'
            ], 404);
        }

        $data = $this->request->getPost();
        if (empty($data)) {
            $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        }

        $rules = [
            'title'    => 'permit_empty|min_length[3]|max_length[200]',
            'author'   => 'permit_empty|min_length[3]|max_length[150]',
            'genre_id' => 'permit_empty|is_not_unique[genres.id]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages'=> $this->validator->getErrors()
            ], 400);
        }

        $updateData = [];
        if (isset($data['title'])) $updateData['title'] = $data['title'];
        if (isset($data['author'])) $updateData['author'] = $data['author'];
        if (isset($data['genre_id'])) $updateData['genre_id'] = !empty($data['genre_id']) ? $data['genre_id'] : null;
        if (isset($data['cover_url'])) $updateData['cover_url'] = $data['cover_url'];
        if (isset($data['read_url'])) $updateData['read_url'] = $data['read_url'];
        if (isset($data['synopsis'])) $updateData['synopsis'] = $data['synopsis'];
        if (isset($data['status'])) $updateData['status'] = $data['status'];
        if (isset($data['is_free'])) $updateData['is_free'] = (int)$data['is_free'];

        // Handle PDF upload
        $pdfFile = $this->request->getFile('pdf_file');
        if ($pdfFile && $pdfFile->isValid() && !$pdfFile->hasMoved()) {
            if ($pdfFile->getMimeType() === 'application/pdf') {
                $newName = $pdfFile->getRandomName();
                $pdfFile->move(FCPATH . 'uploads/books', $newName);
                $updateData['pdf_path'] = 'uploads/books/' . $newName;
                
                if (!empty($book['pdf_path']) && file_exists(FCPATH . $book['pdf_path'])) {
                    @unlink(FCPATH . $book['pdf_path']);
                }
            } else {
                return $this->respond([
                    'status'  => 400,
                    'error'   => true,
                    'message' => 'Uploaded file must be a valid PDF.'
                ], 400);
            }
        } elseif (isset($data['pdf_path'])) {
            $updateData['pdf_path'] = $data['pdf_path'];
        }

        if (empty($updateData)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'No fields to update'
            ], 400);
        }

        if ($this->model->update($id, $updateData)) {
            $updatedBook = $this->model->find($id);
            return $this->respond([
                'status'  => 200,
                'error'   => false,
                'message' => 'Book updated successfully',
                'data'    => $updatedBook
            ], 200);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to update book'
        ], 500);
    }

    public function delete($id = null)
    {
        $book = $this->model->find($id);
        if (!$book) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Book not found'
            ], 404);
        }

        if (!empty($book['pdf_path']) && file_exists(FCPATH . $book['pdf_path'])) {
            @unlink(FCPATH . $book['pdf_path']);
        }

        if ($this->model->delete($id)) {
            return $this->respond([
                'status'  => 200,
                'error'   => false,
                'message' => 'Book deleted successfully'
            ], 200);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to delete book'
        ], 500);
    }
}
