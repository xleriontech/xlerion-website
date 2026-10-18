# Script para actualizar páginas secundarias con menú hamburguesa e i18n
# Autor: GitHub Copilot
# Fecha: 2026-01-12

Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ACTUALIZACIÓN AUTOMÁTICA - PÁGINAS SECUNDARIAS REDEMTHOR          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$baseDir = "x:\Programacion\XlerionWeb\xlerion-site\public\redemthor"
$referenceFile = "$baseDir\historia-fundacion.html"

# Páginas a actualizar
$pagesToUpdate = @(
    "historia-evolucion.html",
    "discografia.html",
    "miembros.html",
    "transmisiones.html"
)

# CSS del menú hamburguesa
$mobileMenuCSS = @'
        /* Mobile Menu Styles */
        #mobile-menu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        #mobile-menu.active {
            max-height: 600px;
        }

        #menu-toggle {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 5px;
            background: none;
            border: none;
            padding: 0;
        }

        @media (max-width: 767px) {
            #menu-toggle {
                display: flex;
            }
        }

        #menu-toggle span {
            width: 25px;
            height: 2px;
            background: #ddd;
            transition: all 0.3s ease;
        }

        #menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(10px, 10px);
        }

        #menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        #menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }

        /* Language Button Styles */
        .lang-button {
            background-color: transparent;
            border: 1px solid #999;
            color: #999;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .lang-button:hover {
            border-color: #ddd;
            color: #ddd;
        }

        .lang-button.active {
            background-color: #ff0000;
            border-color: #ff0000;
            color: #fff;
            text-shadow: 0 0 10px #ff0000;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
        }
'@

# JavaScript del menú toggle
$menuToggleJS = @'
    <!-- Mobile Menu Toggle Script -->
    <script>
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });

            // Close menu when a link is clicked
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });
        }
    </script>
'@

Write-Host "📋 Procesando $($pagesToUpdate.Count) páginas..." -ForegroundColor Yellow
Write-Host ""

