<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AmenitiesController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Amenities/Index');
    }
}
