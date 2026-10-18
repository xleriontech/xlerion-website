{{-- Card de producto para subasta --}}
<div class="card-auction">
    <!-- Image -->
    <div class="relative overflow-hidden bg-gray-800 h-64">
        <img 
            src="{{ $auction['image_url'] ?? 'https://via.placeholder.com/400x300' }}" 
            alt="{{ $auction['title'] ?? 'Prenda' }}"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
        >
        <div class="absolute top-4 right-4">
            @if($auction['status'] === 'active')
                <span class="badge badge-active">Activa</span>
            @elseif($auction['status'] === 'closed')
                <span class="badge badge-closed">Cerrada</span>
            @else
                <span class="badge badge-expired">Expirada</span>
            @endif
        </div>
    </div>

    <!-- Content -->
    <div class="p-4">
        <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ $auction['title'] ?? 'Sin título' }}</h3>
        
        <!-- Brand & Condition -->
        <div class="flex gap-2 mb-3 text-sm text-gray-400">
            @if(isset($auction['brand']))
                <span class="text-primary font-medium">{{ $auction['brand'] }}</span>
            @endif
            @if(isset($auction['condition']))
                <span>{{ $auction['condition'] }}</span>
            @endif
        </div>

        <!-- Price info -->
        <div class="mb-4 pb-4 border-b border-gray-700">
            <div class="text-sm text-gray-400">Puja actual</div>
            <div class="text-2xl font-bold text-primary">
                ${{ number_format($auction['current_bid'] ?? 0, 0, ',', '.') }}
            </div>
        </div>

        <!-- Time left -->
        <div class="text-sm text-gray-400 mb-4">
            @if(isset($auction['end_date']))
                <span id="countdown-{{ $auction['id'] ?? '' }}">
                    Tiempo restante: cargando...
                </span>
            @endif
        </div>

        <!-- Action button -->
        <a 
            href="{{ route('auctions.show', ['id' => $auction['id'] ?? '#']) }}" 
            class="btn-primary w-full text-center"
            aria-label="Ver detalles de subasta"
        >
            Ver Subasta
        </a>
    </div>
</div>
