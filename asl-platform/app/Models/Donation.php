<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'user_id',
        'type_id',
        'completed',
    ];
    public function type() {
        return $this->belongsTo(Type::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
}
