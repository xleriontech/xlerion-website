<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bid;
use App\Models\Auction;
use Illuminate\Support\Facades\Validator;

class BidController extends Controller
{
    public function store(Request $req, $id)
    {
        $auction = Auction::findOrFail($id);
        if ($auction->status !== 'open') return response()->json(['error'=>'Auction closed'],422);

        $data = $req->only(['user_id','amount']);
        $v = Validator::make($data, ['user_id'=>'required|exists:users,id','amount'=>'required|numeric|min:0.01']);
        if ($v->fails()) return response()->json(['errors'=>$v->errors()],422);

        // minimal increment rule: 1% or minimum 0.5
        $minIncrement = max(0.5, $auction->current_price * 0.01);
        if ($data['amount'] < $auction->current_price + $minIncrement) {
            return response()->json(['error'=>'Bid too low','min_increment'=>$minIncrement],422);
        }

        $bid = Bid::create(['auction_id'=>$auction->id,'user_id'=>$data['user_id'],'amount'=>$data['amount']]);
        $auction->current_price = $data['amount'];
        $auction->save();

        // extend auction if bid within last 2 minutes
        $endsAt = \Carbon\Carbon::parse($auction->ends_at);
        if ($endsAt->diffInSeconds(now()) <= 120) {
            $auction->ends_at = $endsAt->addMinutes(2);
            $auction->save();
        }

        return response()->json($bid,201);
    }
}
