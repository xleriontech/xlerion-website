@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-secondary rounded-lg p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">Recuperar Contraseña</h1>
            <p class="text-gray-400">Te enviaremos un enlace para restablecer tu contraseña</p>
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

        @if (session('status'))
            <div class="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg mb-6">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('password.email') }}" class="space-y-4">
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

            <!-- Submit -->
            <button type="submit" class="btn-primary w-full">
                Enviar Enlace de Recuperación
            </button>
        </form>

        <!-- Link -->
        <div class="mt-6 text-center text-sm text-gray-400">
            <a href="{{ route('login') }}" class="text-primary hover:underline">Volver a iniciar sesión</a>
        </div>
    </div>
</div>
@endsection
