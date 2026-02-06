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
        // En popstate, la URL ya cambió en el navegador, así que cargamos esa
        // PERO debemos saber si esa URL "bonita" corresponde a un .html real.
        // Simulamos la lógica inversa.
        handleRoute(window.location.href);
    });

    // Limpiar URL inicial si entramos directo a un .html
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('index.html')) {
        const cleanPath = currentPath.substring(0, currentPath.lastIndexOf('index.html'));
        history.replaceState(null, '', cleanPath);
    } else if (currentPath.endsWith('feed.html')) {
        // Caso especial: feed.html se muestra como 'articles'
        const cleanPath = currentPath.replace('feed.html', 'articles');
        history.replaceState(null, '', cleanPath);
    } else if (currentPath.endsWith('.html')) {
        const cleanPath = currentPath.slice(0, -5);
        history.replaceState(null, '', cleanPath);
    }
});

async function navigateTo(url) {
    // 1. Determinar el recurso real (.html) y la URL bonita (sin .html)
    let fetchUrl = url;
    let displayUrl = url;

    // Lógica para limpiar la URL visualmente
    if (url.endsWith('index.html')) {
        // Si es index.html, quitamos todo el nombre para dejar solo la carpeta raíz /
        displayUrl = url.substring(0, url.lastIndexOf('index.html'));
    } else if (url.endsWith('.html')) {
        // Si es otro archivo .html, solo quitamos la extensión
        displayUrl = url.slice(0, -5);
    }

    // Lógica para buscar el archivo real si la URL es limpia (sin .html)
    if (!url.endsWith('.html')) {
        if (url.endsWith('/')) {
            fetchUrl = url + 'index.html';
        } else {
            fetchUrl = url + '.html';
        }
    }

    // CORRECCIÓN CRÍTICA: Mapeo manual para 'articles' -> 'feed.html'
    // Esto asegura que el fetch busque el archivo físico real, ya que articles.html no existe.
    if (fetchUrl.endsWith('articles.html') || fetchUrl.endsWith('/articles')) {
        fetchUrl = fetchUrl.replace(/articles(\.html)?$/, 'feed.html');
        // Aseguramos que la URL visual sea 'articles' (sin extensión)
        if (displayUrl.endsWith('feed.html')) {
            displayUrl = displayUrl.replace('feed.html', 'articles');
        } else if (displayUrl.endsWith('articles.html')) {
            displayUrl = displayUrl.replace('.html', '');
        }
    }

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

        // Reemplazar el contenido actual (Asumiendo estructura <main> o <body>)
        // Reemplazar todo el body suele ser seguro para mantener scripts en head
        // PERO cuidado con listeners duplicados. Mejor reemplazar <main> y <title>

        const newMain = doc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.replaceWith(newMain);
            document.title = doc.title;

            // Scroll arriba
            window.scrollTo(0, 0);

            // Actualizar URL
            history.pushState(null, '', displayUrl);

            // Si hay scripts específicos en el nuevo body (ej: authors.js call), hay que ejecutarlos
            // Los <script> dentro de innerHTML/replaceWith NO se ejecutan automágicamente.
            executeScripts(newMain);

            // Re-ejecutar scripts necesarios? (ej: highlights, author rendering)
            // Esto es lo complicado de SPAs vanilla.
            // Disparamos un evento custom para que otros scripts (como authors.js) se reactiven
            document.dispatchEvent(new Event('DOMContentLoaded'));

        } else {
            // Fallback: recarga dura si la estructura no coincide
            window.location.href = displayUrl;
        }

    } catch (error) {
        console.error("Error navegando:", error);
    }
}

async function load404() {
    // Buscar la página 404.html (asumiendo que está en la raíz del blog o relativa)
    // Intentamos rutas relativas comunes y especifica para subcarpeta 'blog'
    const paths = [
        '404.html',
        '../404.html',
        '../../404.html',
        '/blog/404.html',
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
        document.body.innerHTML = html; // Reemplazo total para el 404
    } else {
        document.body.innerHTML = '<h1 style="color:white; text-align:center; margin-top:50px;">404 - Not Found (y falta 404.html)</h1>';
    }
}

// Helper para ejecutar scripts insertados dinámicamente
function executeScripts(node) {
    const scripts = node.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        // Copiar atributos
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));

        // Si es un inline script, copiar contenido
        if (oldScript.src) {
            // Para scripts externos, debemos esperar a que carguen? 
            // En un mundo ideal si, pero para este caso simple, dejemos que fluyan.
            // Sin embargo, para evitar ejecuciones duplicadas de scripts globales si estuvieran en body (mala practica pero posible):
            // Podríamos chequear si ya existe un script con ese src.
        }
        newScript.textContent = oldScript.textContent;

        // Reemplazar
        oldScript.parentNode.replaceChild(newScript, oldScript);

        // Si era un script src, no se ejecuta sincronicamente.
        // Si dependemos de el, estamos en problemas en SPA vanilla.
        // Por eso es mejor tener libs en <head>.
    });
}
