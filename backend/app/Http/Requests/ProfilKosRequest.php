<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfilKosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_kos' => ['required', 'string', 'max:100'],
            'tagline' => ['required', 'string', 'max:200'],
            'deskripsi' => ['required', 'string'],
            'alamat' => ['required', 'string'],
            'link_maps' => ['nullable', 'url', 'max:255'],
            'no_whatsapp_admin' => ['required', 'regex:/^\d{10,15}$/'],
            'email_admin' => ['required', 'email', 'max:150'],
            'fasilitas_umum' => ['required', 'array', 'min:1'],
            'fasilitas_umum.*' => ['required', 'string', 'max:100'],
            'tata_tertib' => ['required', 'array', 'min:1'],
            'tata_tertib.*' => ['required', 'string'],
        ];
    }
}
