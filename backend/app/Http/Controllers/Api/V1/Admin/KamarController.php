<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KamarRequest;
use App\Models\Kamar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KamarController extends Controller
{
    public function index()
    {
        $kamar = Kamar::orderBy('nomor_kamar')->paginate(15);

        return response()->json($kamar);
    }

    public function store(KamarRequest $request)
    {
        $data = $request->validated();
        $data['nomor_kamar'] = strtoupper($data['nomor_kamar']);
        $data['foto_utama'] = $request->hasFile('foto_utama')
            ? $request->file('foto_utama')->store('kamar', 'public')
            : null;

        $galeri = [];
        foreach ($request->file('galeri_foto', []) as $file) {
            $galeri[] = $file->store('kamar', 'public');
        }
        $data['galeri_foto'] = $galeri;

        $kamar = Kamar::create($data);

        return response()->json([
            'message' => 'Kamar berhasil ditambahkan.',
            'data' => $kamar,
        ], 201);
    }

    public function show(Kamar $kamar)
    {
        return response()->json(['data' => $kamar]);
    }

    public function update(KamarRequest $request, Kamar $kamar)
    {
        $data = $request->validated();

        if ($kamar->status === 'terisi' && $data['status'] !== 'terisi') {
            return response()->json([
                'message' => 'Kamar sedang ditempati. Status hanya dapat diubah setelah penghuni diproses keluar.',
            ], 422);
        }

        $data['nomor_kamar'] = strtoupper($data['nomor_kamar']);

        if ($request->hasFile('foto_utama')) {
            if ($kamar->foto_utama) {
                Storage::disk('public')->delete($kamar->foto_utama);
            }
            $data['foto_utama'] = $request->file('foto_utama')->store('kamar', 'public');
        } elseif ($request->boolean('hapus_foto_utama')) {
            if ($kamar->foto_utama) {
                Storage::disk('public')->delete($kamar->foto_utama);
            }
            $data['foto_utama'] = null;
        } else {
            unset($data['foto_utama']);
        }

        $oldGallery = $kamar->galeri_foto ?? [];
        $keptGallery = $oldGallery;

        if ($request->has('galeri_foto_lama')) {
            $requested = json_decode((string) $request->input('galeri_foto_lama'), true);
            $requested = is_array($requested) ? $requested : [];
            $keptGallery = array_values(array_intersect($oldGallery, $requested));
        }

        foreach (array_diff($oldGallery, $keptGallery) as $removed) {
            Storage::disk('public')->delete($removed);
        }

        foreach ($request->file('galeri_foto', []) as $file) {
            $keptGallery[] = $file->store('kamar', 'public');
        }

        $data['galeri_foto'] = $keptGallery;
        $kamar->update($data);

        return response()->json([
            'message' => 'Data kamar berhasil diperbarui.',
            'data' => $kamar->fresh(),
        ]);
    }

    public function destroy(Kamar $kamar)
    {
        if ($kamar->penghuni()->exists() || $kamar->tagihan()->exists()) {
            return response()->json([
                'message' => 'Kamar memiliki riwayat penghuni atau tagihan sehingga tidak dapat dihapus.',
            ], 422);
        }

        if ($kamar->foto_utama) {
            Storage::disk('public')->delete($kamar->foto_utama);
        }

        foreach ($kamar->galeri_foto ?? [] as $foto) {
            Storage::disk('public')->delete($foto);
        }

        $kamar->delete();

        return response()->json(['message' => 'Kamar berhasil dihapus.']);
    }
}
