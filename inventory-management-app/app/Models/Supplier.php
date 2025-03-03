<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'id',
        'supplier_name',
        'address',
        'phone_number',
        'email',
        'created_at',        
    ];
}
