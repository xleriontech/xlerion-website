<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['auction_id','buyer_id','amount','status','stripe_payment_id'];

    public function buyer() { return $this->belongsTo(User::class,'buyer_id'); }
}
