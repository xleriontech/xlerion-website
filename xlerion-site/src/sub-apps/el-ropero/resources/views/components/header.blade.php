<header class="sticky top-0 z-40 bg-secondary border-b border-gray-700">
    <nav class="container-app py-4 flex items-center justify-between">
        <!-- Logo -->
        <a href="{{ route('home') }}" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span class="font-bold text-dark">♦</span>
            </div>
            <span class="text-xl font-bold hidden sm:inline">El Ropero</span>
        </a>

        <!-- Search bar (hidden on mobile, visible on tablet+) -->
        <div class="hidden md:flex flex-1 max-w-xs mx-8">
            <form action="{{ route('auctions.index') }}" method="GET" class="w-full flex gap-2">
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Buscar subastas..." 
                    class="input-field flex-1"
                    aria-label="Buscar subastas"
                >
                <button type="submit" class="btn-primary" aria-label="Enviar búsqueda">
                    🔍
                </button>
            </form>
        </div>

        <!-- Right menu -->
        <div class="flex items-center gap-4">
            <!-- Mobile search toggle -->
            <button 
                class="md:hidden text-primary" 
                aria-label="Abrir búsqueda"
                @click="showMobileSearch = !showMobileSearch"
            >
                🔍
            </button>

            <!-- Notifications (placeholder) -->
            <button class="relative text-primary hover:text-white transition" aria-label="Notificaciones">
                🔔
                <span class="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>

            <!-- User menu -->
            <div class="relative" x-data="{ open: false }">
                <button 
                    @click="open = !open" 
                    class="flex items-center gap-2 text-white hover:text-primary transition"
                    aria-label="Menú de usuario"
                    aria-expanded="false"
                >
                    👤
                    <span class="hidden sm:inline text-sm">Menú</span>
                </button>

                <div 
                    x-show="open" 
                    @click.outside="open = false"
                    class="absolute right-0 mt-2 w-48 bg-dark border border-gray-700 rounded-lg shadow-lg py-2"
                    role="menu"
                >
                    @auth
                        <a href="{{ route('profile') }}" class="block px-4 py-2 text-white hover:bg-gray-700" role="menuitem">Mi Perfil</a>
                        <a href="{{ route('seller.dashboard') }}" class="block px-4 py-2 text-white hover:bg-gray-700" role="menuitem">Panel Vendedor</a>
                        @admin
                            <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 text-white hover:bg-gray-700" role="menuitem">Admin</a>
                        @endadmin
                        <hr class="my-2 border-gray-700">
                        <form action="{{ route('logout') }}" method="POST" class="block">
                            @csrf
                            <button type="submit" class="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700" role="menuitem">Cerrar Sesión</button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="block px-4 py-2 text-white hover:bg-gray-700" role="menuitem">Iniciar Sesión</a>
                        <a href="{{ route('register') }}" class="block px-4 py-2 text-primary hover:bg-gray-700" role="menuitem">Registrarse</a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Mobile search -->
    <div x-show="showMobileSearch" class="border-t border-gray-700 py-4 md:hidden" x-transition>
        <form action="{{ route('auctions.index') }}" method="GET" class="container-app flex gap-2">
            <input 
                type="text" 
                name="search" 
                placeholder="Buscar..." 
                class="input-field flex-1"
            >
            <button type="submit" class="btn-primary">🔍</button>
        </form>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.store('header', {
                showMobileSearch: false,
            });
        });
    </script>
</header>
