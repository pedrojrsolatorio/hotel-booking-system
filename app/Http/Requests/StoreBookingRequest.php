<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isCustomer() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'guests' => ['required', 'integer', 'min:1'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return; // don't run availability checks against invalid input
            }

            $room = Room::find($this->input('room_id'));

            if (! $room) {
                return;
            }

            if ($this->input('guests') > $room->capacity) {
                $validator->errors()->add('guests', "This room sleeps a maximum of {$room->capacity} guests.");
            }

            if (! $room->hasAvailability($this->input('check_in'), $this->input('check_out'))) {
                $validator->errors()->add('room_id', 'This room is no longer available for the selected dates.');
            }
        });
    }
}
