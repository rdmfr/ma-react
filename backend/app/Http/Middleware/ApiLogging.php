<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware untuk logging API requests dan responses
 * Membantu debugging dan monitoring dalam production
 */
class ApiLogging
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $user = $request->user();

        // Log incoming request
        Log::channel('api')->debug('API Request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'user' => $user?->email ?? $user?->name ?? 'anonymous',
            'ip' => $request->ip(),
            'query' => $request->query(),
        ]);

        $response = $next($request);

        // Log response
        $duration = round((microtime(true) - $startTime) * 1000); // ms
        $logLevel = $response->getStatusCode() >= 400 ? 'warning' : 'info';

        Log::channel('api')->log($logLevel, 'API Response', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'user' => $user?->email ?? $user?->name ?? 'anonymous',
        ]);

        return $response;
    }
}
