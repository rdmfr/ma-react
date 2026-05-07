<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StatusCheck;
use Illuminate\Http\Request;

class StatusCheckController extends Controller
{
    public function index()
    {
        return StatusCheck::query()
            ->orderByDesc('created_at')
            ->limit(1000)
            ->get(['id', 'client_name', 'created_at']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
        ]);

        $statusCheck = StatusCheck::query()->create([
            'client_name' => $validated['client_name'],
        ]);

        return response()->json($statusCheck->only(['id', 'client_name', 'created_at']), 201);
    }
}

