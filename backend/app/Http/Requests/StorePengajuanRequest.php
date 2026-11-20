<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePengajuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kamar_id' => ['required', 'integer', 'exists:kamar,id'],
            'nama_lengkap' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'no_whatsapp' => ['required', 'regex:/^\d{10,15}$/'],
            'status_penghuni' => ['required', 'in:mahasiswi,karyawati'],
            'nama_instansi' => ['required', 'string', 'max:120'],
            'nama_kontak_darurat' => ['required', 'string', 'max:100'],
            'no_kontak_darurat' => ['required', 'regex:/^\d{10,15}$/'],
            'tanggal_mulai_masuk' => [
                'required',
                'date',
                'after_or_equal:today',
                'before_or_equal:'.now()->addDays(30)->toDateString(),
            ],
            'foto_identitas' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'catatan_penyewa' => ['nullable', 'string'],
        ];
    }
}
