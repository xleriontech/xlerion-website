import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
};

const TableBlock = ({ title, rows, emptyLabel }) => {
    if (!rows || rows.length === 0) {
        return (
            <div className="border border-white/10 rounded-xl p-6 bg-black/40">
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-3">{title}</h3>
                <p className="text-xs text-gray-500">{emptyLabel}</p>
            </div>
        );
    }

    const columns = Object.keys(rows[0]);

    return (
        <div className="border border-white/10 rounded-xl p-6 bg-black/40 overflow-hidden">
            <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-4">{title}</h3>
            <div className="overflow-auto max-h-[520px]">
                <table className="min-w-full text-xs text-gray-300">
                    <thead className="sticky top-0 bg-black/80">
                        <tr>
                            {columns.map((col) => (
                                <th key={col} className="text-left px-3 py-2 font-mono uppercase tracking-widest text-[10px] text-gray-400 border-b border-white/10">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                {columns.map((col) => (
                                    <td key={`${idx}-${col}`} className="px-3 py-2 align-top">
                                        {formatValue(row[col])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function AnalyticsAdminPage() {
    const { t } = useLanguage();
    useAnalytics('Analiticas Admin', 'page');

    const [password, setPassword] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/analytics-admin-data.php?limit=200&offset=0', {
                credentials: 'include',
            });
            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    setData(null);
                    return;
                }
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            if (!result.success) {
                setData(null);
                setIsAuthenticated(true);
                setError(result.error || t('analytics_admin_data_error'));
                return;
            }
            setData(result.data);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const shouldRestore = sessionStorage.getItem('analytics_admin_logged_in') === 'true';
        if (shouldRestore) {
            fetchData();
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/analytics-admin-login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password })
            });
            const text = await response.text();
            let result = null;
            if (text) {
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    throw new Error('Respuesta inválida del servidor');
                }
            }
            if (!response.ok || !result?.success) {
                throw new Error(result?.error || 'Unauthorized');
            }
            setPassword('');
            setIsAuthenticated(true);
            sessionStorage.setItem('analytics_admin_logged_in', 'true');
            await fetchData();
        } catch (err) {
            setError(err.message || 'Unauthorized');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        try {
            await fetch('/api/analytics-admin-logout.php', {
                method: 'POST',
                credentials: 'include'
            });
            setData(null);
            setIsAuthenticated(false);
            sessionStorage.removeItem('analytics_admin_logged_in');
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className="pt-28 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
                <div className="mb-8">
                    <p className="text-[#00e9fa] text-xs font-mono tracking-[0.5em] uppercase mb-3">{t('analytics_admin_subtitle')}</p>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight">{t('analytics_admin_title')}</h1>
                </div>

                {!isAuthenticated && (
                    <div className="max-w-md border border-white/10 rounded-xl p-6 bg-black/40">
                        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-4">{t('analytics_admin_login_title')}</h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-2">{t('analytics_admin_password_label')}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('analytics_admin_password_placeholder')}
                                    autoComplete="current-password"
                                    className="w-full bg-black/60 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#00e9fa] text-black font-semibold py-2 rounded-md"
                                disabled={loading}
                            >
                                {loading ? t('analytics_admin_loading') : t('analytics_admin_login_button')}
                            </button>
                            {error && <p className="text-xs text-red-400">{error}</p>}
                        </form>
                    </div>
                )}

                {data && (
                    <div className="space-y-8">
                        {data.summary?.configured === false && (
                            <div className="border border-yellow-400/30 bg-yellow-500/10 text-yellow-200 text-xs font-mono uppercase tracking-[0.2em] px-4 py-3 rounded-lg">
                                {t('analytics_admin_data_error')}
                            </div>
                        )}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400">{t('analytics_admin_summary_title')}</h2>
                            <button
                                onClick={handleLogout}
                                className="text-xs uppercase tracking-[0.3em] text-[#00e9fa] border border-[#00e9fa]/40 px-4 py-2 rounded-md"
                            >
                                {t('analytics_admin_logout_button')}
                            </button>
                        </div>

                        <div className="grid md:grid-cols-5 gap-4">
                            {Object.entries(data.summary || {}).map(([key, value]) => (
                                <div key={key} className="border border-white/10 rounded-xl p-4 bg-black/40">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">{key}</p>
                                    <p className="text-lg font-mono text-[#00e9fa] mt-2">{formatValue(value)}</p>
                                </div>
                            ))}
                        </div>

                        <TableBlock title="page_views" rows={data.page_views} emptyLabel={t('analytics_admin_no_data')} />
                        <TableBlock title="page_view_pings" rows={data.page_view_pings} emptyLabel={t('analytics_admin_no_data')} />
                        <TableBlock title="user_events" rows={data.user_events} emptyLabel={t('analytics_admin_no_data')} />
                        <TableBlock title="sessions" rows={data.sessions} emptyLabel={t('analytics_admin_no_data')} />
                        <TableBlock title="top_pages" rows={data.top_pages} emptyLabel={t('analytics_admin_no_data')} />
                        <TableBlock title="event_summary" rows={data.event_summary} emptyLabel={t('analytics_admin_no_data')} />
                    </div>
                )}
            </section>
        </Layout>
    );
}
