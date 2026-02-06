const Layout = {
    config: {
        siteName: "TechSec",
        navLinks: [
            { name: "Inicio", url: "index.html", icon: "home" },
            { name: "Artículos", url: "articles.html", icon: "article" }, // Mapeando feed.html conceptualmente si es necesario, pero el usuario usa articles.html en hrefs
            { name: "Roadmap", url: "roadmap.html", icon: "map" },
            { name: "Sobre Mí", url: "about.html", icon: "person" },
            { name: "Contacto", url: "contact.html", icon: "mail" },
            { name: "Portafolio", url: "portfolio.html", icon: "work" }
        ]
    },

    init: function (options = { basePath: './' }) {
        this.basePath = options.basePath;
        this.injectStyles();
        this.loadAuthors(); // Cargar autores globalmente
        this.renderHeader();
        this.renderFooter();
        this.renderMobileNav();
        this.renderMobileNav();
        this.initMobileMenu();
        this.initSearch();
    },

    loadAuthors: function () {
        if (typeof authorsData !== 'undefined') return; // Ya cargado

        // Evitar duplicados si ya hay un script tag aunque no haya cargado aun
        if (document.querySelector('script[src*="authors.js"]')) return;

        const script = document.createElement('script');
        script.src = this.basePath + 'js/authors.js';
        script.async = false; // Importante para que esté disponible lo antes posible
        document.head.appendChild(script);
    },

    injectStyles: function () {
        if (document.getElementById('layout-styles')) return;

        const styles = `
            body { font-family: 'Space Grotesk', sans-serif; }
            .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            .glass-nav { backdrop-filter: blur(12px); background-color: rgba(16, 22, 34, 0.8); }
            .terminal-font { font-family: 'JetBrains Mono', monospace; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b4354; border-radius: 10px; }
            .prose-custom h2 { border-left: 4px solid #135bec; padding-left: 1rem; margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 700; font-size: 1.5rem; }
            .terminal-window { margin-top: 2rem; margin-bottom: 2rem; border-radius: 0.5rem; background-color: #0f111a; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .terminal-header { display: flex; align-items: center; padding: 0.5rem 1rem; background-color: #1a1d26; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .dot { width: 0.5rem; height: 0.5rem; border-radius: 9999px; } .dot-red { background-color: #ef4444; } .dot-yellow { background-color: #eab308; } .dot-green { background-color: #22c55e; }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.id = 'layout-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    },

    getLink: function (url) {
        // Si la URL es absoluta o externa, devolver tal cual.
        if (url.startsWith('http') || url.startsWith('#')) return url;
        // Corrección para 'articles.html' que es realmente feed.html en el sistema de archivos pero referenciado como articles.html
        // Asumiremos que el usuario tiene reescrituras o copias. Por ahora, confiamos en lo que estaba en index.html.
        // Index.html enlaza a "articles.html" pero el listado de archivos mostraba "feed.html". 
        // Confiaré en los hrefs del código original.
        return this.basePath + url;
    },

    renderHeader: function () {
        const headerContainer = document.querySelector('#layout-header');
        if (!headerContainer) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const navLinksHtml = this.config.navLinks.map(link => {
            const fullUrl = this.getLink(link.url);
            // Comprobación de activo simple: si el nombre de archivo actual es link.url
            // Nota: articles.html vs feed.html podría ser un problema aquí si no es consistente.
            // Pero visualmente, resaltar el activo es bueno tenerlo.
            const isActive = currentPath === link.url;
            return `<a href="${fullUrl}" class="text-sm font-medium hover:text-primary transition-colors text-slate-900 dark:text-white ${isActive ? 'text-primary' : ''}">${link.name}</a>`;
        }).join('');

        // ARREGLO: Aplicar clases sticky al contenedor mismo para que se pegue relativo al body
        headerContainer.className = "sticky top-0 z-[100] border-b border-slate-200 dark:border-slate-800 glass-nav";

        headerContainer.innerHTML = `
            <div class="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-8">
                    <a href="${this.getLink('index.html')}" class="flex items-center gap-3">
                        <div class="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                            <span class="material-symbols-outlined text-white text-xl">security</span>
                        </div>
                        <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TechSec<span class="text-primary">.</span></h1>
                    </a>
                    <nav class="hidden md:flex items-center gap-6">
                        ${navLinksHtml}
                    </nav>
                </div>
                <div class="flex items-center gap-4">
                    <div class="relative hidden sm:block">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input id="search-input" class="bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary placeholder:text-slate-500 text-slate-900 dark:text-white outline-none" placeholder="Buscar vulnerabilidades..." type="text" />
                    </div>
                    <div class="h-8 w-8 rounded-full bg-cover bg-center border border-slate-700" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAm410ejyOZH6LjdHT8QbhG8CA9TBB1CiAf8e1KYGKvAntf3UvKUqxEKzSXJPO15LyMygqT33y6K5-yemp_CSarNoaUhfgla5e59VaQSpV8UcvU_9mmQ2QX1BHwTdpOPwcjTsw5fqnQFI0m7b3Ek09Bz1ueBHCizY3sKFGSlGoikzoqsT3iPNlxDSiBcslvCOD8aiTJkzusBjjuwtj9EvwVBH4u948xo5Z_0rPPUY0P4OnRDCTOMqWAsR0o7VyrqLAAAisR8qHcA9Q')"></div>
                </div>
            </div>
        `;
    },

    renderFooter: function () {
        const footerContainer = document.querySelector('#layout-footer');
        if (!footerContainer) return;

        footerContainer.innerHTML = `
        <footer class="border-t border-slate-200 dark:border-slate-800 mt-12 pt-12 pb-28 md:py-12">
            <div class="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="flex items-center gap-3">
                    <div class="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                        <span class="material-symbols-outlined text-primary text-lg">security</span>
                    </div>
                    <span class="font-bold text-slate-900 dark:text-white">TechSec Blog</span>
                </div>
                <p class="text-slate-500 text-sm">© 2024 TechSec Research Lab. Todos los derechos reservados.</p>
                <div class="flex gap-6">
                    <a class="text-slate-400 hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">share</span></a>
                    <a class="text-slate-400 hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">terminal</span></a>
                    <a class="text-slate-400 hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">shield</span></a>
                </div>
            </div>
        </footer>
        `;
    },

    renderMobileNav: function () {
        const navContainer = document.querySelector('#layout-mobile-nav');
        // Si no está presente, podemos inyectar en body, pero buscar un contenedor es más seguro.
        // De hecho, inyectemos un nuevo div si no existe, o usemos un contenedor.
        // Pero para layouts, usualmente queremos reemplazar código existente.
        let container = navContainer;
        if (!container) {
            container = document.createElement('div');
            container.id = 'layout-mobile-nav';
            document.body.appendChild(container);
        }

        const navLinks = [
            { name: "Inicio", url: "index.html", icon: "home" },
            { name: "Artículos", url: "articles.html", icon: "article" },
            { name: "Roadmap", url: "roadmap.html", icon: "map" },
            { name: "Portafolio", url: "portfolio.html", icon: "work" }
        ];

        const linksHtml = navLinks.map(link => `
            <a href="${this.getLink(link.url)}" class="flex flex-col items-center justify-center text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors mobile-nav-link">
                <span class="material-symbols-outlined mb-0.5 text-2xl">${link.icon}</span>
                <span class="text-[10px] font-medium">${link.name}</span>
            </a>
        `).join('');

        container.innerHTML = `
        <nav class="md:hidden fixed bottom-0 left-0 z-50 w-full glass-nav border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl bg-white/80 dark:bg-[#0f172a]/80">
            <div class="grid grid-cols-5 h-16 pb-safe">
                ${linksHtml}
                <button id="mobile-menu-btn" class="flex flex-col items-center justify-center text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">
                    <span class="material-symbols-outlined mb-0.5 text-2xl">menu</span>
                    <span class="text-[10px] font-medium">Menú</span>
                </button>
            </div>
        </nav>
        
        <!-- Overlay -->
        <div id="mobile-menu" class="hidden md:hidden fixed bottom-20 right-4 w-48 bg-white dark:bg-[#1b212e] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden transform transition-all">
            <div class="flex flex-col p-1">
                <a href="${this.getLink('about.html')}" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <span class="material-symbols-outlined text-lg">person</span> Sobre Mí
                </a>
                <a href="${this.getLink('contact.html')}" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <span class="material-symbols-outlined text-lg">mail</span> Contacto
                </a>
                <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <span class="material-symbols-outlined text-lg">search</span> Buscar
                </a>
            </div>
        </div>
        `;
    },

    initMobileMenu: function () {
        // Necesitamos esperar a que el DOM se actualice con la navegación móvil
        // Usando delegación de eventos o simplemente adjuntando después de renderizar
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
            });
        }
    },

    initSearch: function () {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        const searchUrl = this.getLink('articles.html') + '?q=' + encodeURIComponent(query);
                        // Usar navigateTo si está disponible (SPA) o window.location
                        if (typeof navigateTo === 'function') {
                            navigateTo(searchUrl);
                        } else {
                            window.location.href = searchUrl;
                        }
                    }
                }
            });
        }
    }
};
