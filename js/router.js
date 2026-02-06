document.addEventListener('DOMContentLoaded', () => {
    // Interceptar clics en enlaces
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');

        // Solo nos importan enlaces internos que no sean anclas (#)
        if (link &&
            link.href.startsWith(window.location.origin) &&
            !link.getAttribute('href').startsWith('#') &&
            !link.hasAttribute('download') &&
            !link.hasAttribute('target')) {

            e.preventDefault();
            const targetUrl = link.href;

            // Lógica de navegación
            navigateTo(targetUrl);
        }
    });

    // Manejar botón Atrás/Adelante del navegador
    window.addEventListener('popstate', (e) => {
        handleRoute(window.location.href);
    });

    // Limpiar URL inicial si entramos directo a un .html
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('index.html')) {
        const cleanPath = currentPath.substring(0, currentPath.lastIndexOf('index.html'));
        history.replaceState(null, '', cleanPath);

    } else if (currentPath.endsWith('.html')) {
        const cleanPath = currentPath.slice(0, -5);
        history.replaceState(null, '', cleanPath);
    }
});

async function navigateTo(url) {
    // Separa la URL base de los parámetros de consulta
    // USAR document.baseURI es crítico para soportar subcarpetas (ej: /blog/)
    const urlObj = new URL(url, document.baseURI);
    const path = urlObj.pathname;
    const search = urlObj.search; // ?q=...

    // 1. Determinar el recurso real (.html) y la URL bonita (sin .html)
    let fetchPath = path;
    let displayPath = path;

    // CORRECCIÓN DE CONFLICTO: 'articles' es una carpeta, así que no podemos tener 'articles.html'.
    // Mapeamos virtualmente: cuando se pida 'articles', mostramos 'feed.html' internamente.
    if (path.endsWith('articles.html') || path.endsWith('/articles')) {
        // Fetch real: feed.html
        fetchPath = path.replace(/articles(\.html)?$/, 'feed.html');
        // URL visible: articles
        displayPath = path.replace(/articles(\.html)?$/, 'articles');
        // Si veníamos de /articles.html, limpiamos extensión para display
        if (displayPath.endsWith('.html')) displayPath = displayPath.slice(0, -5);
    }
    // Lógica estándar para otros archivos
    else if (path.endsWith('index.html')) {
        // Si es index.html, quitamos todo el nombre para dejar solo la carpeta raíz /
        displayPath = path.substring(0, path.lastIndexOf('index.html'));
    } else if (path.endsWith('.html')) {
        // Si es otro archivo .html, solo quitamos la extensión
        displayPath = path.slice(0, -5);
    }

    // Lógica para buscar el archivo real si la URL es limpia (sin .html)
    // PERO no sobreescribir si ya mapeamos fetchPath
    if (fetchPath === path && !path.endsWith('.html')) {
        if (path.endsWith('/')) {
            fetchPath = path + 'index.html';
        } else {
            fetchPath = path + '.html';
        }
    }

    // Reconstruir URLs con query params
    const fetchUrl = fetchPath + search;
    const displayUrl = displayPath + search;

    try {
        // Intentar cargar contenido
        const response = await fetch(fetchUrl);

        if (response.status === 404) {
            // Redirigir a lógica 404
            load404();
            return;
        }

        const html = await response.text();

        // Parsear el nuevo documento
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Reemplazar main
        const newMain = doc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.replaceWith(newMain);
            document.title = doc.title;

            // Scroll arriba
            window.scrollTo(0, 0);

            // Actualizar URL
            history.pushState(null, '', displayUrl);

            // Scripts
            executeScripts(newMain);
            document.dispatchEvent(new Event('DOMContentLoaded'));

        } else {
            // Fallback: recarga dura
            window.location.href = displayUrl;
        }

    } catch (error) {
        console.error("Error navegando:", error);
    }
}

async function load404() {
    const paths = [
        '404.html',
        '../404.html',
        '../../404.html',
        'blog/404.html',
        '/404.html'
    ];
    let html = '';

    for (const p of paths) {
        try {
            const r = await fetch(p);
            if (r.ok) {
                html = await r.text();
                break;
            }
        } catch (e) { }
    }

    if (html) {
        document.body.innerHTML = html;
    } else {
        document.body.innerHTML = '<h1 style="color:white; text-align:center; margin-top:50px;">404 - Not Found</h1>';
    }
}

// Helper para ejecutar scripts
function executeScripts(node) {
    const scripts = node.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        if (oldScript.src) { }
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}
