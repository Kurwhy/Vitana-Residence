<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'no_whatsapp' => fake()->numerify('08##########'),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'penyewa',
            'is_active' => true,
        ];
    }
}
