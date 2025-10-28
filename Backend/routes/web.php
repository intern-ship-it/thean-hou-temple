<?php

use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });


Route::get('/{any}', function () {
    return response()->file(public_path('index.html'));
})->where('any', '^(?!api).*$');