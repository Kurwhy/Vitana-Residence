<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKeluhanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:menunggu,diproses,selesai'],
            'tanggapan_admin' => [
                'nullable',
                'string',
                Rule::requiredIf($this->input('status') === 'selesai'),
                'min:10',
            ],
        ];
    }
}
