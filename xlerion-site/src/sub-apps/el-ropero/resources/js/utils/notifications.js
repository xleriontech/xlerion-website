export const notificationService = {
    show(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container') || this.createContainer();
        const toast = document.createElement('div');
        const bgColor = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            warning: 'bg-yellow-600',
            info: 'bg-blue-600',
        }[type] || 'bg-blue-600';

        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in mb-2`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => toast.remove(), duration);
    },

    createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 max-w-md';
        document.body.appendChild(container);
        return container;
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    },
};
