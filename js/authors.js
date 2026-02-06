if (typeof window.authorsData === 'undefined') {
    window.authorsData = {
        "1": {
            name: "Kevin Coyote",
            role: "Desarrollador Full Stack",
            bio: "Apasionado por la tecnología, especializado en desarrollo de software y aplicaciones web.",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm410ejyOZH6LjdHT8QbhG8CA9TBB1CiAf8e1KYGKvAntf3UvKUqxEKzSXJPO15LyMygqT33y6K5-yemp_CSarNoaUhfgla5e59VaQSpV8UcvU_9mmQ2QX1BHwTdpOPwcjTsw5fqnQFI0m7b3Ek09Bz1ueBHCizY3sKFGSlGoikzoqsT3iPNlxDSiBcslvCOD8aiTJkzusBjjuwtj9EvwVBH4u948xo5Z_0rPPUY0P4OnRDCTOMqWAsR0o7VyrqLAAAisR8qHcA9Q"
        },
        "2": {
            name: "Marcus Thorne",
            role: "Pentester Senior",
            bio: "Experto en explotación de redes y auditoría de sistemas corporativos.",
            avatar: "https://ui-avatars.com/api/?name=Marcus+Thorne&background=0D8ABC&color=fff"
        },
        "3": {
            name: "Alex Rivera",
            role: "Analista SOC",
            bio: "Especialista en monitoreo, detección de amenazas y respuesta a incidentes.",
            avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=random"
        },
        "4": {
            name: "Sarah Chen",
            role: "Ingeniera de Malware",
            bio: "Hacking ético e ingeniería inversa para proteger infraestructuras críticas.",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=ff00ff&color=fff"
        }
    };
}

if (typeof window.getAuthorName === 'undefined') {
    window.getAuthorName = function (id) {
        return window.authorsData[id] ? window.authorsData[id].name : id;
    };
}

/**
 * Renderiza la tarjeta del autor en el contenedor especificado.
 * @param {string} authorId - ID del autor (ej: "1").
 * @param {string} containerId - ID del div donde se renderizará (default: 'author-card-container').
 */
if (typeof window.renderAuthorCard === 'undefined') {
    window.renderAuthorCard = function (authorId, containerId = 'author-card-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const author = window.authorsData[authorId];
        // Fallback si el autor no existe
        if (!author) {
            console.warn(`Autor ID '${authorId}' no encontrado.`);
            return;
        }

        const html = `
            <div class="mt-16 p-6 rounded-xl bg-slate-100 dark:bg-[#1b212e] border border-slate-200 dark:border-slate-800 flex gap-6">
                <div class="w-20 h-20 shrink-0 rounded-full bg-cover bg-center border-2 border-primary" style="background-image: url('${author.avatar}')"></div>
                <div class="flex-1">
                    <h4 class="text-slate-900 dark:text-white text-lg font-bold">${author.name}</h4>
                    <p class="text-primary text-sm font-medium">${author.role}</p>
                    <p class="text-slate-500 dark:text-[#9da6b9] text-sm leading-relaxed mt-2">${author.bio}</p>
                </div>
            </div>
        `;

        container.innerHTML = html;
    };
}

/**
 * Busca elementos con la clase 'author-name-display' y atributo 'data-author-id'
 * y actualiza su texto con el nombre del autor correspondiente.
 */
if (typeof window.updateAuthorNames === 'undefined') {
    window.updateAuthorNames = function () {
        document.querySelectorAll('.author-name-display').forEach(el => {
            const id = el.dataset.authorId;
            if (id) {
                el.textContent = window.getAuthorName(id);
            }
        });
    };
}

// Auto-ejecutar al cargar si hay elementos
document.addEventListener('DOMContentLoaded', window.updateAuthorNames);
// Ejecutar inmediatamente por si ya cargó
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.updateAuthorNames();
}
