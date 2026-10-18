@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div x-data="auctionDetail()" x-init="loadAuction('{{ $id ?? request()->route('id') }}')" class="container-app">
        <!-- Breadcrumb -->
        <div class="mb-8 text-gray-400 text-sm">
            <a href="{{ route('home') }}" class="hover:text-primary">Inicio</a>
            <span> / </span>
            <a href="{{ route('auctions.index') }}" class="hover:text-primary">Subastas</a>
            <span> / </span>
            <span x-text="auction.title ? auction.title.substring(0, 30) + '...' : 'Cargando...'"></span>
        </div>

        <!-- Loading state -->
        <div x-show="loading" class="text-center py-12">
            <p class="text-gray-400">Cargando subasta...</p>
        </div>

        <!-- Main content -->
        <div x-show="!loading && auction.id" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Gallery section -->
            <div class="lg:col-span-2">
                <!-- Main image -->
                <div class="relative bg-gray-800 rounded-lg overflow-hidden mb-4 aspect-square">
                    <img 
                        :src="currentImage"
                        :alt="auction.title"
                        class="w-full h-full object-cover"
                    >
                    <div class="absolute top-4 right-4">
                        <span class="badge badge-active" x-show="auction.status === 'active'">Activa</span>
                        <span class="badge badge-closed" x-show="auction.status === 'closed'">Cerrada</span>
                        <span class="badge badge-expired" x-show="auction.status === 'expired'">Expirada</span>
                    </div>
                </div>

                <!-- Thumbnails -->
                <div x-show="auction.images && auction.images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
                    <template x-for="(image, index) in auction.images" :key="index">
                        <button 
                            @click="currentImageIndex = index"
                            class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2"
                            :class="currentImageIndex === index ? 'border-primary' : 'border-gray-700'"
                            :aria-label="`Imagen ${index + 1}`"
                        >
                            <img :src="image.thumbnail_url || image.url" :alt="`Imagen ${index + 1}`" class="w-full h-full object-cover">
                        </button>
                    </template>
                </div>

                <!-- Product details -->
                <div class="mt-8 bg-secondary rounded-lg p-6">
                    <h1 class="text-3xl font-bold mb-4" x-text="auction.title"></h1>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <div class="text-sm text-gray-400">Marca</div>
                            <div class="font-semibold" x-text="auction.brand || 'N/A'"></div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">Condición</div>
                            <div class="font-semibold" x-text="auction.condition || 'N/A'"></div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">Talla</div>
                            <div class="font-semibold" x-text="auction.size || 'N/A'"></div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">Pujas</div>
                            <div class="font-semibold" x-text="`${auction.bids_count || 0}`"></div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="mb-6 pb-6 border-b border-gray-700">
                        <h3 class="font-semibold mb-2">Descripción</h3>
                        <p class="text-gray-300 whitespace-pre-wrap" x-text="auction.description || 'Sin descripción'"></p>
                    </div>

                    <!-- Shipping & Returns -->
                    <div>
                        <h3 class="font-semibold mb-2">Envío y Devoluciones</h3>
                        <ul class="text-gray-300 text-sm space-y-1">
                            <li>✓ Envío a nivel nacional</li>
                            <li>✓ Devolución de 7 días</li>
                            <li>✓ Comprador protegido</li>
                        </ul>
                    </div>
                </div>

                <!-- Bid History -->
                <div class="mt-8 bg-secondary rounded-lg p-6">
                    <h3 class="text-xl font-bold mb-4">Historial de Pujas</h3>
                    
                    <div x-show="bids.length === 0" class="text-gray-400">
                        No hay pujas aún
                    </div>

                    <div x-show="bids.length > 0" class="space-y-3">
                        <template x-for="bid in bids.slice(0, 10)" :key="bid.id">
                            <div class="flex justify-between items-center pb-3 border-b border-gray-700 last:border-0">
                                <div>
                                    <div class="font-semibold" x-text="`${bid.user.name || 'Usuario'}`"></div>
                                    <div class="text-sm text-gray-400" x-text="`hace ${formatTimeAgo(bid.created_at)}`"></div>
                                </div>
                                <div class="text-primary font-bold" x-text="`$${Number(bid.amount).toLocaleString('es-CO')}`"></div>
                            </div>
                        </template>
                    </div>

                    <div x-show="bids.length > 10" class="mt-4">
                        <button @click="showAllBids = !showAllBids" class="btn-secondary w-full">
                            <span x-show="!showAllBids">Ver todas las pujas</span>
                            <span x-show="showAllBids">Ocultar</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <!-- Price card -->
                <div class="bg-secondary rounded-lg p-6 mb-6 sticky top-20">
                    <!-- Countdown timer -->
                    <div class="mb-6 pb-6 border-b border-gray-700">
                        <div class="text-sm text-gray-400 mb-2">Tiempo restante</div>
                        <div class="text-3xl font-bold text-primary" x-text="timeLeft"></div>
                        <div x-show="auction.status !== 'active'" class="mt-2 text-sm text-red-400">
                            Esta subasta ha finalizado
                        </div>
                    </div>

                    <!-- Current bid -->
                    <div class="mb-6 pb-6 border-b border-gray-700">
                        <div class="text-sm text-gray-400">Puja actual</div>
                        <div class="text-4xl font-bold text-primary" x-text="`$${Number(auction.current_bid || 0).toLocaleString('es-CO')}`"></div>
                        <div class="text-sm text-gray-400 mt-1" x-text="`${auction.bids_count || 0} pujas`"></div>
                    </div>

                    <!-- Minimum bid -->
                    <div class="mb-6 pb-6 border-b border-gray-700">
                        <div class="text-sm text-gray-400">Puja mínima</div>
                        <div class="font-bold" x-text="`$${Number(minimumBid).toLocaleString('es-CO')}`"></div>
                    </div>

                    <!-- Bid button or message -->
                    @auth
                        <button 
                            @click="openBidModal()"
                            :disabled="auction.status !== 'active'"
                            class="btn-primary w-full mb-2"
                            :class="{ 'opacity-50 cursor-not-allowed': auction.status !== 'active' }"
                        >
                            Realizar Puja
                        </button>
                    @else
                        <a href="{{ route('login') }}" class="btn-primary w-full text-center block mb-2">
                            Inicia sesión para pujar
                        </a>
                    @endauth

                    <!-- Share button -->
                    <button 
                        @click="shareAuction()"
                        class="btn-secondary w-full"
                    >
                        📤 Compartir
                    </button>
                </div>

                <!-- Seller info -->
                <div class="bg-secondary rounded-lg p-6" x-show="auction.seller">
                    <h3 class="font-bold mb-4">Vendedor</h3>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span class="text-dark font-bold" x-text="auction.seller.name.charAt(0)"></span>
                        </div>
                        <div>
                            <div class="font-semibold" x-text="auction.seller.name"></div>
                            <div class="text-sm text-gray-400">⭐ 4.8 (120 valoraciones)</div>
                        </div>
                    </div>
                    <a href="#" class="btn-secondary w-full text-center block">
                        Ver perfil del vendedor
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Bid Modal -->
    <div 
        x-data="bidModalData"
        x-show="showBidModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="showBidModal = false"
        style="display: none;"
    >
        <div class="bg-secondary rounded-lg max-w-md w-full p-6 animate-fade-in">
            <h2 class="text-2xl font-bold mb-4">Realizar Puja</h2>
            
            <div class="mb-6 pb-4 border-b border-gray-700">
                <div class="text-sm text-gray-400">Puja actual</div>
                <div class="text-3xl font-bold text-primary" x-text="`$${Number(currentBid || 0).toLocaleString('es-CO')}`"></div>
            </div>

            <form @submit.prevent="submitBid">
                <div class="mb-4">
                    <label for="bid-amount" class="block text-sm font-medium mb-2">Tu oferta</label>
                    <input 
                        id="bid-amount"
                        type="number" 
                        x-model.number="bidAmount" 
                        class="input-field w-full" 
                        placeholder="Ingresa tu cantidad"
                        :min="minimumBid"
                        step="1000"
                        aria-label="Cantidad de puja"
                        required
                    >
                    <p class="text-xs text-gray-400 mt-1" x-text="`Mínimo: $${Number(minimumBid).toLocaleString('es-CO')}`"></p>
                </div>

                <!-- Fees breakdown -->
                <div x-show="bidAmount >= minimumBid" class="mb-4 bg-dark rounded p-3 text-sm">
                    <div class="flex justify-between mb-1">
                        <span>Cantidad</span>
                        <span x-text="`$${Number(bidAmount || 0).toLocaleString('es-CO')}`"></span>
                    </div>
                    <div class="flex justify-between text-gray-400 border-t border-gray-700 pt-1 mt-1">
                        <span>Comisión de plataforma (5%)</span>
                        <span x-text="`$${Number((bidAmount * 0.05) || 0).toLocaleString('es-CO')}`"></span>
                    </div>
                </div>

                <div x-show="error" class="bg-red-900 border border-red-700 text-red-100 px-3 py-2 rounded mb-4 text-sm" role="alert">
                    <span x-text="error"></span>
                </div>

                <div class="flex gap-3">
                    <button 
                        type="button" 
                        @click="showBidModal = false"
                        class="btn-secondary flex-1"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        class="btn-primary flex-1"
                        :disabled="!bidAmount || bidAmount < minimumBid || loading"
                    >
                        <span x-show="!loading">Confirmar Puja</span>
                        <span x-show="loading">Procesando...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function auctionDetail() {
        return {
            loading: true,
            auction: {},
            bids: [],
            currentImageIndex: 0,
            timeLeft: '00:00:00',
            updateTimer: null,
            pollTimer: null,
            showAllBids: false,

            get currentImage() {
                if (this.auction.images && this.auction.images[this.currentImageIndex]) {
                    return this.auction.images[this.currentImageIndex].url;
                }
                return this.auction.image_url || 'https://via.placeholder.com/600x600';
            },

            get minimumBid() {
                const currentBid = this.auction.current_bid || 0;
                const increment = Math.max(currentBid * 0.01, 500);
                return currentBid + increment;
            },

            async loadAuction(id) {
                try {
                    const { data } = await axios.get(`/api/auctions/${id}`);
                    this.auction = data.data || data;
                    this.bids = data.bids || [];
                    this.startTimerUpdates();
                    this.startPolling();
                } catch (err) {
                    console.error('Error loading auction:', err);
                    notificationService.error('No se pudo cargar la subasta');
                } finally {
                    this.loading = false;
                }
            },

            startTimerUpdates() {
                if (this.updateTimer) clearInterval(this.updateTimer);
                
                this.updateTimer = setInterval(() => {
                    if (this.auction.end_date) {
                        const end = new Date(this.auction.end_date);
                        const now = new Date();
                        const diff = end - now;

                        if (diff <= 0) {
                            this.timeLeft = 'Finalizado';
                            this.auction.status = 'closed';
                            clearInterval(this.updateTimer);
                        } else {
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                            const minutes = Math.floor((diff / 1000 / 60) % 60);
                            const seconds = Math.floor((diff / 1000) % 60);

                            if (days > 0) {
                                this.timeLeft = `${days}d ${hours}h ${minutes}m`;
                            } else {
                                this.timeLeft = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                            }
                        }
                    }
                }, 1000);
            },

            startPolling() {
                if (this.pollTimer) clearInterval(this.pollTimer);
                
                this.pollTimer = setInterval(() => {
                    if (this.auction.status === 'active') {
                        this.loadAuction(this.auction.id);
                    }
                }, 5000);
            },

            openBidModal() {
                document.Alpine = Alpine;
                bidModalData.showBidModal = true;
                bidModalData.currentBid = this.auction.current_bid || 0;
                bidModalData.minimumBid = this.minimumBid;
                bidModalData.auctionId = this.auction.id;
            },

            shareAuction() {
                const url = window.location.href;
                if (navigator.share) {
                    navigator.share({
                        title: this.auction.title,
                        text: `Mira esta subasta: ${this.auction.title}`,
                        url: url,
                    });
                } else {
                    navigator.clipboard.writeText(url);
                    notificationService.success('Enlace copiado al portapapeles');
                }
            },

            formatTimeAgo(date) {
                const now = new Date();
                const created = new Date(date);
                const diff = now - created;
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);

                if (days > 0) return `${days} día${days > 1 ? 's' : ''} atrás`;
                if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
                if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
                return 'hace poco';
            },

            destroy() {
                if (this.updateTimer) clearInterval(this.updateTimer);
                if (this.pollTimer) clearInterval(this.pollTimer);
            },
        };
    }

    let bidModalData = {
        showBidModal: false,
        bidAmount: null,
        currentBid: 0,
        minimumBid: 0,
        auctionId: null,
        loading: false,
        error: '',

        async submitBid() {
            this.error = '';
            this.loading = true;

            try {
                const { data } = await axios.post(`/api/auctions/${this.auctionId}/bids`, {
                    amount: this.bidAmount,
                });

                notificationService.success('¡Puja registrada exitosamente!');
                this.showBidModal = false;
                this.bidAmount = null;
                
                // Reload detail
                location.reload();
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al registrar la puja';
            } finally {
                this.loading = false;
            }
        },
    };
</script>
@endpush
@endsection
