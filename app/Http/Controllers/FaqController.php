<?php

namespace App\Http\Controllers;

use App\Http\Resources\FaqResource;
use App\Models\Faq;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $faqs = Faq::query()->orderBy('sort_order')->get();

        return Inertia::render('Faq/Index', [
            'faqs' => FaqResource::collection($faqs)->resolve(),
        ]);
    }
}
