@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Moderación de Listados</h1>

        <div x-data="adminListings()" x-init="loadListings()" class="space-y-6">
            <!-- Filters -->
            <div class="bg-secondary rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                <select x-model="filters.status" @change="loadListings()" class="input-field">
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente de Revisión</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                </select>
                <input 
                    type="text" 
                    x-model="filters.search"
                    @input="loadListings()"
                    placeholder="Buscar por título..."
                    class="input-field flex-1"
                >
            </div>

            <!-- Listings -->
            <div x-show="loading" class="text-center text-gray-400 py-8">
                Cargando listados...
            </div>

            <div x-show="!loading && listings.length > 0" class="space-y-4">
                <template x-for="listing in listings" :key="listing.id">
                    <div class="bg-secondary rounded-lg p-6">
                        <div class="flex gap-4 mb-4">
                            <img 
                                :src="listing.image_url || 'https://via.placeholder.com/100x100'"
                                :alt="listing.title"
                                class="w-24 h-24 object-cover rounded"
                            >
                            <div class="flex-1">
                                <h3 class="font-bold text-lg" x-text="listing.title"></h3>
                                <p class="text-gray-400 text-sm">
                                    <span x-text="`Vendedor: ${listing.seller_name}`"></span> • 
                                    <span x-text="`Creado: ${formatDate(listing.created_at)}`"></span>
                                </p>
                                <p class="text-sm mt-2 line-clamp-2" x-text="listing.description"></p>
                            </div>
                        </div>

                        <div class="border-t border-gray-700 pt-4 flex gap-2">
                            <button 
                                @click="approveListing(listing.id)"
                                class="btn-primary flex-1"
                                x-show="listing.status === 'pending'"
                            >
                                ✓ Aprobar
                            </button>
                            <button 
                                @click="rejectListing(listing.id)"
                                class="bg-red-900 hover:bg-red-800 text-red-100 px-4 py-2 rounded flex-1"
                                x-show="listing.status === 'pending'"
                            >
                                ✕ Rechazar
                            </button>
                            <span 
                                class="badge badge-closed flex-1 text-center"
                                x-show="listing.status !== 'pending'"
                                x-text="listing.status"
                            ></span>
                        </div>
                    </div>
                </template>
            </div>

            <div x-show="!loading && listings.length === 0" class="text-center py-8 text-gray-400">
                No hay listados para revisar
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function adminListings() {
        return {
            loading: true,
            listings: [],
            filters: {
                status: '',
                search: '',
            },

            formatDate(date) {
                return new Date(date).toLocaleDateString('es-CO');
            },

            async loadListings() {
                this.loading = true;
                try {
                    const { data } = await axios.get('/api/admin/listings', {
                        params: this.filters,
                    });
                    this.listings = data.data || data;
                } catch (err) {
                    console.error('Error loading listings:', err);
                    notificationService.error('Error al cargar listados');
                } finally {
                    this.loading = false;
                }
            },

            async approveListing(id) {
                try {
                    await axios.patch(`/api/admin/listings/${id}`, { status: 'approved' });
                    notificationService.success('Listado aprobado');
                    this.loadListings();
                } catch (err) {
                    notificationService.error('Error al aprobar listado');
                }
            },

            async rejectListing(id) {
                const reason = prompt('Razón del rechazo:');
                if (!reason) return;

                try {
                    await axios.patch(`/api/admin/listings/${id}`, {
                        status: 'rejected',
                        rejection_reason: reason,
                    });
                    notificationService.success('Listado rechazado');
                    this.loadListings();
                } catch (err) {
                    notificationService.error('Error al rechazar listado');
                }
            },
        };
    }
</script>
@endpush
@endsection
