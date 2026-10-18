@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app max-w-2xl">
        <h1 class="text-3xl font-bold mb-8">Crear Nueva Prenda</h1>

        <div class="bg-secondary rounded-lg p-8">
            <form x-data="createProductForm()" @submit.prevent="submit" class="space-y-6">
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

                <!-- Images -->
                <div>
                    <label class="block text-sm font-medium mb-2">Imágenes *</label>
                    <div class="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            @change="handleFileUpload"
                            class="hidden"
                            id="images"
                            required
                        >
                        <label for="images" class="cursor-pointer">
                            <div class="text-4xl mb-2">📸</div>
                            <p class="text-gray-400">Arrastra imágenes o haz clic para seleccionar</p>
                            <p class="text-xs text-gray-500 mt-1">Máximo 5 imágenes, JPG o PNG</p>
                        </label>
                    </div>
                    <div x-show="form.images.length > 0" class="mt-4 grid grid-cols-3 gap-2">
                        <template x-for="(image, index) in form.images" :key="index">
                            <div class="relative">
                                <img 
                                    :src="image.preview || image" 
                                    :alt="`Imagen ${index + 1}`"
                                    class="w-full h-20 object-cover rounded"
                                >
                                <button 
                                    type="button"
                                    @click="removeImage(index)"
                                    class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Auction settings -->
                <div class="border-t border-gray-700 pt-6">
                    <h3 class="text-lg font-bold mb-4">Configuración de Subasta</h3>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Duration -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Duración (días) *</label>
                            <select x-model.number="form.duration_days" class="input-field w-full" required>
                                <option value="">Seleccionar...</option>
                                <option value="3">3 días</option>
                                <option value="7">7 días</option>
                                <option value="14">14 días</option>
                                <option value="30">30 días</option>
                            </select>
                        </div>

                        <!-- Minimum Increment -->
                        <div>
                            <label class="block text-sm font-medium mb-2">Incremento Mínimo ($)</label>
                            <input 
                                type="number" 
                                x-model.number="form.minimum_increment"
                                class="input-field w-full"
                                placeholder="500"
                            >
                        </div>
                    </div>
                </div>

                <!-- Error message -->
                <div x-show="error" class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                    <span x-text="error"></span>
                </div>

                <!-- Submit -->
                <div class="flex gap-4">
                    <button 
                        type="submit" 
                        class="btn-primary flex-1"
                        :disabled="loading"
                    >
                        <span x-show="!loading">Crear Prenda</span>
                        <span x-show="loading">Creando...</span>
                    </button>
                    <a href="{{ route('seller.products') }}" class="btn-secondary">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function createProductForm() {
        return {
            loading: false,
            error: '',
            form: {
                title: '',
                description: '',
                brand: '',
                condition: '',
                size: '',
                base_price: null,
                images: [],
                duration_days: 7,
                minimum_increment: 500,
            },

            handleFileUpload(event) {
                const files = Array.from(event.target.files);
                if (files.length + this.form.images.length > 5) {
                    this.error = 'Máximo 5 imágenes permitidas';
                    return;
                }

                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.form.images.push({
                            file: file,
                            preview: e.target.result,
                        });
                    };
                    reader.readAsDataURL(file);
                });
                this.error = '';
            },

            removeImage(index) {
                this.form.images.splice(index, 1);
            },

            async submit() {
                this.error = '';
                this.loading = true;

                try {
                    const formData = new FormData();
                    formData.append('title', this.form.title);
                    formData.append('description', this.form.description);
                    formData.append('brand', this.form.brand);
                    formData.append('condition', this.form.condition);
                    formData.append('size', this.form.size);
                    formData.append('base_price', this.form.base_price);
                    formData.append('duration_days', this.form.duration_days);
                    formData.append('minimum_increment', this.form.minimum_increment);

                    this.form.images.forEach((img, index) => {
                        formData.append(`images[${index}]`, img.file);
                    });

                    const { data } = await axios.post('/api/products', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    notificationService.success('Prenda creada y subasta iniciada');
                    window.location.href = `{{ route('auctions.show', ['id' => '']) }}${data.auction_id}`;
                } catch (err) {
                    this.error = err.response?.data?.message || 'Error al crear prenda';
                } finally {
                    this.loading = false;
                }
            },
        };
    }
</script>
@endpush
@endsection
