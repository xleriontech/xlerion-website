<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;

class ProductController extends Controller
{
    public function store(Request $req)
    {
        $req->validate([
            'title'=>'required|string',
            'images'=>'required|array|min:1',
            'images.*'=>'required|file|mimes:jpg,jpeg,png'
        ]);

        $user = $req->user();
        $imageUrls = [];
        foreach ($req->file('images') as $file) {
            $path = $file->store('products', 's3');
            $url = Storage::disk('s3')->url($path);
            $imageUrls[] = $url;
            // dispatch thumbnail job
            \App\Jobs\GenerateThumbnails::dispatch($path);
        }

        $product = Product::create([
            'seller_id'=>$user->id,
            'title'=>$req->input('title'),
            'description'=>$req->input('description'),
            'images'=>$imageUrls,
            'price'=>$req->input('price',0)
        ]);

        return response()->json($product,201);
    }
}
