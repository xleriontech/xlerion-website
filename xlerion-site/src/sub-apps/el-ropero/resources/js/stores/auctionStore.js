import axios from 'axios';

export const auctionStore = {
    auctions: [],
    currentAuction: null,
    bids: [],
    loading: false,
    error: null,
    pollInterval: null,

    async fetchAuctions(filters = {}) {
        this.loading = true;
        try {
            const { data } = await axios.get('/api/auctions', { params: filters });
            this.auctions = data.data || data;
            this.error = null;
        } catch (err) {
            this.error = err.response?.data?.message || 'Error fetching auctions';
            console.error('Auction fetch error:', err);
        } finally {
            this.loading = false;
        }
    },

    async fetchAuctionDetail(id) {
        this.loading = true;
        try {
            const { data } = await axios.get(`/api/auctions/${id}`);
            this.currentAuction = data.data || data;
            this.bids = data.bids || [];
            this.error = null;
        } catch (err) {
            this.error = err.response?.data?.message || 'Error fetching auction details';
            console.error('Auction detail error:', err);
        } finally {
            this.loading = false;
        }
    },

    async placeBid(auctionId, amount) {
        try {
            const { data } = await axios.post(`/api/auctions/${auctionId}/bids`, {
                amount: parseFloat(amount),
            });
            this.currentAuction = data.data || data;
            this.bids = data.bids || [];
            return { success: true, data };
        } catch (err) {
            const message = err.response?.data?.message || 'Error placing bid';
            this.error = message;
            return { success: false, error: message };
        }
    },

    startPolling(auctionId, interval = 5000) {
        if (this.pollInterval) clearInterval(this.pollInterval);
        this.pollInterval = setInterval(() => this.fetchAuctionDetail(auctionId), interval);
    },

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },
};

export const initAuctionPolling = (auctionId, interval = 5000) => {
    auctionStore.startPolling(auctionId, interval);
    return () => auctionStore.stopPolling();
};
