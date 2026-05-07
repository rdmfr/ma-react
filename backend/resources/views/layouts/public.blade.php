<!doctype html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', $branding['schoolName'] ?? 'Website')</title>
        @if (!app()->environment('testing'))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @endif
        <script src="https://unpkg.com/lucide@latest"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                if (window.lucide) window.lucide.createIcons()
            })
        </script>
    </head>
    <body class="min-h-screen flex flex-col bg-[#fbfcf9]">
        @include('partials.public.navbar')
        <main class="flex-1 page-enter">
            @yield('content')
        </main>
        @include('partials.public.footer')
    </body>
</html>
