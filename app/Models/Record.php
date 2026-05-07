<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'records';

    protected $fillable = [
        'type',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public $incrementing = false;

    protected $keyType = 'string';
}

