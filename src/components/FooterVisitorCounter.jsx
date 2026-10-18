import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function FooterVisitorCounter() {
    const [visitors, setVisitors] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisitorCount();
        const interval = setInterval(fetchVisitorCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchVisitorCount = async () => {
        try {
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            if (isDevelopment) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/analytics-visitor-count.php', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                setLoading(false);
                return;
            }

            const result = await response.json();

            if (result.success && result.data) {
                setVisitors(result.data);
            }
        } catch (err) {
            // Silently fail - API not available
        } finally {
            setLoading(false);
        }
    };

    if (loading || !visitors) {
        return null;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                <Users size={14} className="text-[#00e9fa]" />
                <span>Total Visitors</span>
            </div>
            <div className="text-[12px] font-mono font-bold text-[#00e9fa] tracking-wider">
                {visitors.unique_visitors.toLocaleString()}
            </div>
            <div className="text-[9px] font-mono text-gray-600 tracking-widest opacity-75">
                {visitors.total_views.toLocaleString()} pages • {visitors.today_visitors} today
            </div>
        </div>
    );
}
