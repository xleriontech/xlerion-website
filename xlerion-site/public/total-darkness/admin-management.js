// Gestión de Administradores con Backend
// Sistema de administración multi-usuario para Total Darkness

(function () {
    'use strict';

    // API URL - usa el servidor PHP en puerto 8080
    const API_URL = 'http://localhost:8080/total-darkness/api/auth.php';

    // Referencias a elementos del DOM
    let adminModal, tabListAdmins, tabCreateAdmin, panelListAdmins, panelCreateAdmin;
    let adminsListContainer, createAdminForm, adminPanelButton;
    let btnCloseAdminModal, btnCancelCreateAdmin, btnRefreshAdmins;
    let createAdminError, createAdminSuccess;

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', initAdminManagement);

    function initAdminManagement() {
        // Obtener referencias
        adminModal = document.getElementById('adminManagementModal');
        tabListAdmins = document.getElementById('tab-list-admins');
        tabCreateAdmin = document.getElementById('tab-create-admin');
        panelListAdmins = document.getElementById('panel-list-admins');
        panelCreateAdmin = document.getElementById('panel-create-admin');
        adminsListContainer = document.getElementById('admins-list-container');
        createAdminForm = document.getElementById('create-admin-form');
        adminPanelButton = document.getElementById('admin-panel-button');
        btnCloseAdminModal = document.getElementById('btn-close-admin-modal');
        btnCancelCreateAdmin = document.getElementById('btn-cancel-create-admin');
        btnRefreshAdmins = document.getElementById('btn-refresh-admins');
        createAdminError = document.getElementById('create-admin-error');
        createAdminSuccess = document.getElementById('create-admin-success');

        if (!adminModal) return; // No está en la página correcta

        // Event Listeners
        adminPanelButton?.addEventListener('click', openAdminModal);
        btnCloseAdminModal?.addEventListener('click', closeAdminModal);
        btnCancelCreateAdmin?.addEventListener('click', () => switchTab('list'));
        btnRefreshAdmins?.addEventListener('click', loadAdminsList);

        tabListAdmins?.addEventListener('click', () => switchTab('list'));
        tabCreateAdmin?.addEventListener('click', () => switchTab('create'));

        createAdminForm?.addEventListener('submit', handleCreateAdmin);

        // Cerrar modal al hacer clic fuera
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) closeAdminModal();
        });

        // Auto-llenar email actual
        const currentUserEmail = getCurrentUserEmail();
        if (currentUserEmail) {
            const currentEmailInput = document.getElementById('current-admin-email');
            if (currentEmailInput) currentEmailInput.value = currentUserEmail;
        }
    }

    function openAdminModal() {
        adminModal.style.display = 'flex';
        switchTab('list');
        loadAdminsList();
    }

    function closeAdminModal() {
        adminModal.style.display = 'none';
        resetCreateAdminForm();
    }

    function switchTab(tab) {
        if (tab === 'list') {
            // Activar tab lista
            tabListAdmins.classList.add('text-primary', 'border-b-2', 'border-primary');
            tabListAdmins.classList.remove('text-gray-400');
            tabCreateAdmin.classList.add('text-gray-400');
            tabCreateAdmin.classList.remove('text-primary', 'border-b-2', 'border-primary');

            // Mostrar panel lista
            panelListAdmins.classList.remove('hidden');
            panelCreateAdmin.classList.add('hidden');
        } else {
            // Activar tab crear
            tabCreateAdmin.classList.add('text-primary', 'border-b-2', 'border-primary');
            tabCreateAdmin.classList.remove('text-gray-400');
            tabListAdmins.classList.add('text-gray-400');
            tabListAdmins.classList.remove('text-primary', 'border-b-2', 'border-primary');

            // Mostrar panel crear
            panelCreateAdmin.classList.remove('hidden');
            panelListAdmins.classList.add('hidden');

            resetCreateAdminForm();
        }
    }

    async function loadAdminsList() {
        adminsListContainer.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-spinner fa-spin text-3xl mb-2"></i>
                <p>Cargando administradores...</p>
            </div>
        `;

        try {
            const currentEmail = getCurrentUserEmail();
            if (!currentEmail) throw new Error('No hay usuario autenticado');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'list-admins',
                    currentEmail: currentEmail
                })
            });

            const data = await response.json();

            if (data.success) {
                renderAdminsList(data.admins);
            } else {
                throw new Error(data.error || 'Error al cargar administradores');
            }
        } catch (error) {
            adminsListContainer.innerHTML = `
                <div class="text-center py-8 text-red-400">
                    <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
                    <p>${error.message}</p>
                    <button onclick="window.adminManagement.loadAdminsList()" class="btn btn-secondary mt-4 text-sm">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    function renderAdminsList(admins) {
        if (!admins || admins.length === 0) {
            adminsListContainer.innerHTML = `
                <div class="text-center py-8 text-gray-400">
                    <i class="fas fa-users text-3xl mb-2"></i>
                    <p>No hay administradores registrados</p>
                </div>
            `;
            return;
        }

        const currentEmail = getCurrentUserEmail();

        adminsListContainer.innerHTML = admins.map(admin => {
            const isCurrentUser = admin.email === currentEmail;
            const isActive = admin.active === 1;
            const createdDate = new Date(admin.created_at).toLocaleDateString('es-ES');
            const lastLogin = admin.last_login ?
                new Date(admin.last_login).toLocaleDateString('es-ES') :
                'Nunca';

            return `
                <div class="bg-gray-800/50 p-4 rounded-lg border ${isActive ? 'border-gray-700' : 'border-red-500/30'} ${isCurrentUser ? 'ring-2 ring-primary' : ''}">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <h4 class="font-semibold text-lg ${isActive ? 'text-white' : 'text-gray-500'}">
                                    ${admin.name || 'Sin nombre'}
                                </h4>
                                ${isCurrentUser ? '<span class="text-xs bg-primary text-black px-2 py-1 rounded">Tú</span>' : ''}
                                ${!isActive ? '<span class="text-xs bg-red-500 text-white px-2 py-1 rounded">Inactivo</span>' : ''}
                            </div>
                            <p class="text-sm text-gray-400 mb-1">
                                <i class="fas fa-envelope mr-2"></i>${admin.email}
                            </p>
                            <p class="text-xs text-gray-500">
                                <i class="fas fa-calendar-plus mr-2"></i>Creado: ${createdDate} por ${admin.created_by || 'Sistema'}
                            </p>
                            <p class="text-xs text-gray-500">
                                <i class="fas fa-clock mr-2"></i>Último acceso: ${lastLogin}
                            </p>
                        </div>
                        ${!isCurrentUser && isActive ? `
                            <button 
                                onclick="window.adminManagement.deactivateAdmin('${admin.email}')" 
                                class="btn btn-secondary text-xs py-1 px-3 bg-red-500/20 hover:bg-red-500 border-red-500"
                                title="Desactivar administrador">
                                <i class="fas fa-user-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    async function handleCreateAdmin(e) {
        e.preventDefault();

        // Limpiar mensajes
        createAdminError.classList.add('hidden');
        createAdminSuccess.classList.add('hidden');

        // Obtener valores
        const currentEmail = document.getElementById('current-admin-email').value;
        const currentPassword = document.getElementById('current-admin-password').value;
        const newName = document.getElementById('new-admin-name').value;
        const newEmail = document.getElementById('new-admin-email').value;
        const newPassword = document.getElementById('new-admin-password').value;
        const newPasswordConfirm = document.getElementById('new-admin-password-confirm').value;

        // Validaciones
        if (newPassword !== newPasswordConfirm) {
            showError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            showError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (currentEmail === newEmail) {
            showError('No puedes crear un administrador con tu mismo correo');
            return;
        }

        // Deshabilitar botón
        const submitBtn = createAdminForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creando...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create-admin',
                    currentEmail,
                    currentPassword,
                    newEmail,
                    newPassword,
                    newName
                })
            });

            const data = await response.json();

            if (data.success) {
                showSuccess(data.message || 'Administrador creado correctamente');
                resetCreateAdminForm();

                // Cambiar a la pestaña de lista y actualizar
                setTimeout(() => {
                    switchTab('list');
                    loadAdminsList();
                }, 2000);
            } else {
                throw new Error(data.error || 'Error al crear administrador');
            }
        } catch (error) {
            showError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async function deactivateAdmin(targetEmail) {
        if (!confirm(`¿Estás seguro de desactivar al administrador ${targetEmail}?`)) {
            return;
        }

        const currentPassword = prompt('Ingresa tu contraseña actual para confirmar:');
        if (!currentPassword) return;

        try {
            const currentEmail = getCurrentUserEmail();

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'deactivate-admin',
                    currentEmail,
                    currentPassword,
                    targetEmail
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message || 'Administrador desactivado correctamente');
                loadAdminsList();
            } else {
                throw new Error(data.error || 'Error al desactivar administrador');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    function resetCreateAdminForm() {
        createAdminForm?.reset();
        createAdminError?.classList.add('hidden');
        createAdminSuccess?.classList.add('hidden');

        // Re-llenar email actual
        const currentUserEmail = getCurrentUserEmail();
        if (currentUserEmail) {
            const currentEmailInput = document.getElementById('current-admin-email');
            if (currentEmailInput) currentEmailInput.value = currentUserEmail;
        }
    }

    function showError(message) {
        createAdminError.textContent = message;
        createAdminError.classList.remove('hidden');
        createAdminSuccess.classList.add('hidden');
    }

    function showSuccess(message) {
        createAdminSuccess.textContent = message;
        createAdminSuccess.classList.remove('hidden');
        createAdminError.classList.add('hidden');
    }

    function getCurrentUserEmail() {
        try {
            const userData = localStorage.getItem('td_auth_user');
            if (!userData) return null;

            // Si es un objeto JSON
            if (userData.startsWith('{')) {
                const user = JSON.parse(userData);
                return user.email || user;
            }

            // Si es solo el email
            return userData;
        } catch {
            return null;
        }
    }

    // Exponer funciones globalmente para onclick
    window.adminManagement = {
        loadAdminsList,
        deactivateAdmin
    };

})();
