@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Mis Ventas</h1>

        <div x-data="salesList()" x-init="loadSales()" class="space-y-6">
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-secondary rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-primary" x-text="totalSales"></div>
                    <p class="text-sm text-gray-400">Subastas Vendidas</p>
                </div>
                <div class="bg-secondary rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-primary" x-text="`$${Number(totalRevenue).toLocaleString('es-CO')}`"></div>
                    <p class="text-sm text-gray-400">Ingresos Totales</p>
                </div>
                <div class="bg-secondary rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-primary" x-text="`${rating.toFixed(1)}`"></div>
                    <p class="text-sm text-gray-400">Calificación</p>
                </div>
                <div class="bg-secondary rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-primary" x-text="reviewCount"></div>
                    <p class="text-sm text-gray-400">Valoraciones</p>
                </div>
            </div>

            <!-- Sales list -->
            <div x-show="loading" class="text-center text-gray-400 py-8">
                Cargando ventas...
            </div>

            <div x-show="!loading && sales.length > 0" class="space-y-4">
                <template x-for="sale in sales" :key="sale.id">
                    <div class="bg-secondary rounded-lg p-6">
                        <div class="flex gap-4 mb-4">
                            <img 
                                :src="sale.product_image || 'https://via.placeholder.com/80x80'"
                                :alt="sale.product_title"
                                class="w-20 h-20 object-cover rounded"
                            >
                            <div class="flex-1">
                                <h3 class="font-bold" x-text="sale.product_title"></h3>
                                <p class="text-sm text-gray-400" x-text="`Vendido a: ${sale.buyer_name}`"></p>
                                <p class="text-sm text-gray-400" x-text="`${formatDate(sale.sold_at)}`"></p>
                            </div>
                            <div class="text-right">
                                <div class="font-bold text-lg text-primary" x-text="`$${Number(sale.final_price).toLocaleString('es-CO')}`"></div>
                                <span 
                                    class="badge text-xs"
                                    :class="{
                                        'badge-active': sale.status === 'pending',
                                        'badge-closed': sale.status === 'shipped',
                                        'badge-expired': sale.status === 'delivered',
                                    }"
                                    x-text="sale.status"
                                ></span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Empty state -->
            <div x-show="!loading && sales.length === 0" class="text-center py-12 text-gray-400">
                <p class="mb-4">Aún no tienes ventas</p>
                <a href="{{ route('seller.products.create') }}" class="btn-primary inline-block">
                    Crear tu Primera Prenda
                </a>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function salesList() {
        return {
            loading: true,
            sales: [],
            totalSales: 0,
            totalRevenue: 0,
            rating: 0,
            reviewCount: 0,

            formatDate(date) {
                return new Date(date).toLocaleDateString('es-CO');
            },

            async loadSales() {
                this.loading = true;
                try {
                    const { data } = await axios.get('/api/profile/sales');
                    this.sales = data.data || data;
                    this.totalSales = data.total_sales || 0;
                    this.totalRevenue = data.total_revenue || 0;
                    this.rating = data.rating || 0;
                    this.reviewCount = data.review_count || 0;
                } catch (err) {
                    console.error('Error loading sales:', err);
                    notificationService.error('Error al cargar ventas');
                } finally {
                    this.loading = false;
                }
            },
        };
    }
</script>
@endpush
@endsection
