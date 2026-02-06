# TechSec Blog 🛡️💻

**TechSec** es un blog moderno y minimalista enfocado en Ciberseguridad, Hacking Ético y Desarrollo Web Full Stack. Diseñado para ser extremadamente rápido, seguro y fácil de mantener sin depender de bases de datos complejas ni backends pesados.

![TechSec Preview](img/preview.jpg)
*(Asegúrate de agregar una captura de pantalla del home como preview.jpg en tu carpeta img)*

## 🚀 Características Principales

- **Arquitectura SPA (Single Page Application) Híbrida**: Navegación fluida y rápida utilizando Vanilla JS.
- **Sin Base de Datos**: Todo el contenido se gestiona a través de archivos JSON/JS estáticos, lo que lo hace "in-hackeable" vía SQL Injection.
- **Modo Oscuro/Claro**: Soporte nativo para preferencias de sistema y diseño responsivo.
- **Buscador en Tiempo Real**: Filtrado de artículos por título, contenido y etiquetas instantáneo.
- **Sistema de Autores y Artículos**: Gestión centralizada de metadatos de autores y posts.
- **Diseño Premium**: Interfaz limpia utilizando TailwindCSS y fuentes modernas (Space Grotesk, JetBrains Mono).

## 🛠️ Tecnologías

Este proyecto está construido con un enfoque "Less is More":

- **Core**: HTML5 Semántico.
- **Estilos**: TailwindCSS (vía CDN para desarrollo rápido, fácilmente compilable para prod).
- **Lógica**: Vanilla JavaScript (ES6+).
- **Iconos**: Google Material Symbols.
- **Fuentes**: Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## 📂 Estructura del Proyecto

```bash
/blog
  ├── /articles           # Archivos HTML de cada artículo individual
  ├── /css                # Estilos personalizados (si aplica)
  ├── /img                # Assets, avatares y portadas de artículos
  ├── /js
  │   ├── articles_data.js # "Base de datos" de los artículos
  │   ├── authors.js       # Datos de los autores
  │   ├── layout.js        # Componentes UI (Header, Footer, Nav, Buscador)
  │   ├── router.js        # Lógica de navegación SPA lite
  │   └── config.js        # Configuraciones globales (Tailwind)
  ├── index.html          # Página de inicio
  ├── feed.html           # Listado de todos los artículos (con filtros)
  ├── ...otros .html      # Páginas estáticas (about, contact, etc.)
  └── README.md
```

## ⚡ Instalación y Despliegue

### Requisitos
No necesitas Node.js, PHP ni MySQL para ejecutar la versión básica. Solo un navegador web moderno.

### Ejecución Local
1.  Clona el repositorio:
    ```bash
    git clone https://github.com/KevinGil12C/kevscl.blog.git
    ```
2.  Abre la carpeta en tu servidor web local (ej. XAMPP en `htdocs/blog`) o usa una extensión como "Live Server" en VS Code.
3.  Accede a `http://localhost/blog` (o la ruta correspondiente).

### Cómo Agregar un Nuevo Artículo
1.  Crea el archivo HTML del artículo en la carpeta `/articles` (puedes copiar uno existente como plantilla).
2.  Abre `/js/articles_data.js`.
3.  Agrega un nuevo objeto al array `articlesData` con los metadatos:
    ```javascript
    {
        id: "nuevo_post",
        title: "Título del Post",
        excerpt: "Breve descripción...",
        author: "1", // ID del autor en authors.js
        date: "06 Feb 2026",
        tags: ["tag1", "tag2"],
        image: "img/cover.jpg",
        url: "articles/nuevo_post.html"
    }
    ```
4.  ¡Listo! Aparecerá automáticamente en el Home y en el Feed.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerencias.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---
Desarrollado con 💙 por [Kevin Coyote](https://github.com/KevinGil12C)
