@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Sidebar menu -->
            <aside class="md:col-span-1">
                <div class="bg-secondary rounded-lg p-4 sticky top-20">
                    <nav class="space-y-2">
                        <a href="{{ route('profile') }}" class="block px-4 py-2 rounded-lg bg-primary text-dark font-semibold">
                            👤 Mi Perfil
                        </a>
                        <a href="{{ route('profile.orders') }}" class="block px-4 py-2 rounded-lg text-white hover:bg-gray-700">
                            📦 Mis Compras
                        </a>
                        <a href="{{ route('profile.sales') }}" class="block px-4 py-2 rounded-lg text-white hover:bg-gray-700">
                            💰 Mis Ventas
                        </a>
                        <hr class="my-2 border-gray-700">
                        <form method="POST" action="{{ route('logout') }}" class="block">
                            @csrf
                            <button type="submit" class="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-gray-700">
                                🚪 Cerrar Sesión
                            </button>
                        </form>
                    </nav>
                </div>
            </aside>

            <!-- Main content -->
            <main class="md:col-span-3">
                <div class="bg-secondary rounded-lg p-8">
                    <h1 class="text-3xl font-bold mb-8">Mi Perfil</h1>

                    <form method="POST" action="{{ route('profile.update') }}" class="space-y-6" enctype="multipart/form-data">
                        @csrf

                        <!-- Avatar -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Foto de Perfil</label>
                            <div class="flex gap-4 items-start">
                                <img 
                                    src="{{ auth()->user()->avatar_url ?? 'https://via.placeholder.com/100x100' }}" 
                                    alt="Avatar" 
                                    class="w-24 h-24 rounded-full object-cover"
                                >
                                <div class="flex-1">
                                    <input 
                                        type="file" 
                                        name="avatar" 
                                        accept="image/*"
                                        class="input-field"
                                    >
                                    <p class="text-xs text-gray-400 mt-1">JPG o PNG, máximo 2MB</p>
                                </div>
                            </div>
                        </div>

                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Nombre Completo</label>
                            <input 
                                type="text" 
                                name="name" 
                                class="input-field w-full"
                                value="{{ auth()->user()->name }}"
                                required
                            >
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Correo Electrónico</label>
                            <input 
                                type="email" 
                                name="email" 
                                class="input-field w-full"
                                value="{{ auth()->user()->email }}"
                                required
                                disabled
                            >
                            <p class="text-xs text-gray-400 mt-1">No se puede cambiar</p>
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Teléfono</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                class="input-field w-full"
                                placeholder="+57 300 0000000"
                                value="{{ auth()->user()->phone ?? '' }}"
                            >
                        </div>

                        <!-- Bio -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Biografía</label>
                            <textarea 
                                name="bio" 
                                class="input-field w-full h-24 resize-none"
                                placeholder="Cuéntale a los compradores sobre ti..."
                            >{{ auth()->user()->bio ?? '' }}</textarea>
                        </div>

                        <!-- Address -->
                        <div class="border-t border-gray-700 pt-6">
                            <h2 class="text-lg font-bold mb-4">Dirección de Envío</h2>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    name="city" 
                                    class="input-field"
                                    placeholder="Ciudad"
                                    value="{{ auth()->user()->city ?? '' }}"
                                >
                                <input 
                                    type="text" 
                                    name="state" 
                                    class="input-field"
                                    placeholder="Departamento"
                                    value="{{ auth()->user()->state ?? '' }}"
                                >
                            </div>

                            <textarea 
                                name="address" 
                                class="input-field w-full mt-4 resize-none h-20"
                                placeholder="Dirección completa"
                            >{{ auth()->user()->address ?? '' }}</textarea>
                        </div>

                        <!-- Submit -->
                        <div class="flex gap-4 pt-6 border-t border-gray-700">
                            <button type="submit" class="btn-primary flex-1">
                                💾 Guardar Cambios
                            </button>
                        </div>
                    </form>

                    <!-- Change password section -->
                    <div class="border-t border-gray-700 mt-8 pt-8">
                        <h2 class="text-lg font-bold mb-4">Cambiar Contraseña</h2>
                        <form method="POST" action="{{ route('password.update') }}" class="space-y-4 max-w-md">
                            @csrf

                            <div>
                                <label class="block text-sm font-medium mb-2">Contraseña Actual</label>
                                <input 
                                    type="password" 
                                    name="current_password" 
                                    class="input-field w-full"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-2">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    class="input-field w-full"
                                    required
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium mb-2">Confirmar Contraseña</label>
                                <input 
                                    type="password" 
                                    name="password_confirmation" 
                                    class="input-field w-full"
                                    required
                                >
                            </div>

                            <button type="submit" class="btn-primary">
                                Actualizar Contraseña
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    </div>
</div>
@endsection
