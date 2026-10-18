// --- CONFIGURACIÓN DE AUTENTICACIÓN ---
// Este archivo debe estar FUERA del repositorio público
// Añádelo a .gitignore

const AUTH_CONFIG = {
    // Hash SHA-256 de la contraseña (no la contraseña en texto plano)
    // Genera tu hash en: https://emn178.github.io/online-tools/sha256.html
    // Contraseña: "TotalDarkness2026!" 
    // Hash SHA-256: 5e482ca2d70a5fd8ed36978f47ec378398d99dd70ff5e1a1f002ee83a6763514
    passwordHash: "5e482ca2d70a5fd8ed36978f47ec378398d99dd70ff5e1a1f002ee83a6763514",
    adminEmail: "admin@xlerion.com",

    // Token de sesión (cambia esto regularmente)
    sessionSecret: "xlerion_secret_key_" + new Date().getTime()
};

// Exportar globalmente para que app.js pueda acceder
const ADMIN_PASSWORD_HASH = AUTH_CONFIG.passwordHash;
const ADMIN_EMAIL = AUTH_CONFIG.adminEmail;

// Función para generar hash SHA-256
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AUTH_CONFIG;
}
