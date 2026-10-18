@extends('layouts.app')

@section('content')
<div x-data="homePage()" x-init="loadAuctions()">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-secondary to-dark py-20">
        <div class="container-app text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
                <span class="text-primary">El Ropero Mag&co</span>
            </h1>
            <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Descubre subastas exclusivas de prendas de ropa de alta calidad. Puja, gana y disfruta del mejor estilo.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="{{ route('auctions.index') }}" class="btn-primary">
                    Explorar Subastas
                </a>
                <a href="{{ route('register') }}" class="btn-secondary">
                    Comenzar a Vender
                </a>
            </div>
        </div>
    </section>

    <!-- Featured Auctions -->
    <section class="py-16">
        <div class="container-app">
            <h2 class="text-3xl font-bold mb-8">Subastas Destacadas</h2>
            
            <!-- Skeleton loaders -->
            <div x-show="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @for($i = 0; $i < 4; $i++)
                    @include('components.skeleton-card')
                @endfor
            </div>

            <!-- Auctions grid -->
            <div x-show="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <template x-for="auction in auctions.slice(0, 4)" :key="auction.id">
                    <div class="card-auction">
                        <div class="relative overflow-hidden bg-gray-800 h-64">
                            <img 
                                :src="auction.image_url || 'https://via.placeholder.com/400x300'" 
                                :alt="auction.title"
                                class="w-full h-full object-cover hover:scale-105 transition-transform"
                                loading="lazy"
                            >
                            <div class="absolute top-4 right-4">
                                <span class="badge badge-active" x-show="auction.status === 'active'">Activa</span>
                                <span class="badge badge-closed" x-show="auction.status === 'closed'">Cerrada</span>
                                <span class="badge badge-expired" x-show="auction.status === 'expired'">Expirada</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2 line-clamp-2" x-text="auction.title"></h3>
                            <div class="text-sm text-gray-400 mb-3" x-text="`${auction.brand || 'N/A'} • ${auction.condition || 'N/A'}`"></div>
                            <div class="mb-4 pb-4 border-b border-gray-700">
                                <div class="text-sm text-gray-400">Puja actual</div>
                                <div class="text-2xl font-bold text-primary" x-text="`$${Number(auction.current_bid || 0).toLocaleString('es-CO')}`"></div>
                            </div>
                            <a 
                                :href="`{{ route('auctions.show', ['id' => '']) }}${auction.id}`"
                                class="btn-primary w-full text-center block"
                            >
                                Ver Subasta
                            </a>
                        </div>
                    </div>
                </template>
            </div>

            <!-- View all link -->
            <div class="text-center mt-12">
                <a href="{{ route('auctions.index') }}" class="btn-secondary">
                    Ver Todas las Subastas →
                </a>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-secondary">
        <div class="container-app">
            <h2 class="text-3xl font-bold mb-8">Categorías</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <template x-for="category in categories" :key="category">
                    <a 
                        :href="`{{ route('auctions.index') }}?category=${category}`"
                        class="p-4 bg-dark rounded-lg text-center hover:bg-primary hover:text-dark transition"
                    >
                        <span x-text="category" class="font-semibold"></span>
                    </a>
                </template>
            </div>
        </div>
    </section>

    <!-- How it works -->
    <section class="py-16">
        <div class="container-app">
            <h2 class="text-3xl font-bold mb-12 text-center">¿Cómo Funciona?</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="text-center">
                    <div class="text-4xl mb-4">🔍</div>
                    <h3 class="font-semibold mb-2">Buscar</h3>
                    <p class="text-gray-400 text-sm">Explora miles de prendas en subasta</p>
                </div>
                <div class="text-center">
                    <div class="text-4xl mb-4">💰</div>
                    <h3 class="font-semibold mb-2">Pujar</h3>
                    <p class="text-gray-400 text-sm">Realiza tu oferta antes que expire</p>
                </div>
                <div class="text-center">
                    <div class="text-4xl mb-4">🏆</div>
                    <h3 class="font-semibold mb-2">Ganar</h3>
                    <p class="text-gray-400 text-sm">Sé el mejor pujador y gana</p>
                </div>
                <div class="text-center">
                    <div class="text-4xl mb-4">📦</div>
                    <h3 class="font-semibold mb-2">Recibir</h3>
                    <p class="text-gray-400 text-sm">Tu prenda llegará a casa</p>
                </div>
            </div>
        </div>
    </section>
</div>

@push('scripts')
<script>
    function homePage() {
        return {
            loading: true,
            auctions: [],
            categories: ['Camisetas', 'Pantalones', 'Vestidos', 'Abrigos', 'Accesorios', 'Zapatos'],

            async loadAuctions() {
                try {
                    const { data } = await axios.get('/api/auctions', { params: { limit: 4 } });
                    this.auctions = data.data || data;
                } catch (err) {
                    console.error('Error loading auctions:', err);
                    notificationService.error('Error al cargar subastas');
                } finally {
                    this.loading = false;
                }
            },
        };
    }
</script>
@endpush
@endsection
