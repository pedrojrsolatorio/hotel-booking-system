<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'type' => ['sometimes', 'required', Rule::in(['Standard', 'Deluxe', 'Suite', 'Executive Suite'])],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'capacity' => ['sometimes', 'required', 'integer', 'min:1', 'max:20'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:100'],
            'total_units' => ['sometimes', 'required', 'integer', 'min:1'],
            'status' => ['sometimes', 'required', Rule::in(['available', 'unavailable', 'maintenance'])],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
        ];
    }
}
