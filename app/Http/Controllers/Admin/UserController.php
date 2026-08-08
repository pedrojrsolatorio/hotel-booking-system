<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Room::class); // any admin

        $search = $request->string('search')->toString();

        $users = User::query()
            ->withCount('bookings')
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => ['search' => $search],
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $this->authorize('viewAny', Room::class); // any admin

        $request->validate([
            'role' => ['required', Rule::in(['customer', 'admin'])],
        ]);

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['role' => "You can't change your own role."]);
        }

        $user->update(['role' => $request->input('role')]);

        return back()->with('success', "{$user->name}'s role updated to {$user->role}.");
    }
}
