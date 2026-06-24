<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class GenreController extends ResourceController
{
    protected $modelName = 'App\Models\CategoryModel';
    protected $format    = 'json';

    public function index()
    {
        $genres = $this->model->findAll();
        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'data'    => $genres
        ], 200);
    }

    public function show($id = null)
    {
        $genre = $this->model->find($id);

        if (!$genre) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Genre not found'
            ], 404);
        }

        return $this->respond([
            'status'  => 200,
            'error'   => false,
            'data'    => $genre
        ], 200);
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($data)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'Request body is empty'
            ], 400);
        }

        $rules = [
            'name'        => 'required|min_length[3]|max_length[100]|is_unique[genres.name]',
            'description' => 'permit_empty|min_length[5]'
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages'=> $this->validator->getErrors()
            ], 400);
        }

        $insertData = [
            'name'        => $data['name'],
            'description' => $data['description'] ?? null
        ];

        if ($this->model->insert($insertData)) {
            $insertData['id'] = $this->model->getInsertID();
            return $this->respond([
                'status'  => 201,
                'error'   => false,
                'message' => 'Genre created successfully',
                'data'    => $insertData
            ], 201);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to create genre'
        ], 500);
    }

    public function update($id = null)
    {
        $genre = $this->model->find($id);
        if (!$genre) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Genre not found'
            ], 404);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $rules = [
            'name'        => "permit_empty|min_length[3]|max_length[100]|is_unique[genres.name,id,{$id}]",
            'description' => 'permit_empty|min_length[5]'
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'messages'=> $this->validator->getErrors()
            ], 400);
        }

        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['description'])) $updateData['description'] = $data['description'];

        if (empty($updateData)) {
            return $this->respond([
                'status'  => 400,
                'error'   => true,
                'message' => 'No fields to update'
            ], 400);
        }

        if ($this->model->update($id, $updateData)) {
            $updatedGenre = $this->model->find($id);
            return $this->respond([
                'status'  => 200,
                'error'   => false,
                'message' => 'Genre updated successfully',
                'data'    => $updatedGenre
            ], 200);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to update genre'
        ], 500);
    }

    public function delete($id = null)
    {
        $genre = $this->model->find($id);
        if (!$genre) {
            return $this->respond([
                'status'  => 404,
                'error'   => true,
                'message' => 'Genre not found'
            ], 404);
        }

        if ($this->model->delete($id)) {
            return $this->respond([
                'status'  => 200,
                'error'   => false,
                'message' => 'Genre deleted successfully'
            ], 200);
        }

        return $this->respond([
            'status'  => 500,
            'error'   => true,
            'message' => 'Failed to delete genre'
        ], 500);
    }
}
