<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['seller_id','title','description','sku','images','price'];
    protected $casts = ['images' => 'array'];
    public function seller() { return $this->belongsTo(User::class,'seller_id'); }
}
