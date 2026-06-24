<?php

namespace App\Models;

use CodeIgniter\Model;

class BookModel extends Model
{
    protected $table            = 'books';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'genre_id',
        'title',
        'author',
        'cover_url',
        'read_url',
        'pdf_path',
        'is_free',
        'synopsis',
        'status'
    ];

    // Dates
    protected $useTimestamps = false;
}
