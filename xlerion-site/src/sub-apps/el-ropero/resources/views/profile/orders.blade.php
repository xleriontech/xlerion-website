@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Mis Compras</h1>

        <div x-data="ordersList()" x-init="loadOrders()" class="space-y-6">
            <!-- Filters -->
            <div class="bg-secondary rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                <input 
                    type="text" 
                    x-model="filters.search"
                    @input="loadOrders()"
                    placeholder="Buscar por número de orden..."
                    class="input-field flex-1"
                >
                <select x-model="filters.status" @change="loadOrders()" class="input-field">
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                </select>
            </div>

            <!-- Orders list -->
            <div x-show="loading" class="text-center text-gray-400 py-8">
                Cargando órdenes...
            </div>

            <div x-show="!loading && orders.length > 0" class="space-y-4">
                <template x-for="order in orders" :key="order.id">
                    <div class="bg-secondary rounded-lg p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-lg" x-text="`Orden #${order.id}`"></h3>
                                <p class="text-gray-400 text-sm" x-text="`${formatDate(order.created_at)}`"></p>
                            </div>
                            <span 
                                class="badge"
                                :class="{
                                    'badge-active': order.status === 'pending',
                                    'badge-closed': order.status === 'paid',
                                    'badge-expired': order.status === 'delivered',
                                }"
                                x-text="order.status"
                            ></span>
                        </div>

                        <div class="space-y-2 mb-4">
                            <template x-for="item in order.items" :key="item.id">
                                <div class="flex justify-between text-sm">
                                    <span x-text="`${item.product_title} (x${item.quantity})`"></span>
                                    <span x-text="`$${Number(item.price * item.quantity).toLocaleString('es-CO')}`"></span>
                                </div>
                            </template>
                        </div>

                        <div class="border-t border-gray-700 pt-4 flex justify-between items-center">
                            <div>
                                <p class="text-sm text-gray-400">Total</p>
                                <p class="text-xl font-bold text-primary" x-text="`$${Number(order.total).toLocaleString('es-CO')}`"></p>
                            </div>
                            <a 
                                :href="`/profile/orders/${order.id}`"
                                class="btn-secondary"
                            >
                                Ver Detalles
                            </a>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Empty state -->
            <div x-show="!loading && orders.length === 0" class="text-center py-12 text-gray-400">
                <p class="mb-4">No tienes órdenes aún</p>
                <a href="{{ route('auctions.index') }}" class="btn-primary inline-block">
                    Explorar Subastas
                </a>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function ordersList() {
        return {
            loading: true,
            orders: [],
            filters: {
                search: '',
                status: '',
            },

            formatDate(date) {
                return new Date(date).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },

            async loadOrders() {
                this.loading = true;
                try {
                    const { data } = await axios.get('/api/profile/orders', {
                        params: this.filters,
                    });
                    this.orders = data.data || data;
                } catch (err) {
                    console.error('Error loading orders:', err);
                    notificationService.error('Error al cargar órdenes');
                } finally {
                    this.loading = false;
                }
            },
        };
    }
</script>
@endpush
@endsection
