<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $userPermissions = $request->user()->getPermissions();

        // Check if user has wildcard permission (super admin)
        if (in_array('*', $userPermissions)) {
            return $next($request);
        }

        // Check if user has the specific permission
        if (!in_array($permission, $userPermissions)) {
            return response()->json([
                'message' => 'Unauthorized. You do not have the required permission.',
                'required_permission' => $permission
            ], 403);
        }

        return $next($request);
    }
}