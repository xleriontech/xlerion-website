// ==================== MENÚ MÓVIL CENTRALIZADO ====================
function setupMobileMenu() {
    function tryAttachMobileMenu() {
        const sectionsToggle = document.getElementById('sections-toggle');
        const sectionsMenu = document.getElementById('sections-menu');
        if (!sectionsToggle || !sectionsMenu) {
            setTimeout(tryAttachMobileMenu, 200); // Espera y reintenta si el DOM aún no está listo
            return;
        }
        // Evita listeners duplicados
        if (sectionsToggle._menuListenerAttached) return;
        sectionsToggle._menuListenerAttached = true;

        // Toggle del menú
        sectionsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sectionsMenu.classList.toggle('hidden');
            if (!sectionsMenu.classList.contains('hidden')) {
                console.log('[MOBILE MENU] Menú abierto');
            }
        });

        // Cerrar menú si se hace clic fuera
        document.addEventListener('click', (e) => {
            if (!sectionsMenu.classList.contains('hidden') && !sectionsMenu.contains(e.target) && !sectionsToggle.contains(e.target)) {
                sectionsMenu.classList.add('hidden');
            }
        });

        // Navegar a secciones y cerrar menú
        document.querySelectorAll('#sections-menu .section-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) {
                    document.querySelectorAll('section[id$="Container"], section[id$="Section"]').forEach(s => {
                        s.classList.add('hidden');
                    });
                    section.classList.remove('hidden');
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                sectionsMenu.classList.add('hidden');
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryAttachMobileMenu);
    } else {
        tryAttachMobileMenu();
    }
}
// ==================== SISTEMA DE TRADUCCIÓN ====================
const translations = {
    es: {
        // Meta
        pageTitle: "Mi Historia",

        // Header
        projects: "Proyectos",
        about: "Acerca de",
        contact: "Contacto",
        adminPanel: "Panel Admin",
        login: "Iniciar Sesión",
        logout: "Salir",

        // Mobile Menu
        chapters: "Capítulos",
        characters: "Personajes",
        places: "Lugares",
        objects: "Objetos",
        mindMap: "Mapa Mental",

        // Loading
        loadingStory: "Cargando historia...",

        // Project Selection
        communityComments: "Comentarios de la Comunidad",

        // Story Content
        backToList: "Volver a la lista",
        synopsis: "Sinopsis",
        keyObjects: "Objetos Clave",
        mindMapTitle: "Mapa Mental de la Trama",

        // Buttons
        viewDetails: "Ver detalles",
        close: "Cerrar",
        closeWindow: "Cerrar ventana",
        comment: "Comentar",
        send: "Enviar",

        // Login Modal
        loginTitle: "Iniciar Sesión / Registrarse",
        loginDescription: "Ingresa tu correo para calificar y comentar. No se necesita contraseña.",
        emailPlaceholder: "tu-correo@ejemplo.com",
        enter: "Ingresar",

        // Details Modal
        ratings: "Calificaciones",
        comments: "Comentarios",
        yourRating: "Tu calificación:",
        commentPlaceholder: "Escribe tu comentario...",

        // Footer
        footerDescription: "Tu plataforma para crear y compartir mundos e historias interactivas.",
        navigation: "Navegación",
        resources: "Recursos",
        documentation: "Documentación",
        support: "Soporte",
        legal: "Legal",
        privacyPolicy: "Política de Privacidad",
        termsOfService: "Términos de Servicio",
        allRightsReserved: "Todos los derechos reservados.",

        // Messages
        noChapters: "No hay capítulos disponibles.",
        noCharacters: "No hay personajes disponibles.",
        noPlaces: "No hay lugares disponibles.",
        noObjects: "No hay objetos disponibles.",
        noComments: "No hay comentarios aún. ¡Sé el primero en comentar!",
        loginToRate: "Inicia sesión para calificar",
        loginToComment: "Inicia sesión para comentar",

        // Dynamic content
        noDescription: "Sin descripción.",
        chapter: "Capítulo",
        chaptersCount: "capítulos",
        charactersCount: "personajes",
        alreadyCommented: "Ya has comentado en este ítem.",
        alreadyRated: "(Ya has calificado)",
        followUs: "Síguenos",
        allRightsReservedText: "Todos los derechos reservados.",
        invalidEmail: "Por favor, usa un correo de un proveedor conocido (Gmail, Outlook, Yahoo, etc.).",
        noMindMapData: "No hay datos del mapa mental para mostrar.",

        // Detail sections
        detail: "Detalle",
        summary: "Resumen",
        generalDescription: "Descripción General",
        details: "Detalles",
        age: "Edad",
        height: "Altura",
        gender: "Género",
        physicalDescription: "Descripción Física",
        backstory: "Trasfondo",
        placeType: "Tipo de Lugar",
        atmosphere: "Atmósfera / Ambiente",
        keyFeatures: "Características Clave",
        historyLore: "Historia / Lore",
        placeMap: "Mapa del Lugar",
        objectType: "Tipo de Objeto",
        origin: "Origen / Fabricación",
        powers: "Poderes / Habilidades",
        relevance: "Relevancia en la Trama",

        // Gender types
        male: "Masculino",
        female: "Femenino",
        other: "Otro",
        "no-especificado": "No especificado",

        // Place types
        city: "Ciudad",
        forest: "Bosque",
        mountain: "Montaña",
        desert: "Desierto",
        building: "Edificio",
        underground: "Subterráneo",

        // Object types
        weapon: "Arma",
        artifact: "Artefacto",
        tool: "Herramienta",
        clothing: "Vestimenta",
        vehicle: "Vehículo",
        document: "Documento",

        // Ratings
        votes: "votos",
        vote: "voto",
    },
    en: {
        // Meta
        pageTitle: "My Story",

        // Header
        projects: "Projects",
        about: "About",
        contact: "Contact",
        adminPanel: "Admin Panel",
        login: "Sign In",
        logout: "Sign Out",

        // Mobile Menu
        chapters: "Chapters",
        characters: "Characters",
        places: "Places",
        objects: "Objects",
        mindMap: "Mind Map",

        // Loading
        loadingStory: "Loading story...",

        // Project Selection
        communityComments: "Community Comments",

        // Story Content
        backToList: "Back to list",
        synopsis: "Synopsis",
        keyObjects: "Key Objects",
        mindMapTitle: "Plot Mind Map",

        // Buttons
        viewDetails: "View details",
        close: "Close",
        closeWindow: "Close window",
        comment: "Comment",
        send: "Send",

        // Login Modal
        loginTitle: "Sign In / Register",
        loginDescription: "Enter your email to rate and comment. No password required.",
        emailPlaceholder: "your-email@example.com",
        enter: "Enter",

        // Details Modal
        ratings: "Ratings",
        comments: "Comments",
        yourRating: "Your rating:",
        commentPlaceholder: "Write your comment...",

        // Footer
        footerDescription: "Your platform to create and share interactive worlds and stories.",
        navigation: "Navigation",
        resources: "Resources",
        documentation: "Documentation",
        support: "Support",
        legal: "Legal",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        allRightsReserved: "All rights reserved.",

        // Messages
        noChapters: "No chapters available.",
        noCharacters: "No characters available.",
        noPlaces: "No places available.",
        noObjects: "No objects available.",
        noComments: "No comments yet. Be the first to comment!",
        loginToRate: "Sign in to rate",
        loginToComment: "Sign in to comment",

        // Dynamic content
        noDescription: "No description.",
        chapter: "Chapter",
        chaptersCount: "chapters",
        charactersCount: "characters",
        alreadyCommented: "You have already commented on this item.",
        alreadyRated: "(Already rated)",
        followUs: "Follow Us",
        allRightsReservedText: "All rights reserved.",
        invalidEmail: "Please use an email from a known provider (Gmail, Outlook, Yahoo, etc.).",
        noMindMapData: "No mind map data to display.",

        // Detail sections
        detail: "Detail",
        summary: "Summary",
        generalDescription: "General Description",
        details: "Details",
        age: "Age",
        height: "Height",
        gender: "Gender",
        physicalDescription: "Physical Description",
        backstory: "Backstory",
        placeType: "Place Type",
        atmosphere: "Atmosphere / Ambiance",
        keyFeatures: "Key Features",
        historyLore: "History / Lore",
        placeMap: "Place Map",
        objectType: "Object Type",
        origin: "Origin / Manufacturing",
        powers: "Powers / Abilities",
        relevance: "Plot Relevance",

        // Gender types
        male: "Male",
        female: "Female",
        other: "Other",
        "no-especificado": "Not specified",

        // Place types
        city: "City",
        forest: "Forest",
        mountain: "Mountain",
        desert: "Desert",
        building: "Building",
        underground: "Underground",

        // Object types
        weapon: "Weapon",
        artifact: "Artifact",
        tool: "Tool",
        clothing: "Clothing",
        vehicle: "Vehicle",
        document: "Document",

        // Ratings
        votes: "votes",
        vote: "vote",
    }
};

let currentLanguage = localStorage.getItem('siteLanguage') || 'es';

// Mapa de traducción de proyecto (se actualiza cuando se carga un proyecto)
let currentProjectTranslated = null;

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('siteLanguage', lang);

    // Actualizar indicador de idioma
    const langIndicator = document.getElementById('current-language');
    if (langIndicator) {
        langIndicator.textContent = lang.toUpperCase();
    }

    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang;

    // Traducir todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Actualizar title de la página
    const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
    if (titleKey && translations[lang][titleKey]) {
        document.title = translations[lang][titleKey];
    }

    // Refrescar el contenido del proyecto actual si está visible
    if (currentProjectTranslated) {
        // Traducir el proyecto
        const translatedProject = translateProject(currentProjectTranslated);
        // Actualizar sin perder datos de calificaciones y comentarios
        Object.assign(currentProjectTranslated, translatedProject);

        // Disparar evento personalizado para que otros componentes sepan que cambió el idioma
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
} function t(key) {
    return translations[currentLanguage][key] || key;
}

