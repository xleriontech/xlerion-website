{{-- Modal de puja --}}
<div 
    x-data="{ open: false, amount: '', error: '' }"
    x-show="open"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="open = false"
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
                <label for="bid-amount" class="block text-sm font-medium mb-2">Cantidad de tu puja</label>
                <input 
                    id="bid-amount"
                    type="number" 
                    x-model="amount" 
                    class="input-field" 
                    placeholder="Ingresa tu cantidad"
                    :min="minBidAmount"
                    step="500"
                    aria-label="Cantidad de puja"
                    required
                >
                <p class="text-xs text-gray-400 mt-1">Mínimo: $<span x-text="Number(minBidAmount || 0).toLocaleString('es-CO')"></span></p>
            </div>

            <div x-show="error" class="bg-red-900 border border-red-700 text-red-100 px-3 py-2 rounded mb-4 text-sm" role="alert">
                <span x-text="error"></span>
            </div>

            <div class="flex gap-3">
                <button 
                    type="button" 
                    @click="open = false"
                    class="btn-secondary flex-1"
                    aria-label="Cancelar puja"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    class="btn-primary flex-1"
                    :disabled="!amount || loading"
                    aria-label="Enviar puja"
                >
                    <span x-show="!loading">Pujar</span>
                    <span x-show="loading">Enviando...</span>
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function bidModal() {
        return {
            open: false,
            amount: '',
            error: '',
            loading: false,
            currentBid: 0,
            minBidAmount: 0,
            auctionId: null,

            async submitBid() {
                this.error = '';
                this.loading = true;

                try {
                    const response = await axios.post(`/api/auctions/${this.auctionId}/bids`, {
                        amount: parseFloat(this.amount),
                    });

                    notificationService.success('¡Puja registrada exitosamente!');
                    this.open = false;
                    this.amount = '';
                    
                    // Reload auction details
                    if (window.initAuctionPolling) {
                        window.location.reload();
                    }
                } catch (err) {
                    this.error = err.response?.data?.message || 'Error al registrar la puja';
                } finally {
                    this.loading = false;
                }
            },
        };
    }
</script>
