@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen">
    <div class="container-app py-8">
        <h1 class="text-4xl font-bold mb-8">Todas las Subastas</h1>

        <div x-data="auctionList()" x-init="loadAuctions()" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Sidebar filters -->
            <aside class="lg:col-span-1">
                <div class="bg-secondary rounded-lg p-6 sticky top-20">
                    <h2 class="text-xl font-bold mb-6">Filtros</h2>

                    <!-- Search -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Búsqueda</label>
                        <input 
                            type="text" 
                            x-model="filters.search"
                            @input="debounce(() => loadAuctions(), 500)"
                            placeholder="Buscar prendas..."
                            class="input-field w-full"
                        >
                    </div>

                    <!-- Status -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-3">Estado</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    x-model="filters.status" 
                                    value="active"
                                    @change="loadAuctions()"
                                    class="w-4 h-4 rounded"
                                >
                                <span class="ml-2">Activas</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    x-model="filters.status" 
                                    value="closed"
                                    @change="loadAuctions()"
                                    class="w-4 h-4 rounded"
                                >
                                <span class="ml-2">Cerradas</span>
                            </label>
                        </div>
                    </div>

                    <!-- Price range -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Precio Máximo</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="10000000" 
                            step="50000"
                            x-model="filters.maxPrice"
                            @input="debounce(() => loadAuctions(), 500)"
                            class="w-full"
                        >
                        <div class="text-sm text-gray-400 mt-2">
                            Hasta: $<span x-text="Number(filters.maxPrice).toLocaleString('es-CO')"></span>
                        </div>
                    </div>

                    <!-- Brand -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Marca</label>
                        <select 
                            x-model="filters.brand"
                            @change="loadAuctions()"
                            class="input-field w-full"
                        >
                            <option value="">Todas las marcas</option>
                            <option value="mag&co">Mag&co</option>
                            <option value="premium">Premium</option>
                            <option value="vintage">Vintage</option>
                        </select>
                    </div>

                    <!-- Reset filters -->
                    <button 
                        @click="resetFilters()"
                        class="btn-secondary w-full"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </aside>

            <!-- Main content -->
            <main class="lg:col-span-3">
                <!-- Results info -->
                <div class="mb-6 flex items-center justify-between">
                    <div class="text-gray-400">
                        Mostrando <span x-text="auctions.length"></span> subastas
                    </div>
                    <select 
                        x-model="filters.sortBy"
                        @change="loadAuctions()"
                        class="input-field max-w-xs"
                    >
                        <option value="-created_at">Más Recientes</option>
                        <option value="current_bid">Menor Precio</option>
                        <option value="-current_bid">Mayor Precio</option>
                        <option value="end_date">Terminan Pronto</option>
                    </select>
                </div>

                <!-- Loading state -->
                <div x-show="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    @for($i = 0; $i < 6; $i++)
                        @include('components.skeleton-card')
                    @endfor
                </div>

                <!-- Auctions grid -->
                <div x-show="!loading" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <template x-for="auction in auctions" :key="auction.id">
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
                                <div class="text-sm text-gray-400 mb-3">
                                    <span x-text="auction.brand || 'N/A'"></span> •
                                    <span x-text="auction.condition || 'N/A'"></span>
                                </div>
                                <div class="mb-4 pb-4 border-b border-gray-700">
                                    <div class="text-sm text-gray-400">Puja actual</div>
                                    <div class="text-2xl font-bold text-primary" x-text="`$${Number(auction.current_bid || 0).toLocaleString('es-CO')}`"></div>
                                </div>
                                <div class="text-sm text-gray-400 mb-4">
                                    <span x-text="`${auction.bids_count || 0} pujas`"></span>
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

                <!-- Empty state -->
                <div x-show="!loading && auctions.length === 0" class="text-center py-12">
                    <p class="text-gray-400 text-lg">No se encontraron subastas</p>
                    <button @click="resetFilters()" class="btn-primary mt-4">
                        Limpiar Filtros
                    </button>
                </div>

                <!-- Pagination -->
                <div x-show="!loading && totalPages > 1" class="mt-12 flex justify-center gap-2">
                    <button 
                        @click="previousPage()"
                        :disabled="currentPage === 1"
                        class="btn-secondary disabled:opacity-50"
                    >
                        ← Anterior
                    </button>
                    <div class="flex items-center gap-1">
                        <span class="text-gray-400">
                            Página <span x-text="currentPage"></span> de <span x-text="totalPages"></span>
                        </span>
                    </div>
                    <button 
                        @click="nextPage()"
                        :disabled="currentPage === totalPages"
                        class="btn-secondary disabled:opacity-50"
                    >
                        Siguiente →
                    </button>
                </div>
            </main>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function auctionList() {
        return {
            loading: true,
            auctions: [],
            currentPage: 1,
            totalPages: 1,
            filters: {
                search: '',
                status: ['active'],
                maxPrice: 10000000,
                brand: '',
                sortBy: '-created_at',
            },
            debounceTimer: null,

            debounce(fn, wait) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(fn, wait);
            },

            async loadAuctions() {
                this.loading = true;
                try {
                    const params = {
                        page: this.currentPage,
                        search: this.filters.search,
                        status: this.filters.status.join(','),
                        maxPrice: this.filters.maxPrice,
                        brand: this.filters.brand,
                        sortBy: this.filters.sortBy,
                    };
                    const { data } = await axios.get('/api/auctions', { params });
                    this.auctions = data.data || data.data || [];
                    this.totalPages = data.meta?.last_page || 1;
                } catch (err) {
                    console.error('Error loading auctions:', err);
                    notificationService.error('Error al cargar subastas');
                } finally {
                    this.loading = false;
                }
            },

            resetFilters() {
                this.filters = {
                    search: '',
                    status: ['active'],
                    maxPrice: 10000000,
                    brand: '',
                    sortBy: '-created_at',
                };
                this.currentPage = 1;
                this.loadAuctions();
            },

            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.loadAuctions();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            },

            previousPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadAuctions();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            },
        };
    }
</script>
@endpush
@endsection