// ===== SISTEMA DE CACHÉ DE TRADUCCIONES DINÁMICAS =====
// Cache en localStorage para almacenar traducciones automáticas
const translationCache = {
    get(text, targetLang) {
        if (!text) return null;
        const key = `trans_${btoa(text)}_${targetLang}`;
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
    },
    set(text, targetLang, translation) {
        if (!text) return;
        const key = `trans_${btoa(text)}_${targetLang}`;
        localStorage.setItem(key, JSON.stringify(translation));
    },
    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('trans_')) localStorage.removeItem(key);
        });
    }
};

// Mapa de traducciones manuales predefinidas (fallback)
const contentTranslations = {
    es: {
        // Proyecto principal
        "projectName": "Total Darkness",
        "projectDescription": "La humanidad, una magnífica e impredecible raza en el universo, siempre encuentra la manera de salir adelante ante cualquier eventualidad u obstáculo. Se ha convertido en la especie dominante de la Tierra, rigiendo su destino con voluntad y creatividad. A lo largo del tiempo, ha desarrollado tecnologías que han impulsado su evolución, herramientas nacidas de su propia mente que, sin duda, la convierten en una raza excepcional.",

        // Capítulos
        "PROLOGO -  CADA FIN TIENE UN COMIENZO": "PROLOGO -  CADA FIN TIENE UN COMIENZO",
        "Capitulo II: MULTIPLES ORIGENES": "Capitulo II: MULTIPLES ORIGENES",
        "Capitulo III: ELECCIÓN O DESTINO?": "Capitulo III: ELECCIÓN O DESTINO?",
        "Capítulo IV: XLERION": "Capítulo IV: XLERION",
        "Capítulo V:  LA LUZ DEL SOL": "Capítulo V:  LA LUZ DEL SOL",
        "Capítulo VI: MATAR PARA VIVIR": "Capítulo VI: MATAR PARA VIVIR",
        "Capítulo VII: LA ÚLTIMA PALABRA": "Capítulo VII: LA ÚLTIMA PALABRA",
        "Capitulo VIII: Alma de Fuego": "Capitulo VIII: Alma de Fuego",
        "Capítulo IX: La Guerra de Orgullo": "Capítulo IX: La Guerra de Orgullo",
        " Capítulo X: RED TORMENTHOR": " Capítulo X: RED TORMENTHOR",
        " Capítulo XI: OSCURIDAD TOTAL": " Capítulo XI: OSCURIDAD TOTAL",
        "Capitulo XII: La Muerte del guerrero": "Capitulo XII: La Muerte del guerrero",
    },
    en: {
        // Proyecto principal
        "projectName": "Total Darkness",
        "projectDescription": "Humanity, a magnificent and unpredictable race in the universe, always finds a way to move forward against any eventuality or obstacle. It has become the dominant species on Earth, controlling its destiny with will and creativity. Over time, it has developed technologies that have driven its evolution, tools born from its own mind that, undoubtedly, make it an exceptional race.",

        // Capítulos
        "PROLOGO -  CADA FIN TIENE UN COMIENZO": "PROLOGUE - EVERY END HAS A BEGINNING",
        "Capitulo II: MULTIPLES ORIGENES": "Chapter II: MULTIPLE ORIGINS",
        "Capitulo III: ELECCIÓN O DESTINO?": "Chapter III: CHOICE OR DESTINY?",
        "Capítulo IV: XLERION": "Chapter IV: XLERION",
        "Capítulo V:  LA LUZ DEL SOL": "Chapter V: THE LIGHT OF THE SUN",
        "Capítulo VI: MATAR PARA VIVIR": "Chapter VI: KILL TO LIVE",
        "Capítulo VII: LA ÚLTIMA PALABRA": "Chapter VII: THE LAST WORD",
        "Capitulo VIII: Alma de Fuego": "Chapter VIII: Soul of Fire",
        "Capítulo IX: La Guerra de Orgullo": "Chapter IX: The War of Pride",
        " Capítulo X: RED TORMENTHOR": " Chapter X: RED TORMENTHOR",
        " Capítulo XI: OSCURIDAD TOTAL": " Chapter XI: TOTAL DARKNESS",
        "Capitulo XII: La Muerte del guerrero": "Chapter XII: The Warrior's Death",
    }
};

// Función para traducir contenido con fallback en caché y mapa manual
function translateContent(text, targetLanguage = null) {
    if (!text) return text;
    const lang = targetLanguage || currentLanguage;
    if (lang === 'es') return text;

    // 1. Intentar mapa manual predefinido
    if (contentTranslations[lang]?.[text]) {
        return contentTranslations[lang][text];
    }

    // 2. Intentar caché de localStorage
    const cached = translationCache.get(text, lang);
    if (cached) return cached;

    // 3. Si no está en caché y es contenido dinámico, registrar para traducción
    trackMissingTranslation(text, lang);
    console.warn(`[i18n] Contenido dinámico detectado sin traducción: "${text.substring(0, 50)}..."`);
    return text;
}

// Función para guardar una traducción manual en caché
function saveTranslation(originalText, translation, targetLang = 'en') {
    if (!originalText || !translation) return;
    translationCache.set(originalText, targetLang, translation);
    // También agregar al mapa para persistencia
    if (!contentTranslations[targetLang]) contentTranslations[targetLang] = {};
    contentTranslations[targetLang][originalText] = translation;
}

// Función para detectar contenido sin traducción y registrarlo
function trackMissingTranslation(text, targetLang = 'en') {
    if (!text || targetLang === 'es') return;

    // Verificar si ya existe traducción
    if (contentTranslations[targetLang]?.[text]) return;
    const cached = translationCache.get(text, targetLang);
    if (cached) return;

    // Almacenar en array de traducciones faltantes
    if (!window.missingTranslations) window.missingTranslations = [];
    if (!window.missingTranslations.find(t => t.text === text && t.lang === targetLang)) {
        window.missingTranslations.push({ text, lang: targetLang, timestamp: new Date() });
    }
}

// Función para exportar traducciones faltantes como JSON
function exportMissingTranslations() {
    const missing = window.missingTranslations || [];
    const json = JSON.stringify(missing, null, 2);
    console.log('[i18n] Contenido sin traducción:', json);
    return json;
}

// Función para importar traducciones desde un objeto
function importTranslations(translationsObj) {
    if (!translationsObj) return;
    Object.entries(translationsObj).forEach(([text, translation]) => {
        saveTranslation(text, translation, 'en');
    });
    console.log('[i18n] Traducciones importadas correctamente');
}

// Mapa de traducciones para campos de la base de datos (valores literales)
const fieldTranslations = {
    es: {
        // Géneros
        "Masculino": "Masculino",
        "Femenino": "Femenino",
        "Otro": "Otro",

        // Tipos de lugares
        "Ciudad": "Ciudad",
        "Bosque": "Bosque",
        "Montaña": "Montaña",
        "Desierto": "Desierto",
        "Edificio": "Edificio",
        "Subterráneo": "Subterráneo",

        // Tipos de objetos
        "Arma": "Arma",
        "Artefacto": "Artefacto",
        "Herramienta": "Herramienta",
        "Vestimenta": "Vestimenta",
        "Vehículo": "Vehículo",
        "Documento": "Documento",
    },
    en: {
        // Géneros
        "Masculino": "Male",
        "Femenino": "Female",
        "Otro": "Other",

        // Tipos de lugares
        "Ciudad": "City",
        "Bosque": "Forest",
        "Montaña": "Mountain",
        "Desierto": "Desert",
        "Edificio": "Building",
        "Subterráneo": "Underground",

        // Tipos de objetos
        "Arma": "Weapon",
        "Artefacto": "Artifact",
        "Herramienta": "Tool",
        "Vestimenta": "Clothing",
        "Vehículo": "Vehicle",
        "Documento": "Document",
    }
};

// Función para traducir valores de la base de datos
function translateDBValue(value) {
    if (!value) return value;
    return fieldTranslations[currentLanguage]?.[value] || value;
}

// Función para traducir un proyecto completo
function translateProject(project) {
    if (!project) return project;

    const translated = { ...project };

    // Traducir nombre del proyecto
    translated.name = translateContent(project.name) || project.name;

    // Traducir descripción larga
    if (project.descripcionLarga) {
        translated.descripcionLarga = translateContent(project.descripcionLarga) || project.descripcionLarga;
    }

    // Traducir campos de capítulos
    if (translated.chapters && Array.isArray(translated.chapters)) {
        translated.chapters = translated.chapters.map(chapter => ({
            ...chapter,
            name: translateContent(chapter.name) || chapter.name,
            description: chapter.description || "",
        }));
    }

    // Traducir campos de personajes
    if (translated.characters && Array.isArray(translated.characters)) {
        translated.characters = translated.characters.map(char => ({
            ...char,
            gender: translateDBValue(char.gender),
        }));
    }

    // Traducir campos de lugares
    if (translated.places && Array.isArray(translated.places)) {
        translated.places = translated.places.map(place => ({
            ...place,
            placeType: translateDBValue(place.placeType),
        }));
    }

    // Traducir campos de objetos
    if (translated.objects && Array.isArray(translated.objects)) {
        translated.objects = translated.objects.map(obj => ({
            ...obj,
            objectType: translateDBValue(obj.objectType),
        }));
    }

    return translated;
}

