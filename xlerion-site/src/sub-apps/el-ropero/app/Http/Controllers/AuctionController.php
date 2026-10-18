<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class AuctionController extends Controller
{
    public function index(Request $req)
    {
        return response()->json(Auction::with('bids')->where('status','open')->get());
    }

    public function store(Request $req)
    {
        $data = $req->only(['product_id','starts_at','ends_at','starting_price']);
        $v = Validator::make($data, [
            'product_id' => 'required|exists:products,id',
            'ends_at' => 'required|date|after:now',
            'starting_price' => 'required|numeric|min:0.01'
        ]);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()],422);

        $product = Product::findOrFail($data['product_id']);
        $auction = Auction::create([
            'product_id'=>$product->id,
            'seller_id'=>$product->seller_id,
            'starts_at'=>$data['starts_at'] ?? now(),
            'ends_at'=>$data['ends_at'],
            'starting_price'=>$data['starting_price'],
            'current_price'=>$data['starting_price'],
            'status'=>'open'
        ]);

        return response()->json($auction,201);
    }

    public function show($id)
    {
        $auction = Auction::with('bids.user','product')->findOrFail($id);
        return response()->json($auction);
    }
}
