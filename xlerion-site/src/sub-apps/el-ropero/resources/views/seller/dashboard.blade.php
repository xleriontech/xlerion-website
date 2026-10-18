@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <!-- Stats cards -->
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary mb-2">12</div>
                <div class="text-gray-400">Prendas Activas</div>
            </div>
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary mb-2">$45,000</div>
                <div class="text-gray-400">Ingresos Este Mes</div>
            </div>
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary mb-2">4.8</div>
                <div class="text-gray-400">Calificación</div>
            </div>
            <div class="bg-secondary rounded-lg p-6 text-center">
                <div class="text-3xl font-bold text-primary mb-2">89</div>
                <div class="text-gray-400">Ventas Completadas</div>
            </div>
        </div>

        <!-- Quick actions -->
        <div class="bg-secondary rounded-lg p-6 mb-8">
            <h2 class="text-2xl font-bold mb-4">Acciones Rápidas</h2>
            <div class="flex flex-col sm:flex-row gap-4">
                <a href="{{ route('seller.products.create') }}" class="btn-primary">
                    ➕ Crear Nueva Prenda
                </a>
                <a href="{{ route('seller.auctions') }}" class="btn-secondary">
                    📊 Ver Mis Subastas
                </a>
                <a href="{{ route('profile') }}" class="btn-secondary">
                    👤 Mi Perfil
                </a>
            </div>
        </div>

        <!-- Recent activity -->
        <div class="bg-secondary rounded-lg p-6">
            <h2 class="text-2xl font-bold mb-4">Actividad Reciente</h2>
            <div class="space-y-3 text-gray-400">
                <p>No hay actividad reciente</p>
            </div>
        </div>
    </div>
</div>
@endsection
