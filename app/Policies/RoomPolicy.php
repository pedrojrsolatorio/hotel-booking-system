<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;

class RoomPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function viewAny(User $user): bool
    {
        return true; // public listing, controller handles guest access separately
    }

    public function view(User $user, Room $room): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Room $room): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Room $room): bool
    {
        return $user->isAdmin();
    }
}
