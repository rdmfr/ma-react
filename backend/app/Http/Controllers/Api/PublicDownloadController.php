<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;

class PublicDownloadController extends Controller
{
    public function module(Request $request, Record $record)
    {
        if ($record->type !== 'modules') {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $record->data ?? [];
        $downloads = (int)($data['downloads'] ?? 0);
        $data['downloads'] = $downloads + 1;
        $record->forceFill(['data' => $data])->save();

        return response()->json([
            'id' => $record->id,
            'url' => $data['url'] ?? null,
            'downloads' => $data['downloads'],
        ]);
    }

    public function studentWork(Request $request, Record $record)
    {
        if ($record->type !== 'studentWorks') {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $record->data ?? [];
        $downloads = (int)($data['downloads'] ?? 0);
        $data['downloads'] = $downloads + 1;
        $record->forceFill(['data' => $data])->save();

        return response()->json([
            'id' => $record->id,
            'url' => $data['url'] ?? null,
            'downloads' => $data['downloads'],
        ]);
    }
}
