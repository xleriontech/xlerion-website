<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="El Ropero Mag&co - Plataforma de subastas online para prendas de ropa">
    <title>{{ $title ?? 'El Ropero Mag&co' }} - Subastas de moda</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app">
        @include('components.header')
        
        <main class="min-h-screen">
            @yield('content')
        </main>
        
        @include('components.footer')
    </div>

    <div id="toast-container" class="fixed top-4 right-4 z-50 max-w-md"></div>

    @stack('scripts')
</body>
</html>
