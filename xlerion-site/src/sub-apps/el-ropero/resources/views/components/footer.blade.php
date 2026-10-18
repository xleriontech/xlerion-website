<footer class="bg-dark border-t border-gray-700 mt-16">
    <div class="container-app py-12">
        <!-- Footer content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- About -->
            <div>
                <h3 class="text-lg font-bold text-primary mb-4">El Ropero Mag&co</h3>
                <p class="text-gray-400 text-sm">Plataforma de subastas online para prendas de ropa de alta calidad.</p>
            </div>

            <!-- Quick links -->
            <div>
                <h4 class="font-semibold text-white mb-4">Navegación</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="{{ route('home') }}" class="hover:text-primary transition">Inicio</a></li>
                    <li><a href="{{ route('auctions.index') }}" class="hover:text-primary transition">Subastas</a></li>
                    <li><a href="{{ route('seller.dashboard') }}" class="hover:text-primary transition">Vender</a></li>
                </ul>
            </div>

            <!-- Support -->
            <div>
                <h4 class="font-semibold text-white mb-4">Soporte</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="#" class="hover:text-primary transition">Centro de Ayuda</a></li>
                    <li><a href="#" class="hover:text-primary transition">Contacto</a></li>
                    <li><a href="#" class="hover:text-primary transition">FAQ</a></li>
                </ul>
            </div>

            <!-- Legal -->
            <div>
                <h4 class="font-semibold text-white mb-4">Legal</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="#" class="hover:text-primary transition">Términos de Servicio</a></li>
                    <li><a href="#" class="hover:text-primary transition">Privacidad</a></li>
                    <li><a href="#" class="hover:text-primary transition">Cookies</a></li>
                </ul>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-700 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>&copy; {{ date('Y') }} El Ropero Mag&co. Todos los derechos reservados.</p>
                <div class="flex gap-4 mt-4 md:mt-0">
                    <a href="#" class="hover:text-primary transition">Instagram</a>
                    <a href="#" class="hover:text-primary transition">Facebook</a>
                    <a href="#" class="hover:text-primary transition">Twitter</a>
                </div>
            </div>
        </div>
    </div>
</footer>
