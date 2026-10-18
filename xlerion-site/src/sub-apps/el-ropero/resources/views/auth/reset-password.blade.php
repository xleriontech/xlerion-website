@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-secondary rounded-lg p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">Restablecer Contraseña</h1>
            <p class="text-gray-400">Ingresa tu nueva contraseña</p>
        </div>

        @if ($errors->any())
            <div class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
                <ul class="text-sm">
                    @foreach ($errors->all() as $error)
                        <li>• {{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('password.update') }}" class="space-y-4">
            @csrf
            <input type="hidden" name="token" value="{{ $token }}">

            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium mb-2">Correo Electrónico</label>
                <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    class="input-field w-full" 
                    placeholder="tu@email.com"
                    value="{{ old('email', $email) }}"
                    required
                    autocomplete="email"
                >
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block text-sm font-medium mb-2">Nueva Contraseña</label>
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    class="input-field w-full" 
                    placeholder="••••••••"
                    required
                    autocomplete="new-password"
                >
            </div>

            <!-- Confirm Password -->
            <div>
                <label for="password_confirmation" class="block text-sm font-medium mb-2">Confirma tu Contraseña</label>
                <input 
                    id="password_confirmation" 
                    type="password" 
                    name="password_confirmation" 
                    class="input-field w-full" 
                    placeholder="••••••••"
                    required
                    autocomplete="new-password"
                >
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-primary w-full">
                Restablecer Contraseña
            </button>
        </form>
    </div>
</div>
@endsection
