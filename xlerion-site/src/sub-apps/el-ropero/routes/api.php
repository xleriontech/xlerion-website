<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\BidController;

Route::middleware('api')->group(function () {
    Route::get('/auctions', [AuctionController::class, 'index']);
    Route::post('/auctions', [AuctionController::class, 'store']);
    Route::get('/auctions/{id}', [AuctionController::class, 'show']);
    Route::post('/auctions/{id}/bids', [BidController::class, 'store']);
});
