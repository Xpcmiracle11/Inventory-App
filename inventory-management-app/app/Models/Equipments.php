<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipments extends Model
{
    protected $fillable = [
        'id',
        'equipment_name',
        'created_at',
    ];
}
