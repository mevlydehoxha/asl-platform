<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sign extends Model
{
    use HasFactory;
    /**
    * The attributes that are mass assignable.
    *
    * @var array<int, string>
    */
    protected $fillable = [
        'video',
        'image',
        'title_albanian',
        'title_english',
        'description',
        'category_id',
    ];
    public function category() {
        return $this->belongsTo(Category::class);
    }
}
