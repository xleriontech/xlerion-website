import Alpine from 'alpinejs';
import { initAuctionPolling } from './stores/auctionStore.js';
import { initAuthStore } from './stores/authStore.js';
import { notificationService } from './utils/notifications.js';

window.Alpine = Alpine;
window.initAuctionPolling = initAuctionPolling;
window.initAuthStore = initAuthStore;
window.notificationService = notificationService;

Alpine.start();