document.addEventListener('DOMContentLoaded', () => {
    let allProjects = [];
    let currentProject = null; // Proyecto actualmente seleccionado
    let currentUser = null; // Correo del usuario actual

    // --- NUEVO: Selectores para la gestión de usuario, calificaciones y comentarios ---
    const userSessionContainer = document.getElementById('user-session');
    const userEmailSpan = document.getElementById('user-email-span');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const btnCloseLoginModal = document.getElementById('closeLoginModal');
    const loginError = document.getElementById('loginError');

    let publicMindMapNetwork = null; // Instancia del mapa mental para la vista pública
    let allComments = []; // Caché para todos los comentarios de los proyectos
    let commentSliderInterval; // Intervalo para el slider de comentarios

    const loadingScreen = document.getElementById('loading'); // Pantalla de carga
    const storyContent = document.getElementById('storyContent');
    const projectSelectionScreen = document.getElementById('projectSelectionScreen');
    const publicProjectList = document.getElementById('publicProjectList');
    const backToProjectsBtn = document.getElementById('backToProjectsBtn');
    const detailsModal = document.getElementById('publicDetailsModal');
    const detailsModalContent = document.getElementById('publicDetailsModalContent');
    const detailsTitle = document.getElementById('publicDetailsTitle');
    const detailsBody = document.getElementById('publicDetailsBody');

    const detailsRatingContainer = document.getElementById('detailsRatingContainer');
    const detailsCommentsContainer = document.getElementById('detailsCommentsContainer');
    const commentsList = document.getElementById('commentsList');
    const commentForm = document.getElementById('commentForm');

    // Selectores para el modal de contenido estático (Acerca de, Contacto, etc.)
    const staticContentModal = document.getElementById('staticContentModal');
    const staticContentTitle = document.getElementById('staticContentTitle');
    const staticContentBody = document.getElementById('staticContentBody');
    const btnCloseStaticContent = document.getElementById('btnCloseStaticContent');
    let db; // Instancia de la base de datos
    // FIX: Se define dbPromise fuera para que sea accesible globalmente en este script.

    async function initDB() {
        // Reutilizamos la configuración de la base de datos de app.js
        // para asegurar la consistencia.
        // Bump to v5 to align with admin panel and recreate missing stores
        db = await idb.openDB('story-creator-db', 5, {
            upgrade(db, oldVersion, newVersion, transaction) {
                // Asegurar el store de proyectos (debe existir para app/historia)
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects');
                }

                // Lógica de actualización mejorada para 'ratings'
                const ratingsStore = db.objectStoreNames.contains('ratings')
                    ? transaction.objectStore('ratings')
                    : db.createObjectStore('ratings', { keyPath: 'id', autoIncrement: true });

                if (!ratingsStore.indexNames.contains('user_item')) ratingsStore.createIndex('user_item', ['userEmail', 'itemId'], { unique: true });
                if (!ratingsStore.indexNames.contains('by_item')) ratingsStore.createIndex('by_item', 'itemId');

                // Lógica de actualización mejorada para 'comments'
                const commentsStore = db.objectStoreNames.contains('comments')
                    ? transaction.objectStore('comments')
                    : db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });

                if (!commentsStore.indexNames.contains('by_project')) commentsStore.createIndex('by_project', 'projectId');
                if (!commentsStore.indexNames.contains('by_user')) commentsStore.createIndex('by_user', 'userEmail');
            },
        });
    }

    // --- NUEVO: Lógica de Gestión de Usuario ---

    function checkUserSession() {
        const storedEmail = localStorage.getItem('storyCreatorUser');
        // FIX: Si el contenedor de sesión no existe, no hacemos nada.
        if (!userSessionContainer) return;

        if (storedEmail) {
            currentUser = storedEmail;
            if (userEmailSpan) userEmailSpan.textContent = currentUser;
            // Oculta el botón de login y muestra la info del usuario
            const loggedOutDiv = userSessionContainer.querySelector('.logged-out');
            const loggedInDiv = userSessionContainer.querySelector('.logged-in');
            if (loggedOutDiv) loggedOutDiv.classList.add('hidden');
            if (loggedInDiv) loggedInDiv.classList.remove('hidden');
        } else {
            currentUser = null;
            // Muestra el botón de login y oculta la info del usuario
            const loggedOutDiv = userSessionContainer.querySelector('.logged-out');
            const loggedInDiv = userSessionContainer.querySelector('.logged-in');
            if (loggedOutDiv) loggedOutDiv.classList.remove('hidden');
            if (loggedInDiv) loggedInDiv.classList.add('hidden');
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        if (!emailInput || !loginError || !loginModal) return; // Comprobar que los elementos del formulario existen.

        const email = emailInput.value.trim();
        const validDomains = [
            '@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com',
            '@yahoo.es', '@yahoo.com.ar', '@yahoo.com.mx', '@protonmail.com', '@icloud.com'
        ];

        if (email && validDomains.some(domain => email.endsWith(domain))) {
            localStorage.setItem('storyCreatorUser', email);
            loginError.classList.add('hidden');
            loginModal.classList.add('hidden');
            emailInput.value = '';
            currentUser = email;
            checkUserSession();
            // Sincronizar UI en móvil y desktop
            if (window.updateAuthUI) window.updateAuthUI(true, email);
            // Re-renderizar el modal de detalles si está abierto para mostrar los formularios
            if (!detailsModal.classList.contains('hidden')) {
                const type = detailsModal.dataset.type;
                const index = detailsModal.dataset.index;
                showDetails(type, parseInt(index, 10));
            }
        } else {
            loginError.textContent = t('invalidEmail');
            loginError.classList.remove('hidden');
        }
    }

    function handleLogout() {
        if (!detailsModal) return; // Comprobar que los elementos existen.

        localStorage.removeItem('storyCreatorUser');
        currentUser = null;
        checkUserSession();
        // Sincronizar UI en móvil y desktop
        if (window.updateAuthUI) window.updateAuthUI(false);
        // Re-renderizar el modal de detalles si está abierto para ocultar los formularios
        if (!detailsModal.classList.contains('hidden')) {
            const type = detailsModal.dataset.type;
            const index = detailsModal.dataset.index;
            showDetails(type, parseInt(index, 10));
        }
    }

    // Función para cerrar el modal de detalles
    function closeDetailsModal() {
        if (detailsModal) {
            detailsModal.classList.add('hidden');
        }
    }


    // --- NUEVO: Funciones para Calificaciones y Comentarios ---
    // Guarda una calificación, asegurando que el usuario no haya calificado antes.
    async function saveRating(itemId, rating) {
        if (!currentUser) return false;

        try {
            const response = await fetch('update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add_rating',
                    projectId: currentProject.id, // <-- AÑADIDO: Enviar el ID del proyecto
                    itemId,
                    userEmail: currentUser,
                    rating
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error del servidor al guardar la calificación.');
            }
            const result = await response.json();
            if (result.success) {
                // Actualizar la calificación en el objeto local para reflejo inmediato.
                const item = findItemById(itemId);
                if (item) {
                    if (!item.ratings) item.ratings = [];
                    // Eliminar calificación anterior del usuario si existe, para evitar duplicados.
                    item.ratings = item.ratings.filter(r => r.userEmail !== currentUser);
                    // Añadir la nueva calificación.
                    item.ratings.push({ userEmail: currentUser, rating });
                }
                // Notificar a otras pestañas (como el editor principal) que los datos han cambiado.
                // Se usa un valor aleatorio para asegurar que el evento 'storage' se dispare siempre.
                localStorage.setItem('xlerion-story-creator-update', Date.now().toString());
                return true;
            } else {
                alert(result.message); // Mostrar mensaje si el usuario ya votó
                return false;
            }
        } catch (error) {
            console.error("Error al guardar la calificación:", error);
            alert(error.message);
            return false;
        }
    }

    // Guarda un comentario, asegurando que el usuario no haya comentado antes.
    async function saveComment(itemId, message) {
        if (!currentUser || !message.trim()) return false; // Validaciones básicas
        try {
            const response = await fetch('update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add_comment',
                    projectId: currentProject.id, // <-- AÑADIDO: Enviar el ID del proyecto
                    itemId,
                    userEmail: currentUser,
                    message,
                    timestamp: Date.now()
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error del servidor al guardar el comentario.');
            }
            const result = await response.json();
            if (result.success) {
                if (!currentProject.comments) currentProject.comments = [];
                currentProject.comments.push({ itemId, userEmail: currentUser, message, timestamp: Date.now() });
                return true;
            }
            alert(result.message);
            return false;
        } catch (error) {
            console.error("Error al guardar el comentario:", error);
            return false;
        }
    }

    function findItemById(itemId) {
        for (const category of ['chapters', 'characters', 'places', 'objects']) {
            const item = currentProject[category]?.find(i => (i.id || `${currentProject.id}-${category}-${currentProject[category].indexOf(i)}`) === itemId);
            if (item) {
                return item;
            }
        }
        return null;
    }

    // --- Lógica de Renderizado ---

    function renderProject(project) {
        // Limpiar contenido anterior para evitar duplicados al cambiar de proyecto
        document.getElementById('chaptersList').innerHTML = '';
        document.getElementById('charactersList').innerHTML = '';
        document.getElementById('placesList').innerHTML = '';
        document.getElementById('objectsList').innerHTML = '';

        document.title = project.name;
        // Ocultar sliders al ver un proyecto específico
        document.getElementById('image-slider-container').classList.add('hidden');
        document.getElementById('comment-slider-container').classList.add('hidden');

        document.getElementById('projectTitle').textContent = project.name;

        const coverImg = document.getElementById('projectCover');
        if (project.coverImage) {
            coverImg.src = project.coverImage;
            coverImg.classList.remove('hidden');
        } else {
            coverImg.classList.add('hidden');
        }

        const summaryContainer = document.getElementById('projectSummaryContainer');
        if (project.descripcionLarga) {
            document.getElementById('projectSummary').textContent = project.descripcionLarga;
            summaryContainer.classList.remove('hidden');
        } else {
            summaryContainer.classList.add('hidden');
        }

        renderSection(project.chapters, 'chaptersContainer', 'chaptersList', createChapterCard);
        renderSection(project.characters, 'charactersContainer', 'charactersList', createGenericCard);
        renderSection(project.places, 'placesContainer', 'placesList', createGenericCard);
        renderSection(project.objects, 'objectsContainer', 'objectsList', createGenericCard);

        // Renderizar Mapa Mental
        const mindMapSection = document.getElementById('mindMapSection');
        if (project.mindMap && project.mindMap.nodes && project.mindMap.nodes.length > 0) {
            mindMapSection.classList.remove('hidden');
            initPublicMindMap(project);
        } else {
            mindMapSection.classList.add('hidden');
        }

        // Ocultar el loader y mostrar el contenido
        loadingScreen.classList.add('hidden');
        storyContent.classList.remove('hidden');
    }

    function renderSection(items, containerId, listId, cardCreator) {
        if (items && items.length > 0) {
            const container = document.getElementById(containerId);
            const list = document.getElementById(listId);
            list.innerHTML = ''; // Limpiar lista antes de renderizar

            // Para capítulos, ordenar por el campo 'order'
            if (containerId === 'chaptersContainer') {
                items.sort((a, b) => (a.order || 0) - (b.order || 0));
            }

            for (const [index, item] of items.entries()) {
                const type = containerId.replace('Container', '');
                let card; // La variable 'type' será 'chapters', 'characters', etc.
                if (cardCreator === createGenericCard) {
                    card = cardCreator(item, type);
                } else {
                    card = cardCreator(item);
                }
                // Asignar el click al contenedor principal de la tarjeta de forma segura
                card.addEventListener('click', () => showDetails(type, index));
                list.appendChild(card);
            }
            container.classList.remove('hidden');
        }
    }

    function createChapterCard(chapter) {
        const card = document.createElement('div');
        card.className = 'content-card rounded-lg overflow-hidden flex flex-col cursor-pointer';

        let description = chapter.description || t('noDescription');
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';
        }

        // Calcular promedio de calificaciones si existen (antes de generar la imagen para insertar badge)
        const chapterRatings = chapter.ratings || [];
        const avgRating = chapterRatings.length > 0 ? (chapterRatings.reduce((s, r) => s + (r.rating || r), 0) / chapterRatings.length) : 0;
        const roundedAvg = Math.round(avgRating);

        // Badge que se superpone sobre la imagen (si existe)
        let badgeHtml = `<div class="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-semibold flex items-center gap-2">`;
        for (let i = 1; i <= 5; i++) {
            badgeHtml += `<i class="fas fa-star ${i <= roundedAvg ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
        }
        badgeHtml += `<span class="text-gray-300">${avgRating > 0 ? avgRating.toFixed(1) : '0.0'}</span>`;
        badgeHtml += `</div>`;

        // Envolver la imagen en un contenedor relativo para mostrar el badge con la calificación
        const imageHTML = chapter.image
            ? `<div class="relative w-full h-48 overflow-hidden">${badgeHtml}<img src="${chapter.image}" alt="${chapter.name}" class="w-full h-full object-cover">` +
            `</div>`
            : `<div class="relative w-full h-48 bg-gray-700 flex items-center justify-center">` +
            `${badgeHtml}<i class="fas fa-book-open text-4xl text-gray-500"></i></div>`;

        // Html de calificaciones que se agrega en el pie de la card
        let ratingHtml = '<div class="mt-3 flex items-center">';
        ratingHtml += '<div class="text-sm flex gap-1">';
        for (let i = 1; i <= 5; i++) {
            ratingHtml += `<i class="fas fa-star ${i <= roundedAvg ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
        }
        ratingHtml += '</div>';
        ratingHtml += `<span class="rating-average text-xs text-gray-400 ml-3">${avgRating > 0 ? avgRating.toFixed(1) : '0.0'}/5 (${chapterRatings.length})</span>`;
        ratingHtml += '</div>';

        card.innerHTML = `
            ${imageHTML}
            <div class="p-4 flex-grow flex flex-col">
                <h4 class="text-lg font-bold text-white mb-2">${chapter.order ? `${t('chapter')} ${chapter.order}: ` : ''}${chapter.name}</h4>
                <p class="text-sm text-gray-400 flex-grow">${description}</p>
            </div>
        `;
        return card;
    }

    function createGenericCard(item, type) {
        const card = document.createElement('div');
        card.className = 'content-card rounded-lg overflow-hidden flex flex-col cursor-pointer';

        let description = item.description || t('noDescription');
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';
        }

        // Calcular promedio de calificaciones si existen (antes de generar la imagen para insertar badge)
        const itemRatings = item.ratings || [];
        const avgRating = itemRatings.length > 0 ? (itemRatings.reduce((s, r) => s + (r.rating || r), 0) / itemRatings.length) : 0;
        const roundedAvg = Math.round(avgRating);

        // Badge que se superpone sobre la imagen (si existe)
        let badgeHtml = `<div class="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs font-semibold flex items-center gap-2">`;
        for (let i = 1; i <= 5; i++) {
            badgeHtml += `<i class="fas fa-star ${i <= roundedAvg ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
        }
        badgeHtml += `<span class="text-gray-300">${avgRating > 0 ? avgRating.toFixed(1) : '0.0'}</span>`;
        badgeHtml += `</div>`;

        // Envolver la imagen en un contenedor relativo para mostrar el badge con la calificación
        const imageHTML = item.image
            ? `<div class="relative w-full h-48 overflow-hidden">${badgeHtml}<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">` +
            `</div>`
            : `<div class="relative w-full h-48 bg-gray-700 flex items-center justify-center">` +
            `${badgeHtml}<i class="fas fa-image text-4xl text-gray-500"></i></div>`;

        // Html de calificaciones que se agrega en el pie de la card
        let ratingHtml = '<div class="mt-3 flex items-center">';
        ratingHtml += '<div class="text-sm flex gap-1">';
        for (let i = 1; i <= 5; i++) {
            ratingHtml += `<i class="fas fa-star ${i <= roundedAvg ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
        }
        ratingHtml += '</div>';
        ratingHtml += `<span class="rating-average text-xs text-gray-400 ml-3">${avgRating > 0 ? avgRating.toFixed(1) : '0.0'}/5 (${itemRatings.length})</span>`;
        ratingHtml += '</div>';

        card.innerHTML = `
            ${imageHTML}
            <div class="p-4 flex-grow flex flex-col">
                <h4 class="text-lg font-bold text-white mb-2">${item.name}</h4>
                <p class="text-sm text-gray-400 flex-grow">${description}</p>
            </div>
        `;
        return card;
    }

    function renderProjectList() {
        publicProjectList.innerHTML = '';
        if (allProjects.length === 0) {
            publicProjectList.innerHTML = `<p class="col-span-full text-gray-400 text-lg">No se encontraron proyectos para mostrar.</p>`;
            return;
        }

        initImageSlider(); // Inicializar el slider con las imágenes de todos los proyectos

        allProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'content-card p-4 rounded-lg text-left hover:bg-gray-700 hover:border-indigo-500 border-2 border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center gap-4';

            const imageHtml = project.coverImage
                ? `<img src="${project.coverImage}" alt="Portada de ${project.name}" class="w-16 h-24 object-cover rounded-md flex-shrink-0">`
                : `<div class="w-16 h-24 bg-gray-800 rounded-md flex-shrink-0 flex items-center justify-center"><i class="fas fa-book text-3xl text-gray-500"></i></div>`;

            projectCard.innerHTML = `
                ${imageHtml}
                <div class="flex-grow min-w-0"> <!-- min-w-0 es para que truncate funcione en un contenedor flex -->
                    <h3 class="text-xl font-bold text-white mb-2 truncate">${project.name}</h3>
                    <p class="text-sm text-gray-400">${project.chapters?.length || 0} ${t('chaptersCount')}, ${project.characters?.length || 0} ${t('charactersCount')}</p>
                </div>
            `;
            projectCard.addEventListener('click', () => selectAndRenderProject(project.id));
            publicProjectList.appendChild(projectCard);
        });
        startCommentSlider(); // Iniciar el slider de comentarios
    }

    function selectAndRenderProject(projectId) {
        const project = allProjects.find(p => p.id === projectId);
        if (project) {
            // Mantener referencia al proyecto (datos originales) para calificaciones/comentarios
            currentProject = project;
            // Traducir el proyecto según el idioma actual para la vista
            const translatedProject = translateProject(project);
            currentProjectTranslated = translatedProject;
            projectSelectionScreen.classList.add('hidden');
            renderProject(translatedProject);
        }
    }

    function showProjectSelection() {
        storyContent.classList.add('hidden');
        projectSelectionScreen.classList.remove('hidden');
        document.title = "Xlerion Stories - Proyectos"; // Resetear título

        // FIX: Llamar a renderProjectList para asegurar que las tarjetas de proyecto
        // y los sliders se muestren correctamente cada vez que se vuelve a esta vista.
        renderProjectList();

        // Mostrar slider si tiene contenido
        const imageSliderContainer = document.getElementById('image-slider-container');
        if (imageSliderContainer && imageSliderContainer.querySelector('.slider-image')) {
            imageSliderContainer.classList.remove('hidden');
        }
        const commentSliderContainer = document.getElementById('comment-slider-container');
        if (allComments.length > 0) {
            commentSliderContainer.classList.remove('hidden');
        }
        // Reiniciar y mostrar el slider de comentarios si tiene contenido
        startCommentSlider();
    }

    async function showDetails(type, index) {
        // Usar currentProjectTranslated que es global y está actualizado con las traducciones
        if (!currentProjectTranslated) return;

        // CORRECCIÓN: El 'type' viene como 'characters', 'places', etc. (plural).
        // El objeto del proyecto usa estas mismas claves en plural.
        const item = currentProjectTranslated[type]?.[index];

        if (!item) { console.error(`Item no encontrado para ${type}[${index}]`); return; }

        detailsTitle.textContent = item.name || t('detail');

        let bodyHtml = '';
        bodyHtml += `<div class="prose prose-custom max-w-none">`; // Contenedor para estilos de texto

        if (item.image) {
            bodyHtml += `<img src="${item.image}" alt="${item.name || item.titulo}" class="w-full h-64 object-cover rounded-lg mb-6">`;
        }

        const createDetailSection = (title, content) => {
            if (!content || content.trim() === '') return '';
            return `
                <div class="mb-6">
                    <h4 class="font-bold text-xl mb-2 text-indigo-400">${title}</h4>
                    <div class="text-gray-300 whitespace-pre-wrap">${content.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        };

        bodyHtml += createDetailSection(type === 'chapters' ? t('summary') : t('generalDescription'), item.description);

        if (type === 'characters') {
            let detailsList = '';
            if (item.age) detailsList += `<li><strong>${t('age')}:</strong> ${item.age}</li>`;
            if (item.height) detailsList += `<li><strong>${t('height')}:</strong> ${item.height}</li>`;
            if (item.gender && item.gender !== 'no-especificado') {
                const genderText = t(item.gender) || item.gender.charAt(0).toUpperCase() + item.gender.slice(1);
                detailsList += `<li><strong>${t('gender')}:</strong> ${genderText}</li>`;
            }

            if (detailsList) {
                bodyHtml += `<div class="mb-6"><h4 class="font-bold text-xl mb-2 text-indigo-400">${t('details')}</h4><ul class="list-disc list-inside text-gray-300">${detailsList}</ul></div>`;
            }

            bodyHtml += createDetailSection(t('physicalDescription'), item.physicalDescription);
            bodyHtml += createDetailSection(t('backstory'), item.backstory);
        } else if (type === 'places') {
            if (item.placeType && item.placeType !== 'no-especificado') {
                const placeTypeText = t(item.placeType) || item.placeType.charAt(0).toUpperCase() + item.placeType.slice(1);
                bodyHtml += createDetailSection(t('placeType'), placeTypeText);
            }
            bodyHtml += createDetailSection(t('atmosphere'), item.atmosphere);
            bodyHtml += createDetailSection(t('keyFeatures'), item.keyFeatures);
            bodyHtml += createDetailSection(t('historyLore'), item.lore);
            if (item.mapImage) {
                bodyHtml += `
                    <div class="mt-6">
                        <h4 class="font-bold text-xl mb-2 text-indigo-400">${t('placeMap')}</h4>
                        <img src="${item.mapImage}" alt="Mapa de ${item.name}" class="w-full h-auto object-contain rounded-lg border border-gray-700">
                    </div>
                `;
            }
        } else if (type === 'objects') {
            if (item.objectType && item.objectType !== 'no-especificado') {
                const objectTypeText = t(item.objectType) || item.objectType.charAt(0).toUpperCase() + item.objectType.slice(1);
                bodyHtml += createDetailSection(t('objectType'), objectTypeText);
            }
            bodyHtml += createDetailSection(t('origin'), item.origin);
            bodyHtml += createDetailSection(t('powers'), item.powers);
            bodyHtml += createDetailSection(t('relevance'), item.relevance);
        }

        bodyHtml += `</div>`; // Cierre del contenedor prose

        detailsBody.innerHTML = bodyHtml;
        detailsModal.classList.remove('hidden');
        detailsModal.dataset.type = type;
        detailsModal.dataset.index = index; // Guardar el índice
        // FIX: Generar un ID único y consistente para el ítem.
        const itemId = item.id || `${currentProject.id}-${type}-${index}`;
        detailsModal.dataset.itemId = itemId;

        // --- NUEVO: Renderizar Calificaciones y Comentarios ---
        await renderRatingsAndComments(itemId);
    }

    async function renderRatingsAndComments(itemId) {
        // FIX: Si los contenedores no existen en el HTML, no continuar.
        if (!detailsRatingContainer || !detailsCommentsContainer) return;

        // Obtener el item actual para acceder a sus calificaciones y comentarios locales.
        const item = findItemById(itemId);
        if (!item) return;

        // --- Calificaciones --- (Ahora lee de la data local que viene de data.json)
        let userRating = 0;
        if (currentUser) {
            const userRatingObj = item.ratings?.find(r => r.userEmail === currentUser);
            if (userRatingObj) {
                userRating = userRatingObj.rating;
            }
        }

        const itemRatings = item.ratings || [];
        const averageRating = itemRatings.length > 0 ? (itemRatings.reduce((sum, r) => sum + r.rating, 0) / itemRatings.length) : 0;

        const ratingStarsContainer = document.getElementById('average-stars');
        if (ratingStarsContainer) {
            ratingStarsContainer.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = `fas fa-star ${i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`;
                ratingStarsContainer.appendChild(star);
            }
            const ratingValueEl = detailsRatingContainer.querySelector('.rating-value');
            const votesText = itemRatings.length === 1 ? t('vote') : t('votes');
            if (ratingValueEl) ratingValueEl.textContent = `${averageRating.toFixed(1)}/5 (${itemRatings.length} ${votesText})`;
        }

        // Lógica para que el usuario califique
        const userStarsContainer = document.getElementById('user-stars');
        if (userStarsContainer) {
            userStarsContainer.innerHTML = ''; // Limpiar estrellas anteriores
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = `fas fa-star cursor-pointer ${i <= userRating ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`;
                star.dataset.value = i; // Asignar el valor de la estrella
                star.setAttribute('title', `Calificar con ${i} estrella${i > 1 ? 's' : ''}`);

                // Función para manejar el clic o toque
                const handleRatingClick = async (event) => {
                    // Prevenir que se disparen ambos eventos (click y touchend)
                    event.preventDefault();
                    event.stopPropagation();

                    const newRating = parseInt(star.dataset.value, 10);
                    const success = await saveRating(itemId, newRating);
                    if (success) {
                        await renderRatingsAndComments(itemId); // Re-renderizar para actualizar
                    }
                };

                // Añadir listeners para click y touch, solo si el usuario no ha calificado aún.
                if (userRating === 0) {
                    star.addEventListener('click', handleRatingClick);
                    star.addEventListener('touchend', handleRatingClick);
                }
                userStarsContainer.appendChild(star);
            }
        }

        const userRatingSection = document.getElementById('user-rating-section');
        const userRatedMessage = document.getElementById('user-rated-message');
        if (currentUser) {
            // FIX: Reiniciar el estado de "ya calificado" antes de evaluar el ítem actual.
            // Esto asegura que si el usuario no ha calificado ESTE ítem, pueda hacerlo,
            // incluso si ya ha calificado otros.
            if (userStarsContainer) userStarsContainer.classList.remove('opacity-50', 'pointer-events-none');
            if (userRatedMessage) userRatedMessage.classList.add('hidden');


            if (userRatingSection) userRatingSection.classList.remove('hidden');
            // NUEVO: Si ya ha calificado, mostrar un mensaje y deshabilitar las estrellas.
            if (userRating > 0 && userStarsContainer && userRatedMessage) {
                userStarsContainer.classList.add('opacity-50', 'pointer-events-none');
                userRatedMessage.textContent = t('alreadyRated');
                userRatedMessage.classList.remove('hidden');
            }
        } else {
            if (userRatingSection) userRatingSection.classList.add('hidden');
        }

        // --- Comentarios ---
        const allCommentsForProject = currentProject.comments || [];
        const filteredComments = allCommentsForProject.filter(c => c.itemId === itemId).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        const userHasCommented = currentUser ? filteredComments.some(c => c.userEmail === currentUser && c.itemId === itemId) : false;

        commentsList.innerHTML = ''; // Limpiar la lista de comentarios
        if (filteredComments.length > 0) {
            filteredComments.forEach(comment => {
                // Buscar si este usuario también calificó el ítem
                const userRatingForThisCommenter = item.ratings?.find(r => r.userEmail === comment.userEmail);
                let ratingDisplayHtml = '';

                if (userRatingForThisCommenter) {
                    let starsHtml = '';
                    for (let i = 1; i <= 5; i++) {
                        starsHtml += `<i class="fas fa-star text-xs ${i <= userRatingForThisCommenter.rating ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
                    }
                    // Contenedor para las estrellas con un pequeño margen
                    ratingDisplayHtml = `<div class="flex-shrink-0 ml-4">${starsHtml}</div>`;
                }

                const li = document.createElement('li');
                li.className = 'bg-gray-800 p-3 rounded-lg';
                li.innerHTML = `
                    <div class="flex justify-between items-center">
                        <p class="text-gray-300 flex-grow">${comment.message}</p>
                        ${ratingDisplayHtml}
                    </div>
                    <p class="text-xs text-gray-500 mt-1 text-right">- ${comment.userEmail} (${new Date(comment.timestamp).toLocaleString()})</p>
                `;
                commentsList.appendChild(li);
            });
        } else {
            commentsList.innerHTML = `<p class="text-gray-500">${t('noComments')}</p>`;
        }

        const commentTextarea = document.getElementById('comment-textarea');
        const commentSubmitBtn = commentForm.querySelector('button[type="submit"]');
        // NUEVO: Lógica mejorada para mostrar/ocultar el formulario de comentario.
        if (currentUser && !userHasCommented && commentTextarea && commentSubmitBtn) {
            commentForm.classList.remove('hidden');
            commentTextarea.disabled = false;
            commentTextarea.placeholder = t('commentPlaceholder');
            commentSubmitBtn.disabled = false;
            commentTextarea.value = '';
        } else if (currentUser && userHasCommented && commentTextarea && commentSubmitBtn) {
            commentForm.classList.remove('hidden');
            commentTextarea.placeholder = t('alreadyCommented');
            commentTextarea.disabled = true;
            commentSubmitBtn.disabled = true;
            commentTextarea.value = '';
        } else {
            commentForm.classList.add('hidden');
        }
    }

    // --- Lógica para el modal de contenido estático (Acerca de, Contacto, etc.) ---

    const staticContentData = {
        'about': {
            es: {
                title: 'Acerca de Xlerion Stories',
                content: `
                    <p><strong>Xlerion Story Creator</strong> es una plataforma innovadora diseñada para dar vida a tus mundos e historias interactivas. Nuestra misión es proporcionar a escritores, diseñadores de juegos y creadores de contenido las herramientas necesarias para construir narrativas complejas y compartirlas con el mundo.</p>
                    <p>Desde la creación de personajes detallados y lugares evocadores hasta la construcción de tramas intrincadas con nuestro mapa mental, Xlerion te acompaña en cada paso del proceso creativo.</p>
                    <p>Este proyecto nació de la pasión por contar historias y la creencia de que todos tienen un universo esperando ser descubierto. ¡Gracias por ser parte de nuestra comunidad!</p>
                `
            },
            en: {
                title: 'About Xlerion Stories',
                content: `
                    <p><strong>Xlerion Story Creator</strong> is an innovative platform designed to bring your interactive worlds and stories to life. Our mission is to provide writers, game designers, and content creators with the necessary tools to build complex narratives and share them with the world.</p>
                    <p>From creating detailed characters and evocative places to building intricate plots with our mind map, Xlerion accompanies you in every step of the creative process.</p>
                    <p>This project was born from a passion for storytelling and the belief that everyone has a universe waiting to be discovered. Thank you for being part of our community!</p>
                `
            }
        },
        'contact': {
            es: {
                title: 'Contacto',
                content: `
                    <p>¿Tienes preguntas, sugerencias o simplemente quieres saludar? ¡Nos encantaría saber de ti! Puedes encontrarnos en nuestras redes sociales:</p>
                    <ul>
                        <li><strong>Twitter:</strong> <a href="https://twitter.com/XlerionUltimate" target="_blank" rel="noopener noreferrer">@XlerionUltimate</a></li>
                        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/company/xlerion" target="_blank" rel="noopener noreferrer">Xlerion en LinkedIn</a></li>
                        <li><strong>Patreon:</strong> <a href="https://www.patreon.com/c/xlerion" target="_blank" rel="noopener noreferrer">Apóyanos en Patreon</a></li>
                    </ul>
                    <p>Para asuntos más formales, puedes contactarnos a través de nuestro correo electrónico: <a href="mailto:contactus@xlerion.com">contactus@xlerion.com</a>.</p>
                `
            },
            en: {
                title: 'Contact',
                content: `
                    <p>Have questions, suggestions, or just want to say hello? We'd love to hear from you! You can find us on our social networks:</p>
                    <ul>
                        <li><strong>Twitter:</strong> <a href="https://twitter.com/XlerionUltimate" target="_blank" rel="noopener noreferrer">@XlerionUltimate</a></li>
                        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/company/xlerion" target="_blank" rel="noopener noreferrer">Xlerion on LinkedIn</a></li>
                        <li><strong>Patreon:</strong> <a href="https://www.patreon.com/c/xlerion" target="_blank" rel="noopener noreferrer">Support us on Patreon</a></li>
                    </ul>
                    <p>For more formal matters, you can contact us via email: <a href="mailto:contactus@xlerion.com">contactus@xlerion.com</a>.</p>
                `
            }
        },
        'terms': {
            es: {
                title: 'Términos de Servicio',
                content: `
                    <p>Bienvenido a Xlerion Story Creator. Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones:</p>
                    <ol>
                        <li><strong>Uso del Servicio:</strong> Te comprometes a utilizar la plataforma de manera responsable y a no subir contenido ilegal, ofensivo o que infrinja derechos de autor.</li>
                        <li><strong>Propiedad del Contenido:</strong> Todo el contenido que creas en la plataforma (proyectos, personajes, historias) es de tu propiedad. Nos otorgas una licencia para mostrarlo en la vista pública si decides hacerlo.</li>
                        <li><strong>Disponibilidad del Servicio:</strong> Nos esforzamos por mantener la plataforma disponible, pero no garantizamos un servicio ininterrumpido. Podemos realizar mantenimientos que afecten temporalmente el acceso.</li>
                        <li><strong>Limitación de Responsabilidad:</strong> No somos responsables por la pérdida de datos. Te recomendamos realizar exportaciones periódicas de tus proyectos como respaldo.</li>
                    </ol>
                    <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
                `
            },
            en: {
                title: 'Terms of Service',
                content: `
                    <p>Welcome to Xlerion Story Creator. By using our services, you agree to the following terms and conditions:</p>
                    <ol>
                        <li><strong>Service Usage:</strong> You commit to using the platform responsibly and not to upload illegal, offensive content, or content that infringes copyright.</li>
                        <li><strong>Content Ownership:</strong> All content you create on the platform (projects, characters, stories) is your property. You grant us a license to display it in the public view if you choose to do so.</li>
                        <li><strong>Service Availability:</strong> We strive to keep the platform available, but we do not guarantee uninterrupted service. We may perform maintenance that temporarily affects access.</li>
                        <li><strong>Limitation of Liability:</strong> We are not responsible for data loss. We recommend making periodic exports of your projects as a backup.</li>
                    </ol>
                    <p>We reserve the right to modify these terms at any time.</p>
                `
            }
        },
        'privacy': {
            es: {
                title: 'Política de Privacidad',
                content: `
                    <p>Tu privacidad es importante para nosotros. Esta política explica qué datos recopilamos y cómo los usamos:</p>
                    <ul>
                        <li><strong>Datos de la Cuenta:</strong> Para calificar y comentar, te pedimos una dirección de correo electrónico. Este correo se utiliza únicamente para identificarte y no se comparte con terceros.</li>
                        <li><strong>Datos de los Proyectos:</strong> Tus proyectos se almacenan localmente en tu navegador usando IndexedDB. No tenemos acceso a tus proyectos privados. Solo el contenido que marcas como público es visible para otros.</li>
                        <li><strong>Cookies y Almacenamiento Local:</strong> Usamos el almacenamiento local del navegador para guardar tu sesión (correo electrónico) y tus preferencias. No utilizamos cookies de seguimiento de terceros.</li>
                    </ul>
                    <p>Al utilizar la plataforma, aceptas la recopilación y el uso de información de acuerdo con esta política.</p>
                `
            },
            en: {
                title: 'Privacy Policy',
                content: `
                    <p>Your privacy is important to us. This policy explains what data we collect and how we use it:</p>
                    <ul>
                        <li><strong>Account Data:</strong> To rate and comment, we ask for an email address. This email is used solely to identify you and is not shared with third parties.</li>
                        <li><strong>Project Data:</strong> Your projects are stored locally in your browser using IndexedDB. We do not have access to your private projects. Only content you mark as public is visible to others.</li>
                        <li><strong>Cookies and Local Storage:</strong> We use the browser's local storage to save your session (email) and your preferences. We do not use third-party tracking cookies.</li>
                    </ul>
                    <p>By using the platform, you accept the collection and use of information in accordance with this policy.</p>
                `
            }
        }
    };

    function showStaticContentModal(type) {
        const content = staticContentData[type]?.[currentLanguage] || staticContentData[type]?.['es'];
        if (!content || !staticContentModal) return;
        staticContentTitle.textContent = content.title;
        staticContentBody.innerHTML = content.content;
        staticContentModal.classList.remove('hidden');
    }

    // --- Lógica del Slider de Imágenes en la pantalla de selección ---
    function initImageSlider() {
        const sliderContainer = document.getElementById('image-slider-container');
        const slider = document.getElementById('image-slider');
        let allImages = [];

        // Recolectar todas las imágenes de todos los proyectos
        allProjects.forEach(project => {
            if (project.coverImage) {
                allImages.push(project.coverImage);
            }
            ['chapters', 'characters', 'places', 'objects'].forEach(type => {
                if (project[type]) {
                    project[type].forEach(item => {
                        if (item.image) allImages.push(item.image);
                        // Para lugares, también incluimos la imagen del mapa si existe
                        if (type === 'places' && item.mapImage) allImages.push(item.mapImage);
                    });
                }
            });
        });

        if (allImages.length < 2) {
            sliderContainer.classList.add('hidden');
            return;
        }

        // Mezclar las imágenes
        allImages.sort(() => 0.5 - Math.random());
        // Limitar a un número razonable para el slider
        const sliderImages = allImages.slice(0, 15);

        slider.innerHTML = '';
        sliderImages.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'slider-image';
            if (index === 0) {
                img.classList.add('active');
            }
            slider.appendChild(img);
        });

        sliderContainer.classList.remove('hidden');

        let currentSlide = 0;
        setInterval(() => {
            const slides = slider.querySelectorAll('.slider-image');
            if (slides.length === 0) return;
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Cambia cada 5 segundos
    }

    // --- Lógica del Slider de Comentarios en la pantalla de selección ---

    function showRandomComment() {
        if (allComments.length === 0) return;

        const commentSlider = document.getElementById('comment-slider');
        if (!commentSlider) return;

        // Elige un comentario al azar
        const randomIndex = Math.floor(Math.random() * allComments.length);
        const comment = allComments[randomIndex];

        // Crea el nuevo elemento de comentario
        const newSlide = document.createElement('div');
        newSlide.className = 'comment-slide flex flex-col justify-center';
        newSlide.innerHTML = `
            <p class="text-xl italic text-gray-200">"${comment.message}"</p>
            <p class="text-right text-sm text-gray-400 mt-2">- ${comment.author || 'Anónimo'} en <span class="font-semibold text-indigo-400">${comment.projectName}</span></p>
        `;

        // Gestiona la transición de fundido
        const oldSlide = commentSlider.querySelector('.comment-slide.active');
        if (oldSlide) {
            oldSlide.classList.remove('active');
            // Elimina el slide antiguo después de que la transición termine para no acumular elementos
            setTimeout(() => {
                if (oldSlide.parentElement === commentSlider) {
                    commentSlider.removeChild(oldSlide);
                }
            }, 700); // Debe coincidir con la duración de la transición en CSS
        }

        commentSlider.appendChild(newSlide);
        // Forzar un 'reflow' del navegador para que la transición se aplique correctamente al nuevo elemento
        void newSlide.offsetWidth;
        newSlide.classList.add('active');
    }

    function startCommentSlider() {
        const container = document.getElementById('comment-slider-container');
        if (!container) return;

        if (allComments.length > 0) {
            container.classList.remove('hidden');
            if (commentSliderInterval) clearInterval(commentSliderInterval);
            showRandomComment();
            commentSliderInterval = setInterval(showRandomComment, 7000);
        } else {
            container.classList.add('hidden');
        }
    }

    // --- Lógica del Slider de Comentarios en la pantalla de selección ---

    function showRandomComment() {
        if (allComments.length === 0) return;

        const commentSlider = document.getElementById('comment-slider');
        if (!commentSlider) return;

        // Elige un comentario al azar
        const randomIndex = Math.floor(Math.random() * allComments.length);
        const comment = allComments[randomIndex];

        // Crea el nuevo elemento de comentario
        const newSlide = document.createElement('div');
        newSlide.className = 'comment-slide flex flex-col justify-center';
        newSlide.innerHTML = `
            <p class="text-xl italic text-gray-200">"${comment.message}"</p>
            <p class="text-right text-sm text-gray-400 mt-2">- ${comment.author || 'Anónimo'} en <span class="font-semibold text-indigo-400">${comment.projectName}</span></p>
        `;

        // Gestiona la transición de fundido
        const oldSlide = commentSlider.querySelector('.comment-slide.active');
        if (oldSlide) {
            oldSlide.classList.remove('active');
            // Elimina el slide antiguo después de que la transición termine para no acumular elementos
            setTimeout(() => {
                if (oldSlide.parentElement === commentSlider) {
                    commentSlider.removeChild(oldSlide);
                }
            }, 700); // Debe coincidir con la duración de la transición en CSS
        }

        commentSlider.appendChild(newSlide);
        // Forzar un 'reflow' del navegador para que la transición se aplique correctamente al nuevo elemento
        void newSlide.offsetWidth;
        newSlide.classList.add('active');
    }

    function startCommentSlider() {
        const container = document.getElementById('comment-slider-container');
        if (!container) return;

        if (allComments.length > 0) {
            container.classList.remove('hidden');
            if (commentSliderInterval) clearInterval(commentSliderInterval);
            showRandomComment();
            commentSliderInterval = setInterval(showRandomComment, 7000);
        } else {
            container.classList.add('hidden');
        }
    }

    // --- Lógica del Mapa Mental Público ---

    function initPublicMindMap(project) {
        const mindMapContainer = document.getElementById('publicMindMapContainer');
        if (!project || !project.mindMap || typeof vis === 'undefined') {
            mindMapContainer.innerHTML = `<p class="p-4 text-gray-500">${t('noMindMapData')}</p>`;
            return;
        }

        if (publicMindMapNetwork) {
            publicMindMapNetwork.destroy();
        }

        const nodes = new vis.DataSet(project.mindMap.nodes);
        const edges = new vis.DataSet(project.mindMap.edges);
        const data = { nodes, edges };

        // Opciones de visualización para el mapa público
        const options = {
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true,
                tooltipDelay: 200,
            },
            physics: {
                enabled: true,
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -3000,
                    centralGravity: 0.1,
                    springLength: 120,
                }
            },
            nodes: {
                shape: 'box',
                margin: 10,
                font: { color: '#e2e8f0' },
                color: {
                    border: '#00e9fa',
                    background: '#1F2937',
                    highlight: { border: '#00d4e0', background: '#00b8c4' },
                    hover: {
                        border: '#00e9fa'
                    }
                },
            },
            edges: {
                color: { color: '#4B5563', highlight: '#60A5FA' },
                arrows: 'to'
            }
        };

        publicMindMapNetwork = new vis.Network(mindMapContainer, data, options);

        publicMindMapNetwork.on('click', function (params) {
            // Si se hace clic en un nodo, intenta mostrar sus detalles
            if (params.nodes.length > 0) {
                const node = data.nodes.get(params.nodes[0]);
                if (node && node.refId) {
                    const [type, ...nameParts] = node.refId.split('-');
                    const name = nameParts.join('-');
                    const itemIndex = currentProject[type]?.findIndex(item => item.name === name);
                    if (itemIndex !== -1) showDetails(type, itemIndex);
                }
            }
        });
    }

    // --- Inicialización ---
    async function init() {
        await initDB(); // Asegurarse de que la BD esté lista primero.
        checkUserSession(); // Comprobar la sesión del usuario DESPUÉS de inicializar la BD.

        // Ocultar el loader y mostrar el contenido principal
        // Se hace al principio para que el usuario vea algo mientras se procesan los datos.
        loadingScreen.classList.add('hidden');
        try {
            // --- LÓGICA DE CARGA DE DATOS SIMPLIFICADA ---
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('projectId');

            // Siempre cargamos desde data.json, que debe contener todos los proyectos,
            // calificaciones y comentarios.
            try {
                const response = await fetch('data.json', { cache: 'no-store' });
                if (response.ok) {
                    const text = await response.text();
                    if (text) {
                        allProjects = JSON.parse(text);
                        // Traducir todos los proyectos según el idioma actual
                        allProjects = allProjects.map(project => translateProject(project));
                    } else {
                        allProjects = []; // El archivo está vacío
                    }
                } else {
                    throw new Error('No se pudo cargar data.json');
                }
            } catch (e) {
                console.error('Error al cargar data.json:', e);
                projectSelectionScreen.innerHTML = `<h2 class="text-2xl text-yellow-400">Error de Carga</h2><p class="text-gray-400 mt-2">No se pudo encontrar el archivo de datos principal (data.json).</p>`;
                projectSelectionScreen.classList.remove('hidden');
                return;
            }

            // Si se especifica un projectId en la URL, mostramos ese proyecto directamente.
            if (projectId) {
                const projectToShow = allProjects.find(p => p.id === projectId);
                if (projectToShow) {
                    const translatedProject = translateProject(projectToShow);
                    currentProjectTranslated = translatedProject;
                    renderProject(translatedProject);
                    return; // Salir para no mostrar la lista de proyectos.
                } else {
                    console.warn(`Proyecto con ID "${projectId}" no encontrado. Mostrando lista de proyectos.`);
                }
            }

            if (window.allProjectsData) { // Modo publicado (archivo HTML autónomo con datos incrustados)
                allProjects = window.allProjectsData;
                // Traducir todos los proyectos según el idioma actual
                allProjects = allProjects.map(project => translateProject(project));
            }

            if (allProjects && allProjects.length > 0) {
                // Si solo hay un proyecto (como en el caso de la vista pública), muéstralo directamente.
                // También aplica si solo hay un proyecto en data.json
                if (allProjects.length === 1 && !projectId) {
                    selectAndRenderProject(allProjects[0].id);
                    return; // Salimos para no mostrar la lista de proyectos
                }

                // Poblar el array de comentarios para el slider
                allComments = [];
                allProjects.forEach(project => {
                    if (project.comments && project.comments.length > 0) {
                        project.comments.forEach(comment => {
                            allComments.push({
                                message: comment.message,
                                author: comment.userEmail,
                                projectName: project.name
                            });
                        });
                    }
                });

                renderProjectList();
                projectSelectionScreen.classList.remove('hidden');
            } else {
                projectSelectionScreen.innerHTML = `<h2 class="text-2xl text-yellow-400">No se encontraron datos de proyectos.</h2><p class="text-gray-400 mt-2">No se pudo cargar la información del proyecto. Vuelve a la aplicación principal e inténtalo de nuevo.</p>`;
            }

        } catch (error) {
            console.error('Error al cargar los proyectos:', error);
            storyContent.innerHTML = `
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-red-400">Error al Cargar los Datos</h1>
                    <p class="mt-4 text-lg">No se pudieron cargar los proyectos. Revisa la consola para más detalles.</p>
                </div>
            `;
            loadingScreen.classList.add('hidden');
            storyContent.classList.remove('hidden');
        }
    }

    // --- NUEVO: Método de Cierre de Modales Centralizado y Robusto ---
    function handleModalClicks(e) {
        // Cierra el modal de detalles si se hace clic en el botón de cierre o en el fondo (backdrop)
        if (detailsModal && !detailsModal.classList.contains('hidden')) {
            // Si se hace clic en el botón de cierre
            if (e.target.id === 'publicCloseDetailsModal') {
                detailsModal.classList.add('hidden');
                return;
            }
            // Si se hace clic en el backdrop (fondo oscuro), pero NO en el contenido del modal
            if (e.target === detailsModal && !e.target.closest('#publicDetailsModalContent')) {
                detailsModal.classList.add('hidden');
                return;
            }
        }
        // Cierra el modal de login si se hace clic en el botón de cierre o en el fondo
        if (loginModal && !loginModal.classList.contains('hidden')) {
            if (e.target.id === 'closeLoginModal') {
                loginModal.classList.add('hidden');
                return;
            }
            if (e.target === loginModal) {
                loginModal.classList.add('hidden');
                return;
            }
        }
        // Cierra el modal de contenido estático
        if (staticContentModal && !staticContentModal.classList.contains('hidden')) {
            if (e.target.id === 'btnCloseStaticContent') {
                staticContentModal.classList.add('hidden');
                return;
            }
            if (e.target === staticContentModal) {
                staticContentModal.classList.add('hidden');
                return;
            }
        }
    }

    // --- Asignación de Eventos Globales ---
    function setupGlobalEventListeners() {
        // Asignar el manejador de clics para los modales a todo el documento
        document.addEventListener('click', handleModalClicks);

        // Prevenir que clics dentro del contenido del modal lo cierren
        const modalContents = [
            document.getElementById('publicDetailsModalContent'),
            document.querySelector('#staticContentModal > div'),
            document.querySelector('#loginModal > div')
        ];

        modalContents.forEach(modalContent => {
            if (modalContent) {
                modalContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });

        // Listener para cambios de idioma
        window.addEventListener('languageChanged', (event) => {
            const language = event.detail.language;

            // Re-renderizar el contenido si hay un proyecto visible
            if (currentProjectTranslated && !storyContent.classList.contains('hidden')) {
                renderProject(currentProjectTranslated);

                // Si el modal de detalles está abierto, refrescarlo también
                const detailsModal = document.getElementById('publicDetailsModal');
                if (detailsModal && !detailsModal.classList.contains('hidden')) {
                    const itemId = detailsModal.dataset.itemId;
                    if (itemId) {
                        const itemParts = itemId.split('-');
                        const type = itemParts[0];
                        const index = parseInt(itemParts[1]);
                        if (currentProjectTranslated[type] && currentProjectTranslated[type][index]) {
                            showDetails(type, index);
                        }
                    }
                }
            }
        });

        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                const newLang = currentLanguage === 'es' ? 'en' : 'es';
                changeLanguage(newLang);
            });
        }

        // Asignar eventos que siempre deben funcionar
        if (loginBtn) loginBtn.addEventListener('click', () => { if (loginModal) loginModal.classList.remove('hidden'); });
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (backToProjectsBtn) backToProjectsBtn.addEventListener('click', showProjectSelection);

        // Cerrar modal de detalles mediante botón (evitar dependencia de bubbling)
        const publicCloseBtn = document.getElementById('publicCloseDetailsModal');
        if (publicCloseBtn) {
            publicCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (detailsModal) detailsModal.classList.add('hidden');
            });
        }

        // Listeners para los botones móviles de login/logout
        const loginBtnMobile = document.getElementById('login-btn-mobile');
        const logoutBtnMobile = document.getElementById('logout-btn-mobile');
        if (loginBtnMobile) loginBtnMobile.addEventListener('click', () => { if (loginModal) loginModal.classList.remove('hidden'); });
        if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', handleLogout);

        // Evento para el formulario de comentarios (se asigna una sola vez)
        if (commentForm) {
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const itemId = detailsModal.dataset.itemId;
                const textarea = commentForm.querySelector('textarea');
                if (!itemId || !textarea) return;
                const success = await saveComment(itemId, textarea.value);
                if (success) {
                    textarea.value = '';
                    await renderRatingsAndComments(itemId);
                }
            });
        }

        // Asignar eventos a los enlaces del header y footer
        const staticLinks = [
            { id: 'nav-about-link', type: 'about' },
            { id: 'nav-contact-link', type: 'contact' },
            { id: 'footer-about-link', type: 'about' },
            { id: 'footer-contact-link', type: 'contact' },
            { id: 'footer-terms-link', type: 'terms' },
            { id: 'footer-privacy-link', type: 'privacy' }
        ];

        staticLinks.forEach(linkInfo => {
            const el = document.getElementById(linkInfo.id);
            if (el) {
                el.addEventListener('click', (e) => { e.preventDefault(); showStaticContentModal(linkInfo.type); });
            }
        });

        // Links de navegación del Header y Footer para volver a la lista de proyectos
        const projectNavLinks = [
            document.getElementById('logo-link'),
            document.getElementById('nav-projects-link'),
            document.getElementById('footer-logo-link'),
            document.getElementById('footer-projects-link')
        ];

        projectNavLinks.forEach(link => {
            if (link) link.addEventListener('click', (e) => { e.preventDefault(); showProjectSelection(); });
        });

        // Enlaces del menú móvil que replican el header
        const mobileProjectsLink = document.getElementById('mobile-projects-link');
        const mobileAboutLink = document.getElementById('mobile-about-link');
        const mobileContactLink = document.getElementById('mobile-contact-link');
        if (mobileProjectsLink) mobileProjectsLink.addEventListener('click', (e) => { e.preventDefault(); const _m = document.getElementById('sections-menu'); if (_m) _m.classList.add('hidden'); showProjectSelection(); });
        if (mobileAboutLink) mobileAboutLink.addEventListener('click', (e) => { e.preventDefault(); const _m = document.getElementById('sections-menu'); if (_m) _m.classList.add('hidden'); showStaticContentModal('about'); });
        if (mobileContactLink) mobileContactLink.addEventListener('click', (e) => { e.preventDefault(); const _m = document.getElementById('sections-menu'); if (_m) _m.classList.add('hidden'); showStaticContentModal('contact'); });

        // Año del footer
        const footerYear = document.getElementById('footer-year');
        if (footerYear) footerYear.textContent = new Date().getFullYear();

        // ===== PANEL DE GESTIÓN DE TRADUCCIONES =====
        // Atajos de teclado para abrir panel (Ctrl + Shift + T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                openTranslationManager();
            }
        });

        // Abrir modal de traducciones
        function openTranslationManager() {
            const modal = document.getElementById('translationManagerModal');
            if (!modal) return;
            modal.classList.remove('hidden');
            populateMissingTranslations();
        }

        // Cerrar modal de traducciones
        const closeTranslationModal = document.getElementById('closeTranslationModal');
        if (closeTranslationModal) {
            closeTranslationModal.addEventListener('click', () => {
                document.getElementById('translationManagerModal').classList.add('hidden');
            });
        }

        // Cerrar modal al hacer clic en el fondo
        const translationManagerModal = document.getElementById('translationManagerModal');
        if (translationManagerModal) {
            translationManagerModal.addEventListener('click', (e) => {
                if (e.target === translationManagerModal) {
                    translationManagerModal.classList.add('hidden');
                }
            });
        }

        // Función para llenar la lista de traducciones faltantes
        function populateMissingTranslations() {
            const list = document.getElementById('missingTranslationsList');
            if (!list) return;

            const missing = window.missingTranslations || [];
            if (missing.length === 0) {
                list.innerHTML = '<p class="text-green-400 text-sm">✓ Todos los textos tienen traducción</p>';
                return;
            }

            list.innerHTML = missing.map((item, idx) => `
                <div class="bg-white/5 border border-white/10 rounded p-3 space-y-2">
                    <div class="flex items-start justify-between">
                        <p class="text-xs text-gray-400">Falta traducción a ${item.lang.toUpperCase()}</p>
                        <button class="add-from-list-btn text-[#00e9fa] hover:text-[#00b8c4] transition-colors" data-index="${idx}">
                            <i class="fas fa-copy text-sm"></i>
                        </button>
                    </div>
                    <p class="text-white text-sm break-words">"${item.text.substring(0, 150)}${item.text.length > 150 ? '...' : ''}"</p>
                </div>
            `).join('');

            // Event listeners para botones "copiar a formulario"
            list.querySelectorAll('.add-from-list-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.dataset.index);
                    const item = missing[idx];
                    if (item) {
                        document.getElementById('translationOriginal').value = item.text;
                        document.getElementById('translationTranslated').value = '';
                        document.getElementById('translationTranslated').focus();
                    }
                });
            });
        }

        // Guardar nueva traducción
        const addTranslationBtn = document.getElementById('addTranslationBtn');
        if (addTranslationBtn) {
            addTranslationBtn.addEventListener('click', () => {
                const original = document.getElementById('translationOriginal').value.trim();
                const translated = document.getElementById('translationTranslated').value.trim();

                if (!original || !translated) {
                    alert('Ambos campos son requeridos');
                    return;
                }

                saveTranslation(original, translated, 'en');
                alert('✓ Traducción guardada correctamente');

                // Limpiar formulario
                document.getElementById('translationOriginal').value = '';
                document.getElementById('translationTranslated').value = '';

                // Actualizar lista
                populateMissingTranslations();

                // Si el contenido está siendo mostrado, re-renderizar
                if (currentProjectTranslated) {
                    renderProject(currentProjectTranslated);
                }
            });
        }

        // Exportar traducciones faltantes como JSON
        const exportTranslationsBtn = document.getElementById('exportTranslationsBtn');
        if (exportTranslationsBtn) {
            exportTranslationsBtn.addEventListener('click', () => {
                const missing = window.missingTranslations || [];
                if (missing.length === 0) {
                    alert('No hay traducciones faltantes');
                    return;
                }

                const json = JSON.stringify(
                    missing.reduce((acc, item) => {
                        acc[item.text] = '[TRADUCCIÓN PENDIENTE]';
                        return acc;
                    }, {}),
                    null,
                    2
                );

                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `traducciones-pendientes-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                console.log('[i18n] Archivo exportado:', json);
            });
        }

        // Limpiar caché de traducciones
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de que desea limpiar el caché de traducciones?')) {
                    translationCache.clear();
                    window.missingTranslations = [];
                    alert('✓ Caché limpiado');
                    populateMissingTranslations();
                }
            });
        }

        // Exponer funciones globales para acceso rápido
        window.openTranslationManager = openTranslationManager;
    }

    // Exponer funciones globales para interoperabilidad con el header
    window.showLoginModal = function () {
        if (loginModal) loginModal.classList.remove('hidden');
    };
    window.logout = function () {
        handleLogout();
    };

    init();
    setupGlobalEventListeners(); // Configurar los listeners globales después de init
    setupMobileMenu(); // Configurar el menú móvil de forma centralizada
    changeLanguage(currentLanguage); // Aplicar idioma guardado o predeterminado
});
