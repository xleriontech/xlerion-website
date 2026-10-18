@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-secondary rounded-lg p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">El Ropero</h1>
            <p class="text-gray-400">Crea tu cuenta</p>
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

        <form method="POST" action="{{ route('register') }}" class="space-y-4">
            @csrf

            <!-- Name -->
            <div>
                <label for="name" class="block text-sm font-medium mb-2">Nombre Completo</label>
                <input 
                    id="name" 
                    type="text" 
                    name="name" 
                    class="input-field w-full" 
                    placeholder="Tu nombre"
                    value="{{ old('name') }}"
                    required
                    autocomplete="name"
                >
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium mb-2">Correo Electrónico</label>
                <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    class="input-field w-full" 
                    placeholder="tu@email.com"
                    value="{{ old('email') }}"
                    required
                    autocomplete="email"
                >
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block text-sm font-medium mb-2">Contraseña</label>
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    class="input-field w-full" 
                    placeholder="••••••••"
                    required
                    autocomplete="new-password"
                >
                <p class="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
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

            <!-- Terms -->
            <div class="flex items-start">
                <input 
                    id="terms" 
                    type="checkbox" 
                    name="terms" 
                    class="w-4 h-4 rounded mt-1"
                    required
                >
                <label for="terms" class="ml-2 text-sm">
                    Acepto los 
                    <a href="#" class="text-primary hover:underline">términos de servicio</a> 
                    y la 
                    <a href="#" class="text-primary hover:underline">política de privacidad</a>
                </label>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-primary w-full">
                Registrarse
            </button>
        </form>

        <!-- Link -->
        <div class="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta? 
            <a href="{{ route('login') }}" class="text-primary hover:underline">Inicia sesión aquí</a>
        </div>
    </div>
</div>
@endsection
