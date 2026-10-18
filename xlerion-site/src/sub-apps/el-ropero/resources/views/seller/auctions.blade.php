@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Mis Subastas</h1>

        <div x-data="sellerAuctions()" x-init="loadAuctions()" class="space-y-6">
            <!-- Filters -->
            <div class="bg-secondary rounded-lg p-4 flex gap-4">
                <select x-model="filters.status" @change="loadAuctions()" class="input-field">
                    <option value="">Todos</option>
                    <option value="active">Activas</option>
                    <option value="closed">Cerradas</option>
                    <option value="expired">Expiradas</option>
                </select>
            </div>

            <!-- Auctions -->
            <div x-show="loading" class="text-center text-gray-400 py-8">
                Cargando subastas...
            </div>

            <div x-show="!loading && auctions.length > 0" class="space-y-4">
                <template x-for="auction in auctions" :key="auction.id">
                    <div class="bg-secondary rounded-lg p-6 flex gap-4">
                        <img 
                            :src="auction.image_url || 'https://via.placeholder.com/100x100'"
                            :alt="auction.title"
                            class="w-24 h-24 object-cover rounded"
                        >
                        <div class="flex-1">
                            <h3 class="font-bold text-lg" x-text="auction.title"></h3>
                            <div class="text-sm text-gray-400 mt-1 space-y-1">
                                <div x-text="`Pujas: ${auction.bids_count || 0}`"></div>
                                <div x-text="`Puja Actual: $${Number(auction.current_bid || 0).toLocaleString('es-CO')}`"></div>
                                <div x-text="`Estado: ${auction.status}`"></div>
                            </div>
                        </div>
                        <div class="text-right">
                            <span 
                                class="badge"
                                :class="{
                                    'badge-active': auction.status === 'active',
                                    'badge-closed': auction.status === 'closed',
                                    'badge-expired': auction.status === 'expired',
                                }"
                                x-text="auction.status"
                            ></span>
                            <div class="mt-4 space-y-1">
                                <a 
                                    :href="`{{ route('auctions.show', ['id' => '']) }}${auction.id}`"
                                    class="block text-primary hover:underline text-sm"
                                >
                                    Ver
                                </a>
                                <a 
                                    x-show="auction.status === 'active'"
                                    :href="`{{ route('seller.products.edit', ['id' => '']) }}${auction.product_id}`"
                                    class="block text-primary hover:underline text-sm"
                                >
                                    Editar
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div x-show="!loading && auctions.length === 0" class="text-center py-8 text-gray-400">
                <p>No tienes subastas</p>
                <a href="{{ route('seller.products.create') }}" class="btn-primary inline-block mt-4">
                    Crear una prenda
                </a>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function sellerAuctions() {
        return {
            loading: true,
            auctions: [],
            filters: { status: '' },

            async loadAuctions() {
                this.loading = true;
                try {
                    const { data } = await axios.get('/api/auctions', {
                        params: { seller: true, ...this.filters },
                    });
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
