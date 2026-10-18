import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Brain, Cpu, Code2, Gamepad2, Eye, Boxes, CheckCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import Layout from '../components/Layout';
import ContactForm from '../components/ContactForm';
import servicesParallax from '../assets/parallax/soluciones-parallax.jpg';
import aiReel from '../assets/reels/servicios-productos-parallax.jpg';
import iotReel from '../assets/reels/proyectos-parallax.jpg';
import fullstackReel from '../assets/reels/documentacion-parallax.jpg';
import gamesReel from '../assets/reels/noticias-eventos-parallax.jpg';
import visionReel from '../assets/reels/inversionistas-alianzas-parallax.jpg';
import modularReel from '../assets/reels/filosofia-parallax.jpg';

export default function PublicidadPage() {
    const { t, lang } = useLanguage();
    const servicesRef = useRef(null);
    const [activeService, setActiveService] = useState(null);
    const [shareOpen, setShareOpen] = useState(null);
    const [shareCopied, setShareCopied] = useState(false);
    const [marketData, setMarketData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('CO');
    const [showLocalCurrency, setShowLocalCurrency] = useState(false);
    const [fxRates, setFxRates] = useState(null);
    const [fxUpdatedAt, setFxUpdatedAt] = useState('');

    useEffect(() => {
        let isMounted = true;
        fetch('/data/market-rates-2026.json')
            .then((response) => response.json())
            .then((data) => {
                if (!isMounted) return;
                setMarketData(data);
            })
            .catch(() => {
                if (!isMounted) return;
                setMarketData(null);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const countryKeys = Object.keys(marketData?.countries ?? {});
        if (!countryKeys.length) return;
        if (!marketData?.countries?.[selectedCountry]) {
            setSelectedCountry(countryKeys[0]);
        }
    }, [marketData, selectedCountry]);

    useEffect(() => {
        let isMounted = true;
        fetch('https://open.er-api.com/v6/latest/USD')
            .then((response) => response.json())
            .then((data) => {
                if (!isMounted) return;
                if (data?.result === 'success') {
                    setFxRates(data?.rates ?? null);
                    setFxUpdatedAt(data?.time_last_update_utc ?? '');
                } else {
                    setFxRates(null);
                }
            })
            .catch(() => {
                if (!isMounted) return;
                setFxRates(null);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const shareUrl = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return 'https://xlerion.com/recursos/publicidad';
    }, []);

    const shareLinks = useMemo(() => {
        const message = t('publicidad_share_message');
        return {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} ${shareUrl}`)}`,
            email: `mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(`${message}\n${shareUrl}`)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`
        };
    }, [shareUrl, t]);

    const handleCopyShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 1500);
        }
    };

    const marketCountry = marketData?.countries?.[selectedCountry] ?? null;
    const currencyCode = marketData?.meta?.currency ?? 'USD';
    const numberLocale = lang === 'es' ? 'es-CO' : 'en-US';
    const countryCurrencyMap = useMemo(() => ({
        CO: 'COP',
        MX: 'MXN',
        US: 'USD',
        ES: 'EUR',
        DE: 'EUR',
        FR: 'EUR',
        UK: 'GBP',
        BR: 'BRL',
        AR: 'ARS',
        CL: 'CLP',
        PE: 'PEN'
    }), []);
    const localCurrency = countryCurrencyMap[selectedCountry] ?? currencyCode;
    const fxRate = showLocalCurrency && localCurrency !== currencyCode ? fxRates?.[localCurrency] : null;
    const effectiveCurrencyCode = showLocalCurrency && fxRate ? localCurrency : currencyCode;
    const fxMultiplier = showLocalCurrency && fxRate ? fxRate : 1;

    const currencyFormatter = useMemo(() => {
        return new Intl.NumberFormat(numberLocale, {
            style: 'currency',
            currency: effectiveCurrencyCode,
            maximumFractionDigits: 0
        });
    }, [effectiveCurrencyCode, numberLocale]);

    const hourlyRange = useMemo(() => {
        if (!marketCountry) return null;
        const factor = marketCountry.affordableFactor ?? 1;
        const ranges = Object.values(marketData?.services ?? {})
            .map((service) => service?.baseHourlyRange)
            .filter((range) => Array.isArray(range) && range.length === 2);
        if (!ranges.length) return null;
        const mins = ranges.map((range) => range[0] * factor);
        const maxs = ranges.map((range) => range[1] * factor);
        return [Math.min(...mins), Math.max(...maxs)];
    }, [marketCountry, marketData]);

    const formatRange = (range) => {
        if (!range) return t('publicidad_market_rate_pending');
        const adjusted = [range[0] * fxMultiplier, range[1] * fxMultiplier];
        return `${currencyFormatter.format(adjusted[0])} - ${currencyFormatter.format(adjusted[1])}`;
    };

    const getServiceHourlyRange = (serviceKey) => {
        if (!marketCountry || !serviceKey) return null;
        const baseRange = marketData?.services?.[serviceKey]?.baseHourlyRange;
        if (!Array.isArray(baseRange) || baseRange.length !== 2) return null;
        const factor = marketCountry.affordableFactor ?? 1;
        return [baseRange[0] * factor, baseRange[1] * factor];
    };

    const services = [
        {
            icon: Brain,
            titleKey: 'publicidad_service_ai_title',
            descKey: 'publicidad_service_ai_desc',
            rateKey: 'ai',
            image: aiReel,
            details: [
                'publicidad_service_ai_detail_1',
                'publicidad_service_ai_detail_2',
                'publicidad_service_ai_detail_3'
            ]
        },
        {
            icon: Cpu,
            titleKey: 'publicidad_service_iot_title',
            descKey: 'publicidad_service_iot_desc',
            rateKey: 'iot',
            image: iotReel,
            details: [
                'publicidad_service_iot_detail_1',
                'publicidad_service_iot_detail_2',
                'publicidad_service_iot_detail_3'
            ]
        },
        {
            icon: Code2,
            titleKey: 'publicidad_service_fullstack_title',
            descKey: 'publicidad_service_fullstack_desc',
            rateKey: 'fullstack',
            image: fullstackReel,
            details: [
                'publicidad_service_fullstack_detail_1',
                'publicidad_service_fullstack_detail_2',
                'publicidad_service_fullstack_detail_3'
            ]
        },
        {
            icon: Gamepad2,
            titleKey: 'publicidad_service_games_title',
            descKey: 'publicidad_service_games_desc',
            rateKey: 'games',
            image: gamesReel,
            details: [
                'publicidad_service_games_detail_1',
                'publicidad_service_games_detail_2',
                'publicidad_service_games_detail_3'
            ]
        },
        {
            icon: Eye,
            titleKey: 'publicidad_service_vision_title',
            descKey: 'publicidad_service_vision_desc',
            rateKey: 'vision',
            image: visionReel,
            details: [
                'publicidad_service_vision_detail_1',
                'publicidad_service_vision_detail_2',
                'publicidad_service_vision_detail_3'
            ]
        },
        {
            icon: Boxes,
            titleKey: 'publicidad_service_modular_title',
            descKey: 'publicidad_service_modular_desc',
            rateKey: 'modular',
            image: modularReel,
            details: [
                'publicidad_service_modular_detail_1',
                'publicidad_service_modular_detail_2',
                'publicidad_service_modular_detail_3'
            ]
        }
    ];

    const scrollServices = (direction) => {
        if (!servicesRef.current) return;
        const distance = servicesRef.current.clientWidth * 0.9;
        servicesRef.current.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black text-white">
                <section className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="space-y-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-[#00e9fa]">
                            {t('publicidad_hero_badge')}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            {t('publicidad_hero_title')}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl">
                            {t('publicidad_hero_subtitle')}
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-[#00e9fa]">
                                {t('publicidad_profile_title')}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {t('publicidad_profile_desc')}
                            </p>
                        </div>
                        <div className="bg-gray-900/60 border border-[#00e9fa]/20 rounded-lg p-6">
                            <p className="text-gray-300 leading-relaxed">
                                {t('publicidad_profile_highlight')}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
                    <div
                        className="pointer-events-none absolute inset-0 bg-center bg-cover opacity-25"
                        style={{ backgroundImage: `url(${servicesParallax})`, backgroundAttachment: 'fixed' }}
                        aria-hidden="true"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/70 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/70 to-transparent" />
                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                            <h2 className="text-4xl font-bold">
                                {t('publicidad_services_title')}
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => scrollServices(-1)}
                                    className="w-10 h-10 rounded-full border border-[#00e9fa]/30 text-[#00e9fa] hover:bg-[#00e9fa]/10 transition-colors"
                                    aria-label="Previous service"
                                >
                                    <ChevronLeft className="w-5 h-5 mx-auto" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollServices(1)}
                                    className="w-10 h-10 rounded-full border border-[#00e9fa]/30 text-[#00e9fa] hover:bg-[#00e9fa]/10 transition-colors"
                                    aria-label="Next service"
                                >
                                    <ChevronRight className="w-5 h-5 mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 -mx-4 md:-mx-8">
                        <div className="px-4 md:px-8">
                            <div
                                ref={servicesRef}
                                className="flex overflow-x-auto snap-x snap-mandatory pb-6"
                                style={{ scrollbarWidth: 'none' }}
                            >
                                {services.map((service, idx) => {
                                    const Icon = service.icon;
                                    return (
                                        <div key={idx} className="min-w-full snap-center flex justify-center px-4">
                                            <article
                                                className="w-[240px] sm:w-[270px] md:w-[300px] lg:w-[320px] snap-center bg-gradient-to-br from-[#0b1018] via-[#0a0f16] to-black border border-[#00e9fa]/20 rounded-[28px] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] hover:border-[#00e9fa]/60 transition-all aspect-[9/16] flex flex-col cursor-pointer"
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setActiveService(idx)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        event.preventDefault();
                                                        setActiveService(idx);
                                                    }
                                                }}
                                            >
                                                <div
                                                    className="h-32 w-full rounded-2xl border border-[#00e9fa]/20 bg-cover bg-center mb-4"
                                                    style={{ backgroundImage: `url(${service.image})` }}
                                                    aria-hidden="true"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <div className="w-10 h-10 rounded-2xl bg-[#00e9fa]/10 border border-[#00e9fa]/30 flex items-center justify-center">
                                                        <Icon className="w-5 h-5 text-[#00e9fa]" />
                                                    </div>
                                                    <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-gray-500">Reel {idx + 1}</span>
                                                </div>
                                                <div className="mt-4 flex-1 flex flex-col">
                                                    <div className="h-[2px] w-10 bg-[#00e9fa] mb-4" />
                                                    <h3 className="text-lg font-semibold mb-3">
                                                        {t(service.titleKey)}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                                        {t(service.descKey)}
                                                    </p>
                                                    <ul className="mt-4 space-y-2 text-[11px] text-gray-300">
                                                        {service.details.map((detailKey) => (
                                                            <li key={detailKey} className="flex items-start gap-2">
                                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00e9fa]"></span>
                                                                <span>{t(detailKey)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-4 rounded-2xl border border-[#00e9fa]/15 bg-black/40 px-3 py-3 text-[10px] text-gray-300">
                                                        <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500">
                                                            {t('publicidad_market_card_label')}
                                                        </p>
                                                        <p className="mt-2">{t('publicidad_market_card_summary')}</p>
                                                        <p className="text-gray-400">{t('publicidad_market_card_hint')}</p>
                                                        <p className="mt-2 text-white">
                                                            {t('publicidad_market_hourly_label')} {formatRange(getServiceHourlyRange(service.rateKey))}
                                                        </p>
                                                    </div>
                                                    <div className="mt-5 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] text-gray-500">
                                                        <span className="w-2 h-2 rounded-full bg-[#00e9fa]"></span>
                                                        {t('publicidad_services_title')}
                                                    </div>
                                                    <Link
                                                        to="/cotizacion-servicios"
                                                        className="mt-4 inline-flex items-center justify-center rounded-full border border-[#00e9fa]/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00e9fa] hover:bg-[#00e9fa]/10 transition-colors"
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        {t('publicidad_services_cta')}
                                                    </Link>
                                                    <div className="mt-3">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-[#00e9fa]"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setShareOpen(shareOpen === idx ? null : idx);
                                                            }}
                                                        >
                                                            <Share2 className="h-3.5 w-3.5" />
                                                            {t('publicidad_share_label')}
                                                        </button>
                                                        {shareOpen === idx && (
                                                            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                                                                <button
                                                                    type="button"
                                                                    className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                        handleCopyShare();
                                                                    }}
                                                                >
                                                                    {shareCopied ? t('publicidad_share_copied') : t('publicidad_share_copy')}
                                                                </button>
                                                                <a
                                                                    href={shareLinks.whatsapp}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                >
                                                                    {t('publicidad_share_whatsapp')}
                                                                </a>
                                                                <a
                                                                    href={shareLinks.email}
                                                                    className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                >
                                                                    {t('publicidad_share_email')}
                                                                </a>
                                                                <a
                                                                    href={shareLinks.linkedin}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                >
                                                                    {t('publicidad_share_linkedin')}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {activeService !== null && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
                            <button
                                type="button"
                                className="absolute inset-0 cursor-default"
                                aria-label="Close service detail"
                                onClick={() => setActiveService(null)}
                            />
                            <div className="relative z-10 max-w-md w-full">
                                <article className="w-full bg-gradient-to-br from-[#0b1018] via-[#0a0f16] to-black border border-[#00e9fa]/40 rounded-[32px] p-6 shadow-[0_28px_60px_rgba(0,0,0,0.55)] aspect-[9/16] flex flex-col scale-100">
                                    <div
                                        className="h-36 w-full rounded-2xl border border-[#00e9fa]/20 bg-cover bg-center mb-5"
                                        style={{ backgroundImage: `url(${services[activeService].image})` }}
                                        aria-hidden="true"
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-[#00e9fa]/10 border border-[#00e9fa]/30 flex items-center justify-center">
                                            {(() => {
                                                const ActiveIcon = services[activeService].icon;
                                                return <ActiveIcon className="w-6 h-6 text-[#00e9fa]" />;
                                            })()}
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-gray-500">
                                            Reel {activeService + 1}
                                        </span>
                                    </div>
                                    <div className="mt-5 flex-1 flex flex-col">
                                        <div className="h-[2px] w-12 bg-[#00e9fa] mb-4" />
                                        <h3 className="text-xl font-semibold mb-3">
                                            {t(services[activeService].titleKey)}
                                        </h3>
                                        <p className="text-gray-300 text-sm leading-relaxed flex-1">
                                            {t(services[activeService].descKey)}
                                        </p>
                                        <ul className="mt-4 space-y-2 text-[12px] text-gray-300">
                                            {services[activeService].details.map((detailKey) => (
                                                <li key={detailKey} className="flex items-start gap-2">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#00e9fa]"></span>
                                                    <span>{t(detailKey)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-4 rounded-2xl border border-[#00e9fa]/15 bg-black/40 px-4 py-3 text-[11px] text-gray-300">
                                            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500">
                                                {t('publicidad_market_card_label')}
                                            </p>
                                            <p className="mt-2">{t('publicidad_market_card_summary')}</p>
                                            <p className="text-gray-400">{t('publicidad_market_card_hint')}</p>
                                            <p className="mt-2 text-white">
                                                {t('publicidad_market_hourly_label')} {formatRange(getServiceHourlyRange(services[activeService].rateKey))}
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">
                                            <span className="w-2 h-2 rounded-full bg-[#00e9fa]"></span>
                                            {t('publicidad_services_title')}
                                        </div>
                                        <Link
                                            to="/cotizacion-servicios"
                                            className="mt-5 inline-flex items-center justify-center rounded-full border border-[#00e9fa]/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#00e9fa] hover:bg-[#00e9fa]/10 transition-colors"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            {t('publicidad_services_cta')}
                                        </Link>
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-[#00e9fa]"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setShareOpen(shareOpen === 'modal' ? null : 'modal');
                                                }}
                                            >
                                                <Share2 className="h-4 w-4" />
                                                {t('publicidad_share_label')}
                                            </button>
                                            {shareOpen === 'modal' && (
                                                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                                                    <button
                                                        type="button"
                                                        className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleCopyShare();
                                                        }}
                                                    >
                                                        {shareCopied ? t('publicidad_share_copied') : t('publicidad_share_copy')}
                                                    </button>
                                                    <a
                                                        href={shareLinks.whatsapp}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        {t('publicidad_share_whatsapp')}
                                                    </a>
                                                    <a
                                                        href={shareLinks.email}
                                                        className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        {t('publicidad_share_email')}
                                                    </a>
                                                    <a
                                                        href={shareLinks.linkedin}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-full border border-[#00e9fa]/20 px-3 py-2 text-gray-300 hover:border-[#00e9fa]/60"
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        {t('publicidad_share_linkedin')}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    )}
                </section>

                <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="space-y-10">
                        <div className="space-y-4 max-w-3xl">
                            <h2 className="text-3xl font-bold text-[#00e9fa]">
                                {t('publicidad_market_title')}
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {t('publicidad_market_desc')}
                            </p>
                            <p className="text-sm text-gray-500">
                                {t('publicidad_market_note')}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                                    {t('publicidad_market_country_label')}
                                </span>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#00e9fa]/30 bg-[#0b1018]/90 px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                                    <select
                                        value={selectedCountry}
                                        onChange={(event) => setSelectedCountry(event.target.value)}
                                        className="bg-transparent text-xs text-white uppercase tracking-[0.25em] focus:outline-none focus:ring-0"
                                        aria-label={t('publicidad_market_country_label')}
                                        disabled={!marketData}
                                    >
                                        {marketData
                                            ? Object.entries(marketData.countries ?? {}).map(([code, info]) => (
                                                <option key={code} value={code} className="bg-[#0b1018] text-white">
                                                    {info?.name ?? code}
                                                </option>
                                            ))
                                            : (
                                                <option value="">{t('publicidad_market_rate_pending')}</option>
                                            )}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowLocalCurrency((prev) => !prev)}
                                    disabled={!fxRates}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#00e9fa]/30 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-[#00e9fa] transition-colors hover:bg-[#00e9fa]/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/40"
                                >
                                    {showLocalCurrency ? t('publicidad_market_fx_usd') : t('publicidad_market_fx_local')}
                                    <span className="text-white/70">{showLocalCurrency ? currencyCode : localCurrency}</span>
                                </button>
                            </div>
                            <div className="text-xs text-gray-500">
                                {marketCountry?.name ? `${t('publicidad_market_country_active')}: ${marketCountry.name}` : t('publicidad_market_rate_pending')}
                                {showLocalCurrency && !fxRate && (
                                    <span className="ml-2 text-white/40">• {t('publicidad_market_fx_pending')}</span>
                                )}
                                {showLocalCurrency && fxRate && (
                                    <span className="ml-2 inline-flex items-center rounded-full border border-[#00e9fa]/40 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-[#00e9fa]">
                                        {t('publicidad_market_fx_live')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gray-900/60 border border-[#00e9fa]/20 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-2">{t('publicidad_market_small_title')}</h3>
                                <p className="text-gray-400 mb-4">{t('publicidad_market_small_desc')}</p>
                                <p className="text-white font-semibold">
                                    {t('publicidad_market_hourly_label')} {formatRange(hourlyRange)}
                                </p>
                                <p className="text-gray-400">
                                    {t('publicidad_market_project_label')} {formatRange(marketCountry?.tiers?.small)}
                                </p>
                            </div>
                            <div className="bg-gray-900/60 border border-[#00e9fa]/40 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-2">{t('publicidad_market_medium_title')}</h3>
                                <p className="text-gray-400 mb-4">{t('publicidad_market_medium_desc')}</p>
                                <p className="text-white font-semibold">
                                    {t('publicidad_market_hourly_label')} {formatRange(hourlyRange)}
                                </p>
                                <p className="text-gray-400">
                                    {t('publicidad_market_project_label')} {formatRange(marketCountry?.tiers?.medium)}
                                </p>
                            </div>
                            <div className="bg-gray-900/60 border border-[#00e9fa]/20 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-2">{t('publicidad_market_large_title')}</h3>
                                <p className="text-gray-400 mb-4">{t('publicidad_market_large_desc')}</p>
                                <p className="text-white font-semibold">
                                    {t('publicidad_market_hourly_label')} {formatRange(hourlyRange)}
                                </p>
                                <p className="text-gray-400">
                                    {t('publicidad_market_project_label')} {formatRange(marketCountry?.tiers?.large)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4 md:px-8 bg-gradient-to-t from-gray-900 to-black">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-4xl font-bold">{t('publicidad_plans_title')}</h2>
                            <p className="text-gray-300">{t('publicidad_plans_desc')}</p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {['startup', 'business', 'enterprise'].map((tier) => (
                                <div key={tier} className="border border-[#00e9fa]/20 rounded-lg p-6 bg-black/60">
                                    <h3 className="text-2xl font-semibold mb-2">{t(`publicidad_plan_${tier}_title`)}</h3>
                                    <p className="text-[#00e9fa] text-3xl font-bold mb-4">{t(`publicidad_plan_${tier}_price`)}</p>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#00e9fa]" />{t(`publicidad_plan_${tier}_feat_1`)}</li>
                                        <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#00e9fa]" />{t(`publicidad_plan_${tier}_feat_2`)}</li>
                                        <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-[#00e9fa]" />{t(`publicidad_plan_${tier}_feat_3`)}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4 md:px-8 bg-black">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold text-[#00e9fa]">{t('publicidad_impact_title')}</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="border border-[#00e9fa]/20 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-2">{t(`publicidad_impact_${index}_title`)}</h3>
                                    <p className="text-gray-400">{t(`publicidad_impact_${index}_desc`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-gray-900">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#00e9fa]">{t('publicidad_contact_title')}</h2>
                            <p className="text-gray-300">{t('publicidad_contact_desc')}</p>
                            <div className="space-y-3 text-gray-300">
                                <p><span className="text-white font-semibold">{t('publicidad_contact_email_label')}</span> {t('publicidad_contact_email_value')}</p>
                                <p><span className="text-white font-semibold">{t('publicidad_contact_social_label')}</span> {t('publicidad_contact_social_value')}</p>
                            </div>
                        </div>
                        <div className="bg-black/60 border border-[#00e9fa]/20 rounded-lg p-6">
                            <ContactForm />
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
