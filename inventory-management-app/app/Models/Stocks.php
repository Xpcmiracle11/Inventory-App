<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stocks extends Model
{
    protected $fillable = [
        'id',
        'category_id',
        'equipment_name',
        'item_type',
        'brand',
        'model',
        'serial_number',
        'supplier',
        'created_at',
    ];
}
