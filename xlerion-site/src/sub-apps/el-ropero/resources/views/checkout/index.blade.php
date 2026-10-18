@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app max-w-4xl">
        <h1 class="text-3xl font-bold mb-8">Checkout</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main content -->
            <div class="lg:col-span-2">
                <!-- Order review -->
                <div class="bg-secondary rounded-lg p-6 mb-6">
                    <h2 class="text-xl font-bold mb-4">Resumen de tu Compra</h2>
                    <div class="space-y-4">
                        <template x-for="item in cartItems" :key="item.id">
                            <div class="flex gap-4 pb-4 border-b border-gray-700">
                                <img 
                                    :src="item.image_url"
                                    :alt="item.title"
                                    class="w-20 h-20 object-cover rounded"
                                >
                                <div class="flex-1">
                                    <h3 class="font-semibold" x-text="item.title"></h3>
                                    <p class="text-sm text-gray-400" x-text="`Puja Final: $${Number(item.final_bid).toLocaleString('es-CO')}`"></p>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold text-primary" x-text="`$${Number(item.final_bid).toLocaleString('es-CO')}`"></div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Shipping info -->
                <div class="bg-secondary rounded-lg p-6 mb-6">
                    <h2 class="text-xl font-bold mb-4">Dirección de Envío</h2>
                    <form class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                class="input-field"
                                required
                            >
                            <input 
                                type="email" 
                                placeholder="Correo" 
                                class="input-field"
                                required
                            >
                        </div>
                        <input 
                            type="tel" 
                            placeholder="Teléfono" 
                            class="input-field"
                            required
                        >
                        <textarea 
                            placeholder="Dirección completa" 
                            class="input-field resize-none"
                            rows="3"
                            required
                        ></textarea>
                        <div class="grid grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Ciudad" 
                                class="input-field"
                                required
                            >
                            <input 
                                type="text" 
                                placeholder="Departamento" 
                                class="input-field"
                                required
                            >
                        </div>
                    </form>
                </div>

                <!-- Payment -->
                <div class="bg-secondary rounded-lg p-6">
                    <h2 class="text-xl font-bold mb-4">Método de Pago</h2>
                    <div class="space-y-3">
                        <label class="flex items-center p-3 rounded-lg border border-primary cursor-pointer">
                            <input type="radio" name="payment" value="stripe" checked class="w-4 h-4">
                            <span class="ml-3 font-semibold">Tarjeta Crédito/Débito (Stripe)</span>
                        </label>
                        <label class="flex items-center p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-primary">
                            <input type="radio" name="payment" value="bank" class="w-4 h-4">
                            <span class="ml-3 font-semibold">Transferencia Bancaria</span>
                        </label>
                    </div>
                    <p class="text-xs text-gray-400 mt-4">
                        Se usará Stripe Sandbox para testing. En producción se procesarán pagos reales.
                    </p>
                </div>
            </div>

            <!-- Sidebar: Summary -->
            <aside class="lg:col-span-1">
                <div class="bg-secondary rounded-lg p-6 sticky top-20">
                    <h2 class="text-xl font-bold mb-6">Resumen de Pago</h2>

                    <div class="space-y-3 mb-6 pb-6 border-b border-gray-700">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Subtotal</span>
                            <span x-text="`$${Number(subtotal).toLocaleString('es-CO')}`"></span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Envío</span>
                            <span x-text="`$${Number(shipping).toLocaleString('es-CO')}`"></span>
                        </div>
                        <div class="flex justify-between text-red-400">
                            <span>Comisión Plataforma (5%)</span>
                            <span x-text="`$${Number(commission).toLocaleString('es-CO')}`"></span>
                        </div>
                    </div>

                    <div class="mb-6 pb-6 border-b border-gray-700">
                        <div class="flex justify-between items-center">
                            <span class="font-bold">Total</span>
                            <span class="text-2xl font-bold text-primary" x-text="`$${Number(total).toLocaleString('es-CO')}`"></span>
                        </div>
                    </div>

                    <button 
                        @click="processPayment()"
                        class="btn-primary w-full mb-2"
                    >
                        Procesar Pago
                    </button>

                    <a href="{{ route('auctions.index') }}" class="btn-secondary w-full text-center block">
                        Continuar Comprando
                    </a>

                    <!-- Security info -->
                    <p class="text-xs text-gray-400 mt-4 text-center">
                        🔒 Tus pagos son seguros con Stripe
                    </p>
                </div>
            </aside>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Placeholder checkout data
    const cartItems = [
        {
            id: 1,
            title: 'Camiseta Mag&co Premium',
            final_bid: 45000,
            image_url: 'https://via.placeholder.com/80x80',
        },
        {
            id: 2,
            title: 'Pantalón Jean Azul',
            final_bid: 65000,
            image_url: 'https://via.placeholder.com/80x80',
        },
    ];

    Alpine.data('checkout', () => ({
        cartItems,
        subtotal: 110000,
        shipping: 15000,
        commission: 5500,
        get total() {
            return this.subtotal + this.shipping + this.commission;
        },

        async processPayment() {
            // Placeholder for Stripe integration
            notificationService.success('Pago procesado en Stripe Sandbox');
            // window.location.href = '/checkout/success';
        },
    }));
</script>
@endpush
@endsection
