<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Auction extends Model
{
    protected $fillable = ['product_id','seller_id','starts_at','ends_at','starting_price','current_price','status'];

    protected $dates = ['starts_at','ends_at'];

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }
}
