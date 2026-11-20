<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CekPengajuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_pengajuan' => ['required', 'string', 'regex:/^BKG-\d{8}-\d{4}$/'],
            'no_whatsapp' => ['required', 'regex:/^\d{10,15}$/'],
        ];
    }
}
