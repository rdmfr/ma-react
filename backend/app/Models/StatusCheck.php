<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusCheck extends Model
{
    use HasUuids;
    use HasFactory;

    protected $table = 'status_checks';

    protected $fillable = [
        'client_name',
    ];

    public $incrementing = false;

    protected $keyType = 'string';
}
