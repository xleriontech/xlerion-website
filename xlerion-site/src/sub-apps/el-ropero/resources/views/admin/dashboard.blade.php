@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Panel de Administración</h1>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary">245</div>
                <div class="text-gray-400">Subastas Activas</div>
            </div>
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary">1,230</div>
                <div class="text-gray-400">Usuarios</div>
            </div>
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary">8</div>
                <div class="text-gray-400">Disputas Pendientes</div>
            </div>
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary">98.5%</div>
                <div class="text-gray-400">Satisfacción</div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="{{ route('admin.listings') }}" class="bg-secondary hover:shadow-lg rounded-lg p-6 transition">
                <div class="text-4xl mb-2">📋</div>
                <h2 class="font-bold">Moderación de Listados</h2>
                <p class="text-gray-400 text-sm mt-1">Revisar y aprobar subastas</p>
            </a>

            <a href="{{ route('admin.disputes') }}" class="bg-secondary hover:shadow-lg rounded-lg p-6 transition">
                <div class="text-4xl mb-2">⚖️</div>
                <h2 class="font-bold">Gestionar Disputas</h2>
                <p class="text-gray-400 text-sm mt-1">Resolver conflictos entre usuarios</p>
            </a>

            <a href="{{ route('admin.users') }}" class="bg-secondary hover:shadow-lg rounded-lg p-6 transition">
                <div class="text-4xl mb-2">👥</div>
                <h2 class="font-bold">Gestionar Usuarios</h2>
                <p class="text-gray-400 text-sm mt-1">Ver y administrar cuentas</p>
            </a>
        </div>
    </div>
</div>
@endsection
