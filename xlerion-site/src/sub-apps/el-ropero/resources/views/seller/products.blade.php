@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold">Mis Prendas</h1>
            <a href="{{ route('seller.products.create') }}" class="btn-primary">
                ➕ Crear Prenda
            </a>
        </div>

        <div x-data="productList()" x-init="loadProducts()" class="space-y-4">
            <!-- Loading state -->
            <div x-show="loading" class="text-center py-12 text-gray-400">
                Cargando prendas...
            </div>

            <!-- Products list -->
            <div x-show="!loading" class="space-y-4">
                <template x-for="product in products" :key="product.id">
                    <div class="bg-secondary rounded-lg p-4 flex items-center justify-between">
                        <div class="flex gap-4 flex-1">
                            <img 
                                :src="product.image_url || 'https://via.placeholder.com/100x100'"
                                :alt="product.title"
                                class="w-24 h-24 object-cover rounded"
                            >
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold" x-text="product.title"></h3>
                                <div class="text-sm text-gray-400 mt-1">
                                    <div x-text="`Marca: ${product.brand || 'N/A'}`"></div>
                                    <div x-text="`Estado: ${product.condition || 'N/A'}`"></div>
                                </div>
                                <div class="text-primary font-semibold mt-2" x-text="`$${Number(product.base_price || 0).toLocaleString('es-CO')}`"></div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <a 
                                :href="`{{ route('seller.products.edit', ['id' => '']) }}${product.id}`"
                                class="btn-sm btn-secondary"
                            >
                                ✏️ Editar
                            </a>
                            <button 
                                @click="deleteProduct(product.id)"
                                class="btn-sm bg-red-900 text-red-100 px-3 py-1 rounded hover:bg-red-800"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Empty state -->
            <div x-show="!loading && products.length === 0" class="text-center py-12 text-gray-400">
                <p>No tienes prendas creadas aún</p>
                <a href="{{ route('seller.products.create') }}" class="btn-primary inline-block mt-4">
                    Crear la primera prenda
                </a>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function productList() {
        return {
            loading: true,
            products: [],

            async loadProducts() {
                try {
                    const { data } = await axios.get('/api/products', { 
                        params: { mine: true } 
                    });
                    this.products = data.data || data;
                } catch (err) {
                    console.error('Error loading products:', err);
                    notificationService.error('Error al cargar prendas');
                } finally {
                    this.loading = false;
                }
            },

            async deleteProduct(id) {
                if (!confirm('¿Estás seguro de que quieres eliminar esta prenda?')) return;

                try {
                    await axios.delete(`/api/products/${id}`);
                    this.products = this.products.filter(p => p.id !== id);
                    notificationService.success('Prenda eliminada');
                } catch (err) {
                    notificationService.error('Error al eliminar prenda');
                }
            },
        };
    }
</script>
@endpush
@endsection
