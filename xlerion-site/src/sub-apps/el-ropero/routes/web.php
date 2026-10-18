<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
*/

Route::view('/', 'welcome')->name('home');
Route::view('/auctions', 'auctions.index')->name('auctions.index');
Route::view('/auctions/{id}', 'auctions.show')->name('auctions.show');
Route::view('/login', 'auth.login')->name('login');
Route::view('/register', 'auth.register')->name('register');
Route::view('/forgot-password', 'auth.forgot-password')->name('password.request');
Route::view('/reset-password/{token}', 'auth.reset-password')->name('password.reset');

// Protected routes (requieren autenticación)
Route::middleware(['auth'])->group(function () {
    Route::view('/seller', 'seller.dashboard')->name('seller.dashboard');
    Route::view('/seller/products', 'seller.products')->name('seller.products');
    Route::view('/seller/products/create', 'seller.products-create')->name('seller.products.create');
    Route::view('/seller/products/{id}/edit', 'seller.products-edit')->name('seller.products.edit');
    Route::view('/seller/auctions', 'seller.auctions')->name('seller.auctions');
    Route::view('/profile', 'profile.index')->name('profile');
    Route::view('/profile/orders', 'profile.orders')->name('profile.orders');
    Route::view('/profile/sales', 'profile.sales')->name('profile.sales');
    Route::view('/checkout', 'checkout.index')->name('checkout');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::view('/', 'admin.dashboard')->name('dashboard');
    Route::view('/listings', 'admin.listings')->name('listings');
    Route::view('/disputes', 'admin.disputes')->name('disputes');
    Route::view('/users', 'admin.users')->name('users');
});
