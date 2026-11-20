<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KamarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kamar = $this->route('kamar');
        $kamarId = is_object($kamar) ? $kamar->id : $kamar;

        return [
            'nomor_kamar' => [
                'required',
                'string',
                'max:20',
                Rule::unique('kamar', 'nomor_kamar')->ignore($kamarId),
            ],
            'nama_tipe' => ['required', 'string', 'max:100'],
            'lantai' => ['required', 'integer', 'min:1'],
            'luas_kamar' => ['required', 'string', 'max:30'],
            'harga_bulanan' => ['required', 'numeric', 'gt:0'],
            'deskripsi' => ['nullable', 'string'],
            'fasilitas_kamar' => ['required', 'array', 'min:1'],
            'fasilitas_kamar.*' => ['required', 'string', 'max:100'],
            'foto_utama' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'galeri_foto' => ['nullable', 'array'],
            'galeri_foto.*' => ['image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'galeri_foto_lama' => ['nullable', 'string'],
            'hapus_foto_utama' => ['nullable', 'boolean'],
            'status' => ['required', 'in:tersedia,terisi,perawatan'],
        ];
    }
}
