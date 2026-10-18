@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-secondary rounded-lg p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">El Ropero</h1>
            <p class="text-gray-400">Inicia sesión en tu cuenta</p>
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

        <form method="POST" action="{{ route('login') }}" class="space-y-4">
            @csrf

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
                    autocomplete="current-password"
                >
            </div>

            <!-- Remember me -->
            <div class="flex items-center">
                <input 
                    id="remember" 
                    type="checkbox" 
                    name="remember" 
                    class="w-4 h-4 rounded"
                >
                <label for="remember" class="ml-2 text-sm">Recuerda mi sesión</label>
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-primary w-full">
                Iniciar Sesión
            </button>
        </form>

        <!-- Links -->
        <div class="mt-6 space-y-3 text-sm">
            <div class="text-center">
                <a href="{{ route('password.request') }}" class="text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
            <div class="text-center text-gray-400">
                ¿No tienes cuenta? 
                <a href="{{ route('register') }}" class="text-primary hover:underline">Regístrate aquí</a>
            </div>
        </div>
    </div>
</div>
@endsection
