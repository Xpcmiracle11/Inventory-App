<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Defectives extends Model
{
    protected $fillable = [
        'id',
        'status',
        'item_id',
        'managers_name',
        'cluster',
        'floor',
        'area',
        'incident_details',
        'person_incharge',
        'note',
        'created_at'
    ];
}