foreach ($page in $pagesToUpdate) {
    $filePath = "$baseDir\$page"
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  Archivo no encontrado: $page" -ForegroundColor Red
        continue
    }
    
    Write-Host "🔧 Procesando: $page" -ForegroundColor Cyan
    
    try {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 1. Agregar translations.js si no existe
        if ($content -notmatch 'translations\.js') {
            Write-Host "   ✓ Agregando translations.js" -ForegroundColor Green
            $content = $content -replace '(<script src="https://cdn\.tailwindcss\.com"></script>)', "`$1`n`n    <!-- Translations -->`n    <script src=`"js/translations.js`"></script>"
        }
        
        # 2. Agregar CSS del menú hamburguesa si no existe
        if ($content -notmatch '#mobile-menu') {
            Write-Host "   ✓ Agregando CSS menú hamburguesa" -ForegroundColor Green
            $content = $content -replace '(body \{[^}]+\})', "`$1`n`n$mobileMenuCSS"
        }
        
        # 3. Reemplazar header simple con header completo
        if ($content -notmatch 'menu-toggle') {
            Write-Host "   ✓ Actualizando header con menú hamburguesa" -ForegroundColor Green
            
            # Extraer el header actual
            if ($content -match '(?s)(<header.*?</header>)') {
                $oldHeader = $matches[1]
                
                # Determinar qué link debe estar activo
                $activeLink = switch -Regex ($page) {
                    'evolucion' { 'historia-evolucion.html' }
                    'discografia' { 'discografia.html' }
                    'miembros' { 'miembros.html' }
                    'transmisiones' { 'transmisiones.html' }
                    default { 'index.html' }
                }
                
                # Crear nuevo header con menú hamburguesa
                $newHeader = @"
<header class="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-sm border-b border-[#990000] z-50">
        <nav class="container mx-auto px-4 sm:px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <a href="index.html">
                        <img src="images/redemthor-logo.png" alt="Redemthor"
                            class="h-8 sm:h-10 w-auto object-contain hover:opacity-80 transition">
                    </a>
                </div>
                <!-- Desktop Menu -->
                <div class="hidden md:flex space-x-6 lg:space-x-8 text-xs sm:text-sm uppercase tracking-wider">
                    <a href="index.html" class="text-gray-400 hover:text-[#ff0000] transition"
                        data-i18n="nav_inicio">Inicio</a>
                    <a href="historia-fundacion.html" class="text-gray-400 hover:text-[#ff0000] transition"
                        data-i18n="nav_fundacion">Fundación</a>
                    <a href="historia-evolucion.html" class="text-gray-400 hover:text-[#ff0000] transition"
                        data-i18n="nav_evolucion">Evolución</a>
                    <a href="discografia.html" class="text-gray-400 hover:text-[#ff0000] transition"
                        data-i18n="nav_discografia">Discografía</a>
                    <a href="miembros.html" class="text-gray-400 hover:text-[#ff0000] transition"
                        data-i18n="nav_miembros">Miembros</a>
                    <a href="transmisiones.html" class="text-gray-400 hover:text-[#ff0000] transition"
                        data-i18n="nav_transmisiones">Transmisiones</a>
                </div>
                <!-- Desktop Social Links & Language Toggle -->
                <div class="hidden md:flex items-center space-x-4">
                    <a href="https://redemthor.bandcamp.com/" target="_blank" rel="noopener noreferrer"
                        class="text-[#990000] hover:text-[#ff0000] transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M0 18.75l7.437-13.5h16.563l-7.438 13.5z" />
                        </svg>
                    </a>
                    <a href="https://www.reverbnation.com/redemthor" target="_blank" rel="noopener noreferrer"
                        class="text-[#990000] hover:text-[#ff0000] transition">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.053 0 .097-.042.104-.098l.27-2.105-.27-2.154c-.007-.057-.051-.1-.104-.1zm1.274.05c-.057 0-.104.047-.111.108l-.193 1.871.193 1.823c.007.063.054.11.111.11.059 0 .108-.047.117-.11l.23-1.823-.23-1.871c-.009-.061-.058-.108-.117-.108zm1.223-.019c-.063 0-.114.053-.123.116l-.179 1.845.179 1.794c.009.066.06.121.123.121.066 0 .118-.055.126-.121l.211-1.794-.211-1.845c-.008-.063-.06-.116-.126-.116zm1.24-.021c-.068 0-.124.058-.134.126l-.164 1.866.164 1.812c.01.071.066.129.134.129.07 0 .128-.058.138-.129l.193-1.812-.193-1.866c-.01-.068-.068-.126-.138-.126zm1.259-.022c-.075 0-.137.062-.148.139l-.152 1.888.152 1.83c.011.078.073.141.148.141.076 0 .138-.063.148-.141l.178-1.83-.178-1.888c-.01-.077-.072-.139-.148-.139zm1.277-.023c-.081 0-.148.068-.159.149l-.139 1.911.139 1.849c.011.083.078.152.159.152.082 0 .15-.069.162-.152l.16-1.849-.16-1.911c-.012-.081-.08-.149-.162-.149zm1.293-.025c-.088 0-.161.073-.172.163l-.126 1.936.126 1.867c.011.09.084.165.172.165.089 0 .162-.075.174-.165l.147-1.867-.147-1.936c-.012-.09-.085-.163-.174-.163zm1.311-.026c-.095 0-.172.078-.184.175l-.113 1.96.113 1.885c.012.097.089.177.184.177.095 0 .173-.08.185-.177l.132-1.885-.132-1.96c-.012-.097-.09-.175-.185-.175zm1.329-.028c-.102 0-.186.084-.198.189l-.101 1.989.101 1.902c.012.105.096.191.198.191.103 0 .188-.086.199-.191l.117-1.902-.117-1.989c-.011-.105-.096-.189-.199-.189zm1.346-.03c-.109 0-.198.09-.21.201l-.088 2.018.088 1.921c.012.112.101.203.21.203.11 0 .199-.091.212-.203l.103-1.921-.103-2.018c-.013-.111-.102-.201-.212-.201zm1.364-.031c-.115 0-.209.096-.221.214l-.075 2.048.075 1.939c.012.118.106.216.221.216.116 0 .211-.098.223-.216l.088-1.939-.088-2.048c-.012-.118-.107-.214-.223-.214zm1.383-.034c-.122 0-.222.102-.234.228l-.062 2.078.062 1.956c.012.125.112.229.234.229.123 0 .223-.104.236-.229l.073-1.956-.073-2.078c-.013-.126-.113-.228-.236-.228zm1.4-.035c-.129 0-.234.107-.247.24l-.05 2.107.05 1.974c.013.133.118.243.247.243.13 0 .236-.11.249-.243l.059-1.974-.059-2.107c-.013-.133-.119-.24-.249-.24zm1.418-.037c-.136 0-.247.113-.26.254l-.036 2.136.036 1.993c.013.141.124.257.26.257.137 0 .249-.116.262-.257l.043-1.993-.043-2.136c-.013-.141-.125-.254-.262-.254zm1.437-.039c-.142 0-.259.119-.271.268l-.024 2.166.024 2.011c.012.149.129.271.271.271.143 0 .261-.122.274-.271l.028-2.011-.028-2.166c-.013-.149-.131-.268-.274-.268z" />
                        </svg>
                    </a>
                    <!-- Language Toggle (Desktop) -->
                    <div class="flex items-center space-x-2 ml-6 pl-6 border-l border-[#990000]/30">
                        <button data-lang-button="es"
                            class="lang-button px-3 py-1 text-xs uppercase font-bold transition" aria-label="Español">
                            ES
                        </button>
                        <span class="text-gray-500">/</span>
                        <button data-lang-button="en"
                            class="lang-button px-3 py-1 text-xs uppercase font-bold transition" aria-label="English">
                            EN
                        </button>
                    </div>
                </div>
                <!-- Mobile Menu Toggle -->
                <button id="menu-toggle" class="md:hidden" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="md:hidden border-t border-[#990000] mt-4 pt-4">
                <div class="flex flex-col space-y-3 text-xs sm:text-sm uppercase tracking-wider">
                    <a href="index.html" class="text-gray-400 hover:text-[#ff0000] transition py-2"
                        data-i18n="nav_inicio">Inicio</a>
                    <a href="historia-fundacion.html" class="text-gray-400 hover:text-[#ff0000] transition py-2"
                        data-i18n="nav_fundacion">Fundación</a>
                    <a href="historia-evolucion.html" class="text-gray-400 hover:text-[#ff0000] transition py-2"
                        data-i18n="nav_evolucion">Evolución</a>
                    <a href="discografia.html" class="text-gray-400 hover:text-[#ff0000] transition py-2"
                        data-i18n="nav_discografia">Discografía</a>
                    <a href="miembros.html" class="text-gray-400 hover:text-[#ff0000] transition py-2"
                        data-i18n="nav_miembros">Miembros</a>
                    <a href="transmisiones.html" class="text-gray-400 hover:text-[#ff0000] transition py-2"
                        data-i18n="nav_transmisiones">Transmisiones</a>
                    <!-- Language Toggle (Mobile) -->
                    <div class="flex items-center space-x-2 py-3 border-t border-b border-[#990000]/30">
                        <button data-lang-button="es"
                            class="lang-button px-3 py-1 text-xs uppercase font-bold transition flex-1"
                            aria-label="Español">
                            ES
                        </button>
                        <span class="text-gray-500">/</span>
                        <button data-lang-button="en"
                            class="lang-button px-3 py-1 text-xs uppercase font-bold transition flex-1"
                            aria-label="English">
                            EN
                        </button>
                    </div>
                    <!-- Social Links in Mobile Menu -->
                    <div class="flex items-center space-x-6 pt-4 border-t border-[#990000]/30">
                        <a href="https://redemthor.bandcamp.com/" target="_blank" rel="noopener noreferrer"
                            class="flex items-center space-x-2 text-[#990000] hover:text-[#ff0000] transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M0 18.75l7.437-13.5h16.563l-7.438 13.5z" />
                            </svg>
                            <span class="text-xs">Bandcamp</span>
                        </a>
                        <a href="https://www.reverbnation.com/redemthor" target="_blank" rel="noopener noreferrer"
                            class="flex items-center space-x-2 text-[#990000] hover:text-[#ff0000] transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.053 0 .097-.042.104-.098l.27-2.105-.27-2.154c-.007-.057-.051-.1-.104-.1zm1.274.05c-.057 0-.104.047-.111.108l-.193 1.871.193 1.823c.007.063.054.11.111.11.059 0 .108-.047.117-.11l.23-1.823-.23-1.871c-.009-.061-.058-.108-.117-.108zm1.223-.019c-.063 0-.114.053-.123.116l-.179 1.845.179 1.794c.009.066.06.121.123.121.066 0 .118-.055.126-.121l.211-1.794-.211-1.845c-.008-.063-.06-.116-.126-.116zm1.24-.021c-.068 0-.124.058-.134.126l-.164 1.866.164 1.812c.01.071.066.129.134.129.07 0 .128-.058.138-.129l.193-1.812-.193-1.866c-.01-.068-.068-.126-.138-.126zm1.259-.022c-.075 0-.137.062-.148.139l-.152 1.888.152 1.83c.011.078.073.141.148.141.076 0 .138-.063.148-.141l.178-1.83-.178-1.888c-.01-.077-.072-.139-.148-.139zm1.277-.023c-.081 0-.148.068-.159.149l-.139 1.911.139 1.849c.011.083.078.152.159.152.082 0 .15-.069.162-.152l.16-1.849-.16-1.911c-.012-.081-.08-.149-.162-.149zm1.293-.025c-.088 0-.161.073-.172.163l-.126 1.936.126 1.867c.011.09.084.165.172.165.089 0 .162-.075.174-.165l.147-1.867-.147-1.936c-.012-.09-.085-.163-.174-.163zm1.311-.026c-.095 0-.172.078-.184.175l-.113 1.96.113 1.885c.012.097.089.177.184.177.095 0 .173-.08.185-.177l.132-1.885-.132-1.96c-.012-.097-.09-.175-.185-.175zm1.329-.028c-.102 0-.186.084-.198.189l-.101 1.989.101 1.902c.012.105.096.191.198.191.103 0 .188-.086.199-.191l.117-1.902-.117-1.989c-.011-.105-.096-.189-.199-.189zm1.346-.03c-.109 0-.198.09-.21.201l-.088 2.018.088 1.921c.012.112.101.203.21.203.11 0 .199-.091.212-.203l.103-1.921-.103-2.018c-.013-.111-.102-.201-.212-.201zm1.364-.031c-.115 0-.209.096-.221.214l-.075 2.048.075 1.939c.012.118.106.216.221.216.116 0 .211-.098.223-.216l.088-1.939-.088-2.048c-.012-.118-.107-.214-.223-.214zm1.383-.034c-.122 0-.222.102-.234.228l-.062 2.078.062 1.956c.012.125.112.229.234.229.123 0 .223-.104.236-.229l.073-1.956-.073-2.078c-.013-.126-.113-.228-.236-.228zm1.4-.035c-.129 0-.234.107-.247.24l-.05 2.107.05 1.974c.013.133.118.243.247.243.13 0 .236-.11.249-.243l.059-1.974-.059-2.107c-.013-.133-.119-.24-.249-.24zm1.418-.037c-.136 0-.247.113-.26.254l-.036 2.136.036 1.993c.013.141.124.257.26.257.137 0 .249-.116.262-.257l.043-1.993-.043-2.136c-.013-.141-.125-.254-.262-.254zm1.437-.039c-.142 0-.259.119-.271.268l-.024 2.166.024 2.011c.012.149.129.271.271.271.143 0 .261-.122.274-.271l.028-2.011-.028-2.166c-.013-.149-.131-.268-.274-.268z" />
                            </svg>
                            <span class="text-xs">ReverbNation</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
"@
                
                # Marcar el link activo como rojo
                $newHeader = $newHeader -replace "(<a href=`"$activeLink`" class=`"text-gray-400)", '$1 text-[#ff0000]'
                
                $content = $content -replace '(?s)<header.*?</header>', $newHeader
            }
        }
        
        # 4. Agregar script del menú toggle antes de </body>
        if ($content -notmatch 'menu-toggle.*addEventListener') {
            Write-Host "   ✓ Agregando JavaScript menú toggle" -ForegroundColor Green
            $content = $content -replace '(</body>)', "$menuToggleJS`n`$1"
        }
        
        # Guardar archivo
        $content | Set-Content $filePath -Encoding UTF8 -NoNewline
        Write-Host "   ✅ $page actualizado exitosamente`n" -ForegroundColor Green
        
    }
    catch {
        Write-Host "   ❌ Error procesando $page`: $_" -ForegroundColor Red
    }
}

Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║               ACTUALIZACIÓN COMPLETADA ✅                          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📋 RESUMEN:" -ForegroundColor Yellow
Write-Host "   ✓ Menú hamburguesa agregado" -ForegroundColor Green
Write-Host "   ✓ Botones ES/EN agregados" -ForegroundColor Green
Write-Host "   ✓ CSS responsive actualizado" -ForegroundColor Green
Write-Host "   ✓ JavaScript toggle funcional" -ForegroundColor Green
Write-Host "   ✓ Navegación completa en móvil`n" -ForegroundColor Green

Write-Host "⚠️  NOTA IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   Las páginas ahora tienen menú hamburguesa, pero aún necesitas:" -ForegroundColor White
Write-Host "   1. Agregar atributos data-i18n al contenido de cada página" -ForegroundColor Cyan
Write-Host "   2. Agregar las traducciones correspondientes a js/translations.js`n" -ForegroundColor Cyan

Write-Host "🌐 Prueba los cambios en:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173/redemthor/historia-evolucion.html" -ForegroundColor Cyan
Write-Host "   http://localhost:5173/redemthor/discografia.html" -ForegroundColor Cyan
Write-Host "   http://localhost:5173/redemthor/miembros.html" -ForegroundColor Cyan
Write-Host "   http://localhost:5173/redemthor/transmisiones.html`n" -ForegroundColor Cyan
