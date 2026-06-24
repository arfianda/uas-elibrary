<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');
$routes->options('(:any)', 'Home::index');

$routes->group('api', function($routes) {
    $routes->post('login', 'AuthController::login');
    $routes->post('register', 'AuthController::register');
    $routes->resource('books', ['controller' => 'BookController']);
    $routes->resource('genres', ['controller' => 'GenreController']);
    $routes->put('rentals/(:num)/return', 'RentalController::returnBook/$1');
    $routes->resource('rentals', ['controller' => 'RentalController']);
});
