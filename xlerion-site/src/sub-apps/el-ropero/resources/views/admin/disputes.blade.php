@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Gestionar Disputas</h1>

        <div x-data="adminDisputes()" x-init="loadDisputes()" class="space-y-6">
            <!-- Filters -->
            <div class="bg-secondary rounded-lg p-4 flex gap-4">
                <select x-model="filters.status" @change="loadDisputes()" class="input-field">
                    <option value="">Todos</option>
                    <option value="open">Abierto</option>
                    <option value="in_review">En Revisión</option>
                    <option value="resolved">Resuelto</option>
                </select>
            </div>

            <!-- Disputes -->
            <div x-show="loading" class="text-center text-gray-400 py-8">
                Cargando disputas...
            </div>

            <div x-show="!loading && disputes.length > 0" class="space-y-4">
                <template x-for="dispute in disputes" :key="dispute.id">
                    <div class="bg-secondary rounded-lg p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-lg" x-text="`Disputa #${dispute.id}`"></h3>
                                <p class="text-gray-400 text-sm" x-text="`${dispute.buyer_name} vs ${dispute.seller_name}`"></p>
                            </div>
                            <span 
                                class="badge"
                                :class="{
                                    'badge-active': dispute.status === 'open',
                                    'badge-closed': dispute.status === 'resolved',
                                }"
                                x-text="dispute.status"
                            ></span>
                        </div>

                        <p class="text-gray-300 mb-4" x-text="dispute.description"></p>

                        <div x-show="dispute.status === 'open'" class="flex gap-2">
                            <button 
                                @click="resolveDispute(dispute.id, 'buyer')"
                                class="btn-primary flex-1"
                            >
                                Favorecer Comprador
                            </button>
                            <button 
                                @click="resolveDispute(dispute.id, 'seller')"
                                class="btn-secondary flex-1"
                            >
                                Favorecer Vendedor
                            </button>
                        </div>
                    </div>
                </template>
            </div>

            <div x-show="!loading && disputes.length === 0" class="text-center py-8 text-gray-400">
                No hay disputas abiertas
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function adminDisputes() {
        return {
            loading: true,
            disputes: [],
            filters: { status: '' },

            async loadDisputes() {
                this.loading = true;
                try {
                    const { data } = await axios.get('/api/admin/disputes', {
                        params: this.filters,
                    });
                    this.disputes = data.data || data;
                } catch (err) {
                    console.error('Error loading disputes:', err);
                    notificationService.error('Error al cargar disputas');
                } finally {
                    this.loading = false;
                }
            },

            async resolveDispute(id, favored) {
                try {
                    await axios.patch(`/api/admin/disputes/${id}`, { favored });
                    notificationService.success('Disputa resuelta');
                    this.loadDisputes();
                } catch (err) {
                    notificationService.error('Error al resolver disputa');
                }
            },
        };
    }
</script>
@endpush
@endsection
