<!doctype html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', ($branding['schoolName'] ?? 'Dashboard'))</title>

        <!-- Tailwind CDN & Custom Config -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                            display: ['Manrope', 'sans-serif'],
                            editorial: ['Fraunces', 'serif'],
                        },
                        colors: {
                            brand: {
                                50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
                                400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
                                800: '#065f46', 900: '#064e3b', 950: '#022c22',
                            },
                        }
                    }
                }
            }
        </script>

        <!-- Alpine.js CDN -->
        <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

        <!-- Custom Styles -->
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap');

            :root {
                --brand-dark: #064e3b;
                --brand: #047857;
                --brand-light: #10b981;
                --brand-lighter: #34d399;
                --brand-soft: #d1fae5;
                --ink: #022c22;
                --body: #334155;
                --muted: #64748b;
                --surface: #ffffff;
                --app-bg: #fbfcf9;
                --dash-bg: #f4f5f1;
                --border: #e2e8f0;
            }

            body {
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                background: var(--dash-bg);
                color: var(--body);
            }

            .glass {
                background: rgba(255, 255, 255, 0.72);
                backdrop-filter: blur(18px) saturate(140%);
                -webkit-backdrop-filter: blur(18px) saturate(140%);
                border: 1px solid rgba(255, 255, 255, 0.55);
                box-shadow: 0 8px 32px rgba(6, 78, 59, 0.06);
            }

            [x-cloak] { display: none !important; }

            .page-enter {
                animation: fadeIn 0.4s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>

        @stack('head')
        <script src="https://unpkg.com/lucide@latest"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                if (window.lucide) window.lucide.createIcons()
            })
        </script>
    </head>
    <body class="bg-[#f4f5f1]">
        @yield('content')
        @stack('scripts')
    </body>
</html>
