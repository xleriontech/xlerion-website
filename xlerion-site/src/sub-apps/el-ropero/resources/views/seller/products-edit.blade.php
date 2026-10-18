@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app max-w-2xl">
        <h1 class="text-3xl font-bold mb-8">Editar Prenda</h1>

        <div class="bg-secondary rounded-lg p-8">
            <form x-data="editProductForm()" class="space-y-6">
                <!-- Title -->
                <div>
                    <label class="block text-sm font-medium mb-2">Título de la Prenda *</label>
                    <input 
                        type="text" 
                        x-model="form.title" 
                        class="input-field w-full"
                        placeholder="ej: Camiseta Mag&co Premium Azul"
                        required
                    >
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium mb-2">Descripción *</label>
                    <textarea 
                        x-model="form.description" 
                        class="input-field w-full h-32 resize-none"
                        placeholder="Describe el estado, material, talla, etc."
                        required
                    ></textarea>
                </div>

                <!-- Grid of inputs -->
                <div class="grid grid-cols-2 gap-4">
                    <!-- Brand -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Marca *</label>
                        <input 
                            type="text" 
                            x-model="form.brand" 
                            class="input-field w-full"
                            placeholder="ej: Mag&co"
                            required
                        >
                    </div>

                    <!-- Condition -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Condición *</label>
                        <select x-model="form.condition" class="input-field w-full" required>
                            <option value="">Seleccionar...</option>
                            <option value="new">Nuevo</option>
                            <option value="like_new">Como Nuevo</option>
                            <option value="very_good">Muy Bueno</option>
                            <option value="good">Bueno</option>
                            <option value="fair">Regular</option>
                        </select>
                    </div>

                    <!-- Size -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Talla *</label>
                        <input 
                            type="text" 
                            x-model="form.size" 
                            class="input-field w-full"
                            placeholder="ej: M, L, 38"
                            required
                        >
                    </div>

                    <!-- Base Price -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Precio Base *</label>
                        <input 
                            type="number" 
                            x-model.number="form.base_price" 
                            class="input-field w-full"
                            placeholder="ej: 50000"
                            required
                        >
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex gap-4 pt-6 border-t border-gray-700">
                    <button 
                        type="submit" 
                        class="btn-primary flex-1"
                        :disabled="loading"
                    >
                        <span x-show="!loading">💾 Guardar Cambios</span>
                        <span x-show="loading">Guardando...</span>
                    </button>
                    <a href="{{ route('seller.products') }}" class="btn-secondary flex-1 text-center">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function editProductForm() {
        return {
            loading: false,
            form: {
                title: 'Camiseta Mag&co',
                description: 'Camiseta Premium de Mag&co en excelente estado',
                brand: 'Mag&co',
                condition: 'like_new',
                size: 'M',
                base_price: 50000,
            },

            async submit() {
                this.loading = true;
                try {
                    const productId = '{{ $id ?? request()->route('id') }}';
                    await axios.patch(`/api/products/${productId}`, this.form);
                    notificationService.success('Prenda actualizada');
                    window.location.href = '{{ route('seller.products') }}';
                } catch (err) {
                    notificationService.error(err.response?.data?.message || 'Error al actualizar');
                } finally {
                    this.loading = false;
                }
            },
        };
    }
</script>
@endpush
@endsection
