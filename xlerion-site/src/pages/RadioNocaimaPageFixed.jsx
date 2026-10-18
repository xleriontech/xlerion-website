import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronDown, MapPin, Play, Radio, Volume2, Headphones, Music, Phone, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

// Leones Stereo Branding Colors
const RADIO_COLORS = {
    primary: '#104080',    // Azul principal del logo
    secondary: '#102050',  // Azul profundo del logo
    accent: '#105090',     // Azul acento del logo
    dark: '#101010',       // Negro del logo
    light: '#1a1a1a',      // Texto principal sobre fondo blanco
    white: '#ffffff'
};

export default function RadioNocaimaPageFixed() {
    const { t } = useLanguage();
    const [navExpanded, setNavExpanded] = useState(false);
    const [demoContent, setDemoContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [selectedSoundPoint, setSelectedSoundPoint] = useState(null);
    const [selectedDonationOption, setSelectedDonationOption] = useState(null);
    const [paymentFlow, setPaymentFlow] = useState(null); // 'donor-info', 'payment-method-select', 'processing', 'complete'
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '' });
    const [transactions, setTransactions] = useState([]);
    const [correspondentForm, setCorrespondentForm] = useState({
        name: '',
        email: '',
        phone: '',
        collaborationType: '',
        description: ''
    });
    const [correspondentSubmitted, setCorrespondentSubmitted] = useState(false);
    const aboutRef = useRef(null);
    const playerRef = useRef(null);
    const episodesRef = useRef(null);
    const eventsRef = useRef(null);
    const mapRef = useRef(null);
    const correspondentRef = useRef(null);
    const supportRef = useRef(null);

    const scrollToSection = (tabId) => {
        setActiveTab(tabId);
        setTimeout(() => {
            const refMap = {
                about: aboutRef,
                player: playerRef,
                episodes: episodesRef,
                events: eventsRef,
                map: mapRef,
                correspondent: correspondentRef,
                support: supportRef
            };
            refMap[tabId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    };

    const handleCtaClick = (cta) => {
        if (!cta) {
            return;
        }

        const action = cta.action || cta.cta_action || cta.action_type;
        const url = cta.url || cta.link || cta.href;

        if (action === 'scroll_to_player') {
            scrollToSection('player');
            return;
        }
        if (action === 'scroll_to_episodes') {
            scrollToSection('episodes');
            return;
        }
        if (action === 'scroll_to_support') {
            scrollToSection('support');
            return;
        }
        if (action === 'scroll_to_correspondent') {
            scrollToSection('correspondent');
            return;
        }

        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleDonateClick = () => {
        setDonorInfo({ name: '', email: '', phone: '' });
        setSelectedPaymentMethod(null);
        setPaymentFlow('donor-info');
    };

    const handlePaymentMethodSelect = useCallback((method) => {
        setSelectedPaymentMethod(method);
        // Generate transaction ID and set payment flow
        const prefix = 'TXN-';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 9).toUpperCase();
        const txId = `${prefix}${timestamp}${random}`;
        setTransactionId(txId);

        // Save transaction to localStorage
        const newTransaction = {
            id: txId,
            donor_name: donorInfo.name,
            donor_email: donorInfo.email,
            donor_phone: donorInfo.phone,
            donation_type: selectedDonationOption?.id,
            donation_amount: selectedDonationOption?.amount,
            payment_method: method,
            date: new Date().toISOString(),
            status: 'completed'
        };

        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        localStorage.setItem('radio_nocaima_transactions', JSON.stringify(updatedTransactions));

        setPaymentFlow('processing');
    }, [donorInfo, selectedDonationOption, transactions]); const handleClosePaymentModal = () => {
        setPaymentFlow(null);
        setSelectedPaymentMethod(null);
        setTransactionId(null);
        setSelectedDonationOption(null);
    };

    useEffect(() => {
        fetch('/projects_data/radio_nocaima_demo_content.json')
            .then((res) => res.json())
            .then((data) => {
                setDemoContent(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading demo content:', err);
                setLoading(false);
            });

        // Load transactions from localStorage
        const savedTransactions = localStorage.getItem('radio_nocaima_transactions');
        if (savedTransactions) {
            try {
                setTransactions(JSON.parse(savedTransactions));
            } catch (e) {
                console.error('Error loading transactions:', e);
            }
        }
    }, []);

    // Timer for payment processing simulation
    useEffect(() => {
        if (paymentFlow === 'processing') {
            const timer = setTimeout(() => {
                setPaymentFlow('complete');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [paymentFlow]);

    if (loading || !demoContent) {
        return (
            <Layout
                navVariant={navExpanded ? 'full' : 'logo-only'}
                showFooter={navExpanded}
                onLogoClick={() => {
                    setNavExpanded((prev) => !prev);
                    return true;
                }}
            >
                <div className="py-40 px-8 max-w-6xl mx-auto text-center" style={{ backgroundColor: RADIO_COLORS.white }}>
                    <div className="animate-pulse">
                        <Radio className="mx-auto mb-4" size={48} style={{ color: RADIO_COLORS.primary }} />
                        <p className="text-gray-400">{t('radio_nocaima_loading') || 'Cargando...'}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const { hero, about_section, live_player, episodes_ondemand, events_calendar, sound_map, support_page } = demoContent;
    const socialIconMap = {
        facebook: Facebook,
        instagram: Instagram,
        youtube: Youtube,
        whatsapp: MessageCircle
    };
    const socialLinks = (demoContent?.socials?.length ? demoContent.socials : []).map((social) => ({
        ...social,
        Icon: socialIconMap[social.id] || Radio
    }));
    const collaboratorProfiles = (() => {
        const schedule = live_player?.program_schedule || [];
        const uniqueHosts = Array.from(
            schedule.reduce((acc, program) => {
                if (program?.host) {
                    acc.set(program.host, program);
                }
                return acc;
            }, new Map())
        ).map(([host, program]) => ({
            name: host,
            role: program?.title || program?.name || (t('radio_nocaima_collaborator_host') || 'Host')
        }));

        if (uniqueHosts.length > 0) {
            return uniqueHosts.slice(0, 6);
        }

        return [
            { name: 'Valentina Rojas', role: t('radio_nocaima_collaborator_music') || 'Curadora musical' },
            { name: 'Miguel Ángel Duarte', role: t('radio_nocaima_collaborator_news') || 'Periodista comunitario' },
            { name: 'Sara Lozano', role: t('radio_nocaima_collaborator_culture') || 'Productora cultural' },
            { name: 'Camilo Rincón', role: t('radio_nocaima_collaborator_sports') || 'Relator deportivo' },
            { name: 'Natalia Gómez', role: t('radio_nocaima_collaborator_social') || 'Gestora social' },
            { name: 'Julián Rivera', role: t('radio_nocaima_collaborator_tech') || 'Técnico de sonido' }
        ];
    })();

    return (
        <Layout
            navVariant={navExpanded ? 'full' : 'logo-only'}
            showFooter={navExpanded}
            onLogoClick={() => {
                setNavExpanded((prev) => !prev);
                return true;
            }}
        >
            <div
                className="fixed right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-widest shadow-lg z-50"
                style={{
                    backgroundColor: '#e10600',
                    color: RADIO_COLORS.white
                }}
            >
                <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse"></span>
                {t('radio_nocaima_on_air') || 'On air'}
            </div>
            {/* Hero Section - Leones Stereo Branding */}
            <div
                className="relative h-[50vh] md:h-[60vh] overflow-hidden pt-12 md:pt-24"
                style={{
                    backgroundColor: RADIO_COLORS.white,
                    backgroundImage: "url('/assets/fondo-radio.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Background gradient with radio theme */}
                <div className="absolute inset-0" style={{
                    background: `linear-gradient(135deg, ${RADIO_COLORS.white} 0%, ${RADIO_COLORS.primary}20 50%, ${RADIO_COLORS.white} 100%)`
                }} />

                {/* Animated wave effect */}
                <div className="absolute inset-0 opacity-30">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                        <path
                            d="M0,64 Q300,0 600,64 T1200,64 L1200,120 L0,120 Z"
                            fill={RADIO_COLORS.primary}
                            className="opacity-20"
                        />
                    </svg>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8 max-w-3xl z-10">
                        {/* Leones Stereo Logo */}
                        <div className="mb-6 inline-flex items-center justify-center">
                            <img
                                src="/assets/leones-logo.png"
                                alt="Leones Stereo"
                                className="h-24 md:h-28 w-auto object-contain"
                            />
                        </div>

                        {/* Station Name */}
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-2" style={{ color: RADIO_COLORS.primary }}>
                            Leones Stereo
                        </h1>
                        <p className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-6" style={{ color: RADIO_COLORS.accent }}>
                            107.4 FM
                        </p>
                        <p className="text-lg md:text-xl mb-4" style={{ color: RADIO_COLORS.light }}>
                            {t('radio_nocaima_station_tagline') || 'La Voz Comunitaria de Nocaima, Cundinamarca'}
                        </p>

                        {/* Contact Info Banner */}
                        <div className="my-8 p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '20', borderLeft: `4px solid ${RADIO_COLORS.primary}` }}>
                            <p className="flex items-center justify-center gap-2 font-mono text-sm" style={{ color: RADIO_COLORS.accent }}>
                                <Phone size={18} />
                                <a
                                    href="https://wa.me/573204987992"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                    style={{ color: RADIO_COLORS.accent }}
                                >
                                    +57 320 4987992
                                </a>
                                <span aria-hidden="true">|</span>
                                <a
                                    href="https://wa.me/573106180632"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                    style={{ color: RADIO_COLORS.accent }}
                                >
                                    +57 310 618 0632
                                </a>
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                type="button"
                                onClick={() => handleCtaClick(hero.cta_buttons?.[0] || hero.cta_primary)}
                                className="px-8 py-3 font-bold uppercase tracking-wider text-lg transition-transform hover:scale-105"
                                style={{
                                    backgroundColor: RADIO_COLORS.primary,
                                    color: RADIO_COLORS.white,
                                    border: `2px solid ${RADIO_COLORS.primary}`
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <Play size={20} />
                                    {t('radio_nocaima_listen_live') || 'Escuchar en Vivo'}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCtaClick(hero.cta_buttons?.[1] || hero.cta_secondary)}
                                className="px-8 py-3 font-bold uppercase tracking-wider text-lg transition-all hover:scale-105"
                                style={{
                                    color: RADIO_COLORS.primary,
                                    border: `2px solid ${RADIO_COLORS.primary}`
                                }}
                            >
                                {t('radio_nocaima_learn_more') || 'Más Información'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="py-4 md:py-6 px-4 md:px-8" style={{ backgroundColor: RADIO_COLORS.white, borderBottom: `2px solid ${RADIO_COLORS.primary}` }}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex gap-1 md:gap-2 overflow-x-auto overflow-y-hidden pb-2 -mx-4 md:-mx-8 px-4 md:px-8">
                        {[
                            { id: 'about', label: t('radio_nocaima_tab_about') || 'Acerca De', icon: Radio },
                            { id: 'player', label: t('radio_nocaima_tab_live') || 'En Vivo', icon: Play },
                            { id: 'episodes', label: t('radio_nocaima_tab_episodes') || 'Episodios', icon: Music },
                            { id: 'events', label: t('radio_nocaima_tab_events') || 'Eventos', icon: Volume2 },
                            { id: 'map', label: t('radio_nocaima_tab_map') || 'Mapa Sonoro', icon: MapPin },
                            { id: 'correspondent', label: t('radio_nocaima_tab_correspondent') || 'Corresponsal', icon: Radio },
                            { id: 'support', label: t('radio_nocaima_tab_support') || 'Apoyar', icon: Headphones }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 font-mono text-xs md:text-sm uppercase tracking-wider whitespace-nowrap transition-all rounded flex-shrink-0"
                                    style={{
                                        color: activeTab === tab.id ? RADIO_COLORS.white : RADIO_COLORS.primary,
                                        backgroundColor: activeTab === tab.id ? RADIO_COLORS.primary : 'transparent',
                                        borderBottom: activeTab === tab.id ? 'none' : `2px solid transparent`
                                    }}
                                >
                                    <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-20 px-8" style={{ backgroundColor: RADIO_COLORS.white }}>
                <div className="max-w-6xl mx-auto">

                    {/* About Section */}
                    {activeTab === 'about' && (
                        <section ref={aboutRef} id="radio-nocaima-about" className="space-y-12 pb-20">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_about_section_desc') || 'Conoce más sobre Leones Stereo, nuestra misión, valores y el equipo de colaboradores que hacen posible la transmisión diaria.'}
                                </p>
                            </div>

                            {/* Station Information */}
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <h2 className="text-4xl font-black uppercase mb-6" style={{ color: RADIO_COLORS.primary }}>
                                        {t('radio_nocaima_about_title') || 'Sobre Leones Stereo'}
                                    </h2>
                                    <p className="text-lg leading-relaxed mb-6" style={{ color: RADIO_COLORS.light }}>
                                        {t('radio_nocaima_about_description') || 'Leones Stereo es la emisora comunitaria de Nocaima que transmite en 107.4 FM desde Nocaima, Cundinamarca. Ofrecemos programación musical y comunitaria, conectando a la comunidad local a través del dial.'}
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '15' }}>
                                            <Radio size={24} style={{ color: RADIO_COLORS.primary, flexShrink: 0 }} />
                                            <div>
                                                <p className="font-bold uppercase text-sm" style={{ color: RADIO_COLORS.accent }}>
                                                    {t('radio_nocaima_frequency_label') || 'Frecuencia'}
                                                </p>
                                                <p style={{ color: RADIO_COLORS.light }}>107.4 FM - Nocaima, Cundinamarca</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.secondary + '15' }}>
                                            <Music size={24} style={{ color: RADIO_COLORS.secondary, flexShrink: 0 }} />
                                            <div>
                                                <p className="font-bold uppercase text-sm" style={{ color: RADIO_COLORS.accent }}>
                                                    {t('radio_nocaima_programming_label') || 'Programación'}
                                                </p>
                                                <p style={{ color: RADIO_COLORS.light }}>
                                                    {t('radio_nocaima_programming_desc') || 'Música, noticias y contenidos comunitarios'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.accent + '15' }}>
                                            <Phone size={24} style={{ color: RADIO_COLORS.accent, flexShrink: 0 }} />
                                            <div>
                                                <p className="font-bold uppercase text-sm" style={{ color: RADIO_COLORS.accent }}>
                                                    {t('radio_nocaima_contact_label') || 'Contacto'}
                                                </p>
                                                <p style={{ color: RADIO_COLORS.light }}>
                                                    <a
                                                        href="https://wa.me/573204987992"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                        style={{ color: RADIO_COLORS.light }}
                                                    >
                                                        +57 320 4987992
                                                    </a>
                                                    <span aria-hidden="true"> / </span>
                                                    <a
                                                        href="https://wa.me/573106180632"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                        style={{ color: RADIO_COLORS.light }}
                                                    >
                                                        +57 310 618 0632
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {socialLinks.length > 0 && (
                                        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '10', border: `2px solid ${RADIO_COLORS.primary}40` }}>
                                            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                                <h4 className="text-lg font-bold uppercase" style={{ color: RADIO_COLORS.primary }}>
                                                    {t('radio_nocaima_social_title') || 'Redes sociales'}
                                                </h4>
                                                <span className="text-xs uppercase tracking-widest" style={{ color: RADIO_COLORS.accent }}>
                                                    {t('radio_nocaima_social_subtitle') || 'Conéctate con Leones Stereo'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {socialLinks.map((social) => (
                                                    <a
                                                        key={social.id}
                                                        href={social.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.white,
                                                            border: `1px solid ${RADIO_COLORS.primary}40`,
                                                            color: RADIO_COLORS.primary
                                                        }}
                                                    >
                                                        <social.Icon size={16} />
                                                        {social.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mission & Values */}
                                <div>
                                    <h3 className="text-2xl font-bold uppercase mb-6" style={{ color: RADIO_COLORS.primary }}>
                                        {t('radio_nocaima_mission') || 'Nuestra Misión'}
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8" style={{ color: RADIO_COLORS.light }}>
                                        {about_section?.mission?.text || about_section?.mission_text || 'Conectar la comunidad de Nocaima a través de programación de calidad, música variada y contenidos que reflejen la voz de nuestros oyentes.'}
                                    </p>

                                    <h3 className="text-2xl font-bold uppercase mb-6" style={{ color: RADIO_COLORS.secondary }}>
                                        {t('radio_nocaima_values') || 'Valores'}
                                    </h3>
                                    <ul className="space-y-3" style={{ color: RADIO_COLORS.light }}>
                                        {[
                                            t('radio_nocaima_value_community') || 'Compromiso con la comunidad',
                                            t('radio_nocaima_value_quality') || 'Calidad en la programación',
                                            t('radio_nocaima_value_transparency') || 'Transparencia y ética',
                                            t('radio_nocaima_value_inclusion') || 'Inclusión y participación'
                                        ].map((value, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: RADIO_COLORS.accent }}></span>
                                                {value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-8">
                                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold uppercase" style={{ color: RADIO_COLORS.primary }}>
                                            {t('radio_nocaima_collaborators_title') || 'Colaboradores'}
                                        </h3>
                                        <p className="text-sm" style={{ color: RADIO_COLORS.light }}>
                                            {t('radio_nocaima_collaborators_subtitle') || 'Perfiles de ejemplo basados en la parrilla de programación'}
                                        </p>
                                    </div>
                                    <span className="text-xs uppercase tracking-widest" style={{ color: RADIO_COLORS.accent }}>
                                        {t('radio_nocaima_collaborators_note') || 'Perfiles de muestra'}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {collaboratorProfiles.map((profile) => (
                                        <div
                                            key={profile.name}
                                            className="p-5 rounded-xl border"
                                            style={{
                                                backgroundColor: RADIO_COLORS.white,
                                                borderColor: `${RADIO_COLORS.primary}40`
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                                                    style={{
                                                        backgroundColor: `${RADIO_COLORS.primary}20`,
                                                        color: RADIO_COLORS.primary
                                                    }}
                                                >
                                                    {profile.name
                                                        .split(' ')
                                                        .map((part) => part[0])
                                                        .join('')
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold" style={{ color: RADIO_COLORS.light }}>
                                                        {profile.name}
                                                    </p>
                                                    <p className="text-sm" style={{ color: RADIO_COLORS.accent }}>
                                                        {profile.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm" style={{ color: RADIO_COLORS.light }}>
                                                {t('radio_nocaima_collaborators_bio') || 'Apoya la programación diaria con contenidos, entrevistas y comunidad.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'player' && (
                        <section ref={playerRef} id="radio-nocaima-player" className="space-y-8 pb-20">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_live_section_desc') || 'Escucha la transmisión en vivo de Leones Stereo y mantente actualizado con nuestra programación diaria.'}
                                </p>
                            </div>

                            <div className="p-8 rounded-lg" style={{ backgroundColor: RADIO_COLORS.white, border: `2px solid ${RADIO_COLORS.primary}` }}>
                                <h2 className="text-3xl font-black uppercase mb-8" style={{ color: RADIO_COLORS.primary }}>
                                    {t('radio_nocaima_live_now') || 'Transmisión En Vivo'}
                                </h2>
                                <div className="p-8 rounded-lg mb-8" style={{ backgroundColor: RADIO_COLORS.primary + '20', border: `1px solid ${RADIO_COLORS.primary}50` }}>
                                    <div className="mb-6">
                                        <p className="text-sm uppercase tracking-widest mb-2 font-bold" style={{ color: RADIO_COLORS.accent }}>
                                            {t('radio_nocaima_current_program') || 'Programa Actual'}
                                        </p>
                                        <h3 className="text-4xl font-black mb-2" style={{ color: RADIO_COLORS.primary }}>
                                            {live_player?.now_playing?.title || live_player?.current_program?.name || t('radio_nocaima_varied_programming') || 'Programación Variada'}
                                        </h3>
                                        <p style={{ color: RADIO_COLORS.light }} className="text-lg">
                                            {live_player?.now_playing?.description || live_player?.current_program?.description || t('radio_nocaima_community_music_desc') || 'Música y contenidos de la comunidad'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button
                                            type="button"
                                            aria-label={t('radio_nocaima_listen_live') || 'Escuchar en vivo'}
                                            onClick={() => handleCtaClick({ url: live_player?.stream_config?.primary_stream })}
                                            className="flex items-center justify-center w-20 h-20 rounded-full hover:scale-110 transition-transform"
                                            style={{
                                                backgroundColor: RADIO_COLORS.primary,
                                                color: RADIO_COLORS.white
                                            }}
                                        >
                                            <Play size={40} fill="currentColor" />
                                        </button>
                                        <div className="flex-1">
                                            <p style={{ color: RADIO_COLORS.light }} className="text-sm font-bold">
                                                {live_player?.listener_stats?.current_listeners || live_player?.listeners?.current || '1000+'} {t('radio_nocaima_listeners') || 'oyentes'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold uppercase mb-6" style={{ color: RADIO_COLORS.primary }}>
                                        {t('radio_nocaima_daily_schedule') || 'Programación Diaria'}
                                    </h3>
                                    <div className="space-y-3">
                                        {live_player?.program_schedule?.slice(0, 6).map((program, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-lg transition-all cursor-pointer hover:scale-105"
                                                style={{
                                                    backgroundColor: RADIO_COLORS.primary + '10',
                                                    border: `1px solid ${RADIO_COLORS.primary}40`
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold uppercase text-sm" style={{ color: RADIO_COLORS.accent }}>
                                                            {program.time || program.start_time}
                                                        </p>
                                                        <p style={{ color: RADIO_COLORS.light }} className="text-lg font-bold">
                                                            {program.title || program.name}
                                                        </p>
                                                    </div>
                                                    <p style={{ color: RADIO_COLORS.light }} className="text-xs">
                                                        {program.host}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'episodes' && (
                        <section ref={episodesRef} id="radio-nocaima-episodes" className="pb-20">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg mb-8" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_episodes_section_desc') || 'Accede a nuestro archivo de episodios disponibles bajo demanda. Revive tus programas favoritos y mantente informado.'}
                                </p>
                            </div>

                            <h2 className="text-3xl font-black uppercase mb-8" style={{ color: RADIO_COLORS.primary }}>
                                {t('radio_nocaima_episodes_library') || 'Episodios Disponibles'}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {episodes_ondemand?.episodes?.slice(0, 6).map((episode, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg overflow-hidden hover:scale-105 transition-transform group cursor-pointer"
                                        style={{
                                            backgroundColor: RADIO_COLORS.white,
                                            border: `2px solid ${RADIO_COLORS.primary}40`
                                        }}
                                    >
                                        <div className="relative overflow-hidden aspect-video flex items-center justify-center group-hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: RADIO_COLORS.primary + '30' }}>
                                            <Play className="group-hover:scale-125 transition-transform" size={48} style={{ color: RADIO_COLORS.primary }} />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-xs uppercase tracking-widest mb-2 font-bold" style={{ color: RADIO_COLORS.accent }}>
                                                {episode.episode_number || episode.id}
                                            </p>
                                            <h3 className="font-bold uppercase text-sm mb-2 line-clamp-2" style={{ color: RADIO_COLORS.light }}>
                                                {episode.title}
                                            </h3>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-xs opacity-75 mb-3">
                                                {episode.host}
                                            </p>
                                            <div className="flex justify-between items-center text-xs"
                                                style={{ color: RADIO_COLORS.accent }}>
                                                <span>{episode.duration}min</span>
                                                <span>{episode.play_count} {t('radio_nocaima_plays') || 'reproducciones'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'events' && (
                        <section ref={eventsRef} id="radio-nocaima-events" className="pb-20">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg mb-8" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_events_section_desc') || 'Consulta los próximos eventos de la comunidad que transmitiremos o en los que participaremos.'}
                                </p>
                            </div>

                            <h2 className="text-3xl font-black uppercase mb-8" style={{ color: RADIO_COLORS.primary }}>
                                {t('radio_nocaima_upcoming_events') || 'Próximos Eventos'}
                            </h2>
                            <div className="space-y-4">
                                {events_calendar?.events?.slice(0, 6).map((event, idx) => (
                                    <div
                                        key={idx}
                                        className="p-6 rounded-lg transition-all cursor-pointer hover:scale-105"
                                        style={{
                                            backgroundColor: RADIO_COLORS.primary + '15',
                                            border: `2px solid ${RADIO_COLORS.primary}40`
                                        }}
                                        onClick={() => setExpandedEvent(expandedEvent === idx ? null : idx)}
                                    >
                                        <div className="flex gap-6 items-start">
                                            <div className="min-w-32">
                                                <p className="font-bold text-2xl" style={{ color: RADIO_COLORS.primary }}>
                                                    {event.date?.split(' ')[0]}
                                                </p>
                                                <p style={{ color: RADIO_COLORS.accent }} className="text-sm font-bold">
                                                    {event.time || event.time_start}
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold uppercase mb-2" style={{ color: RADIO_COLORS.light }}>
                                                    {event.title}
                                                </h3>
                                                <p style={{ color: RADIO_COLORS.light }} className="flex items-center gap-2 text-sm">
                                                    <MapPin size={16} style={{ color: RADIO_COLORS.accent }} />
                                                    {event.location}
                                                </p>
                                            </div>
                                            <div style={{ color: RADIO_COLORS.primary }}>
                                                <ChevronDown
                                                    size={24}
                                                    className={`transform transition-transform ${expandedEvent === idx ? 'rotate-180' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        {expandedEvent === idx && (
                                            <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${RADIO_COLORS.primary}40` }}>
                                                <p style={{ color: RADIO_COLORS.light }} className="mb-3 text-base leading-relaxed">
                                                    {event.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'map' && (
                        <section ref={mapRef} id="radio-nocaima-map" className="pb-20">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg mb-8" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_map_section_desc') || 'Explora nuestro mapa sonoro interactivo y descubre los puntos de audio especiales alrededor de Nocaima.'}
                                </p>
                            </div>

                            <h2 className="text-3xl font-black uppercase mb-8" style={{ color: RADIO_COLORS.primary }}>
                                {t('radio_nocaima_sound_map') || 'Mapa Sonoro Interactivo'}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div
                                    className="md:col-span-2 p-8 rounded-lg min-h-96 flex items-center justify-center"
                                    style={{
                                        backgroundColor: RADIO_COLORS.primary + '15',
                                        border: `2px solid ${RADIO_COLORS.primary}40`
                                    }}
                                >
                                    {!selectedSoundPoint ? (
                                        <div className="text-center">
                                            <MapPin style={{ color: RADIO_COLORS.primary }} className="mx-auto mb-4" size={56} />
                                            <p style={{ color: RADIO_COLORS.light }} className="text-lg mb-2 font-bold">
                                                {t('radio_nocaima_map_interactive') || 'Explora los puntos de audio'}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-sm opacity-75">
                                                {sound_map?.audio_points?.length} {t('radio_nocaima_locations_available') || 'ubicaciones disponibles'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <div className="flex items-center gap-3 mb-6">
                                                <MapPin style={{ color: RADIO_COLORS.primary }} size={32} />
                                                <div>
                                                    <p className="font-bold text-xl" style={{ color: RADIO_COLORS.light }}>
                                                        {selectedSoundPoint.title || selectedSoundPoint.name}
                                                    </p>
                                                    <p style={{ color: RADIO_COLORS.accent }} className="text-sm uppercase font-bold">
                                                        {t('radio_nocaima_audio_point_label') || 'Punto de Audio'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-6 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '20', border: `1px solid ${RADIO_COLORS.primary}40` }}>
                                                <p style={{ color: RADIO_COLORS.light }} className="text-base mb-4 leading-relaxed">
                                                    {selectedSoundPoint.description}
                                                </p>
                                                {selectedSoundPoint.narrator && (
                                                    <p style={{ color: RADIO_COLORS.accent }} className="text-sm mb-4 font-bold">
                                                        {t('radio_nocaima_narrator') || 'Narrador'}: {selectedSoundPoint.narrator}
                                                    </p>
                                                )}
                                                {(selectedSoundPoint.audio_url || selectedSoundPoint.audioUrl) && (
                                                    <audio controls className="w-full">
                                                        <source src={selectedSoundPoint.audio_url || selectedSoundPoint.audioUrl} />
                                                    </audio>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <p className="font-bold text-sm uppercase tracking-widest" style={{ color: RADIO_COLORS.accent }}>
                                        {t('radio_nocaima_locations') || 'Ubicaciones'}
                                    </p>
                                    {sound_map?.audio_points?.slice(0, 8).map((point, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedSoundPoint(point)}
                                            className="w-full text-left p-4 rounded-lg transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: selectedSoundPoint?.id === point.id
                                                    ? RADIO_COLORS.primary + '40'
                                                    : RADIO_COLORS.primary + '10',
                                                border: `2px solid ${selectedSoundPoint?.id === point.id ? RADIO_COLORS.primary : RADIO_COLORS.primary + '20'}`
                                            }}
                                        >
                                            <p className="font-bold text-sm" style={{ color: RADIO_COLORS.light }}>
                                                {point.title || point.name}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-xs opacity-75">
                                                {point.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'correspondent' && (
                        <section ref={correspondentRef} id="radio-nocaima-correspondent" className="pb-20">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg mb-8" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_correspondent_section_desc') || 'Colabora con Leones Stereo compartiendo tus historias, grabaciones y perspectivas.'}
                                </p>
                            </div>

                            {/* Correspondent Info */}
                            <div className="grid md:grid-cols-2 gap-12 mb-12">
                                <div>
                                    <h2 className="text-3xl font-black uppercase mb-6" style={{ color: RADIO_COLORS.primary }}>
                                        {t('radio_nocaima_correspondent_title') || 'Sé Corresponsal de Leones Stereo'}
                                    </h2>
                                    <p className="text-lg leading-relaxed mb-6" style={{ color: RADIO_COLORS.light }}>
                                        {t('radio_nocaima_correspondent_intro') || 'Los corresponsales son colaboradores que aportan contenido único a nuestra emisora.'}
                                    </p>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '15', border: `1px solid ${RADIO_COLORS.primary}40` }}>
                                            <p className="font-bold uppercase text-sm mb-2" style={{ color: RADIO_COLORS.accent }}>
                                                {t('radio_nocaima_correspondent_type_journalist') || 'Periodista / Reportero'}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-sm">
                                                {t('radio_nocaima_correspondent_desc_journalist') || 'Informa sobre eventos, noticias y asuntos de importancia comunitaria'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '15', border: `1px solid ${RADIO_COLORS.primary}40` }}>
                                            <p className="font-bold uppercase text-sm mb-2" style={{ color: RADIO_COLORS.accent }}>
                                                {t('radio_nocaima_correspondent_type_narrator') || 'Narrador / Productor de Historias'}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-sm">
                                                {t('radio_nocaima_correspondent_desc_narrator') || 'Crea narrativas sonoras, crónicas y contenido de audio especializado'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '15', border: `1px solid ${RADIO_COLORS.primary}40` }}>
                                            <p className="font-bold uppercase text-sm mb-2" style={{ color: RADIO_COLORS.accent }}>
                                                {t('radio_nocaima_correspondent_type_musician') || 'Músico / Productor Musical'}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-sm">
                                                {t('radio_nocaima_correspondent_desc_musician') || 'Contribuye con música, mezclas y contenido musical para la programación'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '15', border: `1px solid ${RADIO_COLORS.primary}40` }}>
                                            <p className="font-bold uppercase text-sm mb-2" style={{ color: RADIO_COLORS.accent }}>
                                                {t('radio_nocaima_correspondent_type_cultural') || 'Actividades Culturales / Comunitarias'}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-sm">
                                                {t('radio_nocaima_correspondent_desc_cultural') || 'Organiza y promociona eventos culturales, talleres y actividades comunitarias'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Correspondent Form */}
                                <div>
                                    <div className="p-8 rounded-lg" style={{
                                        backgroundColor: RADIO_COLORS.white,
                                        border: `2px solid ${RADIO_COLORS.primary}40`
                                    }}>
                                        <h3 className="text-2xl font-bold uppercase mb-6" style={{ color: RADIO_COLORS.primary }}>
                                            {t('radio_nocaima_correspondent_form_title') || 'Formulario de Corresponsal'}
                                        </h3>

                                        {correspondentSubmitted ? (
                                            <div className="p-6 rounded-lg text-center" style={{
                                                backgroundColor: RADIO_COLORS.primary + '20',
                                                border: `2px solid ${RADIO_COLORS.primary}`
                                            }}>
                                                <p className="text-lg font-bold mb-2" style={{ color: RADIO_COLORS.primary }}>
                                                    ✓ {t('radio_nocaima_correspondent_form_success') || 'Gracias por tu interés'}
                                                </p>
                                                <p style={{ color: RADIO_COLORS.light }}>
                                                    {t('radio_nocaima_correspondent_form_followup') || 'Te contactaremos pronto con más información'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCorrespondentSubmitted(false);
                                                        setCorrespondentForm({
                                                            name: '',
                                                            email: '',
                                                            phone: '',
                                                            collaborationType: '',
                                                            description: ''
                                                        });
                                                    }}
                                                    className="mt-6 px-6 py-2 font-bold uppercase text-sm transition-transform hover:scale-105"
                                                    style={{
                                                        backgroundColor: RADIO_COLORS.primary,
                                                        color: RADIO_COLORS.white
                                                    }}
                                                >
                                                    {t('radio_nocaima_correspondent_form_resend') || 'Enviar otra solicitud'}
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                setCorrespondentSubmitted(true);
                                            }} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold uppercase mb-2" style={{ color: RADIO_COLORS.primary }}>
                                                        {t('radio_nocaima_correspondent_form_name') || 'Nombre Completo'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={correspondentForm.name}
                                                        onChange={(e) => setCorrespondentForm({ ...correspondentForm, name: e.target.value })}
                                                        className="w-full px-4 py-2 rounded border"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.white,
                                                            borderColor: RADIO_COLORS.primary + '40',
                                                            color: RADIO_COLORS.light
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold uppercase mb-2" style={{ color: RADIO_COLORS.primary }}>
                                                        {t('radio_nocaima_correspondent_form_email') || 'Correo Electrónico'}
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={correspondentForm.email}
                                                        onChange={(e) => setCorrespondentForm({ ...correspondentForm, email: e.target.value })}
                                                        className="w-full px-4 py-2 rounded border"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.white,
                                                            borderColor: RADIO_COLORS.primary + '40',
                                                            color: RADIO_COLORS.light
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold uppercase mb-2" style={{ color: RADIO_COLORS.primary }}>
                                                        {t('radio_nocaima_correspondent_form_phone') || 'Teléfono'}
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={correspondentForm.phone}
                                                        onChange={(e) => setCorrespondentForm({ ...correspondentForm, phone: e.target.value })}
                                                        className="w-full px-4 py-2 rounded border"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.white,
                                                            borderColor: RADIO_COLORS.primary + '40',
                                                            color: RADIO_COLORS.light
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold uppercase mb-2" style={{ color: RADIO_COLORS.primary }}>
                                                        {t('radio_nocaima_correspondent_form_collaboration') || '¿Qué tipo de colaboración te interesa?'}
                                                    </label>
                                                    <select
                                                        required
                                                        value={correspondentForm.collaborationType}
                                                        onChange={(e) => setCorrespondentForm({ ...correspondentForm, collaborationType: e.target.value })}
                                                        className="w-full px-4 py-2 rounded border"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.white,
                                                            borderColor: RADIO_COLORS.primary + '40',
                                                            color: RADIO_COLORS.light
                                                        }}
                                                    >
                                                        <option value="">{t('radio_nocaima_correspondent_form_select_option') || 'Selecciona una opción'}</option>
                                                        <option value="journalist">{t('radio_nocaima_correspondent_type_journalist') || 'Periodista'}</option>
                                                        <option value="narrator">{t('radio_nocaima_correspondent_type_narrator') || 'Narrador'}</option>
                                                        <option value="musician">{t('radio_nocaima_correspondent_type_musician') || 'Músico'}</option>
                                                        <option value="cultural">{t('radio_nocaima_correspondent_type_cultural') || 'Cultural'}</option>
                                                        <option value="sports">{t('radio_nocaima_correspondent_type_sports') || 'Deportes'}</option>
                                                        <option value="other">{t('radio_nocaima_correspondent_type_other') || 'Otro'}</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold uppercase mb-2" style={{ color: RADIO_COLORS.primary }}>
                                                        {t('radio_nocaima_correspondent_form_description') || 'Cuéntanos sobre tu experiencia'}
                                                    </label>
                                                    <textarea
                                                        required
                                                        rows="4"
                                                        value={correspondentForm.description}
                                                        onChange={(e) => setCorrespondentForm({ ...correspondentForm, description: e.target.value })}
                                                        className="w-full px-4 py-2 rounded border"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.white,
                                                            borderColor: RADIO_COLORS.primary + '40',
                                                            color: RADIO_COLORS.light
                                                        }}
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full px-6 py-3 font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                                                    style={{
                                                        backgroundColor: RADIO_COLORS.primary,
                                                        color: RADIO_COLORS.white
                                                    }}
                                                >
                                                    {t('radio_nocaima_correspondent_form_submit') || 'Enviar Solicitud'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'support' && (
                        <section ref={supportRef} id="radio-nocaima-support" className="pb-16">
                            {/* Section Description */}
                            <div className="p-6 rounded-lg mb-8" style={{
                                backgroundColor: RADIO_COLORS.primary + '15',
                                border: `2px solid ${RADIO_COLORS.primary}40`
                            }}>
                                <p className="text-lg leading-relaxed" style={{ color: RADIO_COLORS.light }}>
                                    {t('radio_nocaima_support_section_desc') || 'Apoya el trabajo de Leones Stereo con tu contribución. Elige tu forma de participar en la sostenibilidad de la emisora.'}
                                </p>
                            </div>

                            <h2 className="text-3xl font-black uppercase mb-8" style={{ color: RADIO_COLORS.primary }}>
                                {t('radio_nocaima_support_station') || 'Apoya Leones Stereo'}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {support_page?.donation_options?.slice(0, 4).map((option, idx) => {
                                    const titleKey = `radio_nocaima_donation_${option.id}_title`;
                                    const descKey = `radio_nocaima_donation_${option.id}_desc`;
                                    return (
                                        <div
                                            key={idx}
                                            className="p-8 rounded-lg hover:scale-105 transition-transform"
                                            style={{
                                                backgroundColor: RADIO_COLORS.primary + '15',
                                                border: `2px solid ${RADIO_COLORS.primary}40`
                                            }}
                                        >
                                            <h3 className="font-bold uppercase text-lg mb-3" style={{ color: RADIO_COLORS.light }}>
                                                {t(titleKey) || option.title}
                                            </h3>
                                            <p className="text-4xl font-black mb-4" style={{ color: RADIO_COLORS.primary }}>
                                                {option.amount_display || option.amount}
                                            </p>
                                            <p style={{ color: RADIO_COLORS.light }} className="text-base mb-6 leading-relaxed">
                                                {t(descKey) || option.description}
                                            </p>
                                            <ul className="space-y-3 mb-8">
                                                {option.benefits?.slice(0, 3).map((benefit, bIdx) => (
                                                    <li key={bIdx} className="flex items-start gap-3">
                                                        <span style={{ color: RADIO_COLORS.accent }} className="mt-1">✓</span>
                                                        <span style={{ color: RADIO_COLORS.light }}>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDonationOption(option);
                                                    handleDonateClick(option);
                                                }}
                                                className="w-full px-6 py-3 font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                                                style={{
                                                    backgroundColor: RADIO_COLORS.primary,
                                                    color: RADIO_COLORS.white,
                                                    border: `2px solid ${RADIO_COLORS.primary}`
                                                }}
                                            >
                                                {t('radio_nocaima_donate') || 'Contribuir'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            {selectedDonationOption && (
                                <div className="p-8 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '10', border: `2px solid ${RADIO_COLORS.primary}40` }}>
                                    <p className="text-sm uppercase font-bold tracking-widest mb-3" style={{ color: RADIO_COLORS.accent }}>
                                        {t('radio_nocaima_selected_support') || 'Tu Contribución'}
                                    </p>
                                    <h3 className="text-2xl font-bold uppercase mb-3" style={{ color: RADIO_COLORS.light }}>
                                        {t(`radio_nocaima_donation_${selectedDonationOption.id}_title`) || selectedDonationOption.title}
                                    </h3>
                                    <p style={{ color: RADIO_COLORS.light }} className="text-base mb-4 leading-relaxed">
                                        {t(`radio_nocaima_donation_${selectedDonationOption.id}_desc`) || selectedDonationOption.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 items-center mb-6">
                                        <span className="text-3xl font-black" style={{ color: RADIO_COLORS.primary }}>
                                            {selectedDonationOption.amount_display || selectedDonationOption.amount}
                                        </span>
                                        <span className="text-sm uppercase font-bold" style={{ color: RADIO_COLORS.accent }}>
                                            {selectedDonationOption.frequency || selectedDonationOption.type}
                                        </span>
                                    </div>
                                    {support_page?.payment_methods?.length > 0 && (
                                        <div>
                                            <p className="text-sm uppercase font-bold tracking-wider mb-4" style={{ color: RADIO_COLORS.accent }}>
                                                {t('radio_nocaima_payment_methods') || 'Selecciona método de pago'}
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {support_page.payment_methods.map((method) => (
                                                    <button
                                                        key={method}
                                                        onClick={() => handlePaymentMethodSelect(method)}
                                                        className="px-4 py-3 text-sm uppercase font-bold tracking-wider transition-all hover:scale-105"
                                                        style={{
                                                            backgroundColor: RADIO_COLORS.primary + '20',
                                                            border: `2px solid ${RADIO_COLORS.primary}40`,
                                                            color: RADIO_COLORS.light
                                                        }}
                                                    >
                                                        {method.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Transparency Section */}
                            <div className="mt-12 p-8 rounded-lg" style={{ backgroundColor: RADIO_COLORS.primary + '15', border: `2px solid ${RADIO_COLORS.primary}40` }}>
                                <div className="flex gap-4 items-start mb-8">
                                    <AlertCircle style={{ color: RADIO_COLORS.primary }} className="flex-shrink-0 mt-1" size={28} />
                                    <div>
                                        <p className="font-bold text-xl uppercase mb-2" style={{ color: RADIO_COLORS.primary }}>
                                            {t('radio_nocaima_transparency') || 'Transparencia'}
                                        </p>
                                        <p style={{ color: RADIO_COLORS.light }} className="text-base leading-relaxed">
                                            {support_page?.transparency_text || 'Nos comprometemos con la transparencia en el manejo de contribuciones. Aquí puedes ver todas las transacciones registradas.'}
                                        </p>
                                    </div>
                                </div>

                                {transactions.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg uppercase mb-6" style={{ color: RADIO_COLORS.primary }}>
                                            {t('radio_nocaima_transactions_title') || 'Transacciones Registradas'}
                                        </h3>
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {transactions.map((tx) => (
                                                <div
                                                    key={tx.id}
                                                    className="p-4 rounded-lg"
                                                    style={{
                                                        backgroundColor: RADIO_COLORS.primary + '10',
                                                        border: `1px solid ${RADIO_COLORS.primary}40`
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="font-mono font-bold text-sm" style={{ color: RADIO_COLORS.accent }}>
                                                            {tx.id}
                                                        </span>
                                                        <span style={{ color: RADIO_COLORS.light }} className="text-xs opacity-75">
                                                            {new Date(tx.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="uppercase text-xs font-bold mb-1" style={{ color: RADIO_COLORS.accent }}>
                                                                {t('radio_nocaima_transaction_donor') || 'Donante'}
                                                            </p>
                                                            <p style={{ color: RADIO_COLORS.light }} className="font-mono">
                                                                {tx.donor_name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="uppercase text-xs font-bold mb-1" style={{ color: RADIO_COLORS.accent }}>
                                                                {t('radio_nocaima_transaction_amount') || 'Monto'}
                                                            </p>
                                                            <p style={{ color: RADIO_COLORS.primary }} className="font-bold font-mono">
                                                                {tx.donation_amount}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="uppercase text-xs font-bold mb-1" style={{ color: RADIO_COLORS.accent }}>
                                                                {t('radio_nocaima_transaction_method') || 'Método'}
                                                            </p>
                                                            <p style={{ color: RADIO_COLORS.light }} className="font-mono">
                                                                {tx.payment_method?.replace('_', ' ')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="uppercase text-xs font-bold mb-1" style={{ color: RADIO_COLORS.accent }}>
                                                                {t('radio_nocaima_transaction_status') || 'Estado'}
                                                            </p>
                                                            <p className="font-mono text-xs uppercase font-bold" style={{ color: RADIO_COLORS.accent }}>
                                                                ✓ {tx.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <div className="py-16 px-8" style={{ backgroundColor: RADIO_COLORS.white, borderTop: `2px solid ${RADIO_COLORS.primary}` }}>
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-black uppercase mb-4" style={{ color: RADIO_COLORS.primary }}>
                            {t('radio_nocaima_join_community') || '¿Quieres Participar?'}
                        </h2>
                        <p style={{ color: RADIO_COLORS.light }} className="mb-8 max-w-2xl mx-auto text-lg">
                            {t('radio_nocaima_correspondent_intro') || 'Envía tus historias, grabaciones y noticias de la comunidad'}
                        </p>
                        <button
                            type="button"
                            onClick={() => handleCtaClick({ url: demoContent?.correspondents_form?.whatsapp_link, action: 'scroll_to_correspondent' })}
                            className="px-8 py-3 font-bold uppercase tracking-wider text-lg transition-transform hover:scale-105"
                            style={{
                                backgroundColor: RADIO_COLORS.primary,
                                color: RADIO_COLORS.white,
                                border: `2px solid ${RADIO_COLORS.primary}`
                            }}
                        >
                            {t('radio_nocaima_become_correspondent') || 'Ser Corresponsal'}
                        </button>
                    </div>
                </div>

                <div className="py-8 px-8 text-center" style={{ backgroundColor: RADIO_COLORS.white, borderTop: `2px solid ${RADIO_COLORS.primary}` }}>
                    <p style={{ color: RADIO_COLORS.light }} className="text-xs uppercase tracking-wider font-bold">
                        <span style={{ color: RADIO_COLORS.primary }} className="font-mono">[DEMO LEONES STEREO]</span> Proyecto de demostración para Leones Stereo 107.4 FM
                    </p>
                </div>

                {/* Payment Modal */}
                {
                    paymentFlow && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-dark-bg border border-white/10 rounded-lg max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
                                {paymentFlow === 'donor-info' && (
                                    <>
                                        <h2 className="text-[#00e9fa] font-mono text-lg uppercase tracking-wider mb-2">
                                            {t('radio_nocaima_donor_info_title') || 'Información del Donante'}
                                        </h2>
                                        <p className="text-3xl font-bold text-white mb-6">
                                            {selectedDonationOption?.amount_display || selectedDonationOption?.amount}
                                        </p>
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label className="block text-gray-300 text-xs font-mono uppercase tracking-wider mb-2">
                                                    {t('radio_nocaima_donor_name') || 'Nombre Completo'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={donorInfo.name}
                                                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                                                    placeholder={t('radio_nocaima_donor_name_placeholder') || 'Tu nombre'}
                                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-500 font-mono text-sm rounded-sm focus:border-[#00e9fa] focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 text-xs font-mono uppercase tracking-wider mb-2">
                                                    {t('radio_nocaima_donor_email') || 'Correo Electrónico'}
                                                </label>
                                                <input
                                                    type="email"
                                                    value={donorInfo.email}
                                                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                                                    placeholder={t('radio_nocaima_donor_email_placeholder') || 'tu@email.com'}
                                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-500 font-mono text-sm rounded-sm focus:border-[#00e9fa] focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-300 text-xs font-mono uppercase tracking-wider mb-2">
                                                    {t('radio_nocaima_donor_phone') || 'Teléfono (Opcional)'}
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={donorInfo.phone}
                                                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                                                    placeholder={t('radio_nocaima_donor_phone_placeholder') || '+57 300 000 0000'}
                                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-500 font-mono text-sm rounded-sm focus:border-[#00e9fa] focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (donorInfo.name.trim() && donorInfo.email.trim()) {
                                                    setPaymentFlow('payment-method-select');
                                                }
                                            }}
                                            disabled={!donorInfo.name.trim() || !donorInfo.email.trim()}
                                            className="w-full px-4 py-2 bg-[#00e9fa] text-black font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                                        >
                                            {t('radio_nocaima_donor_continue') || 'Continuar al Pago'}
                                        </button>
                                        <button
                                            onClick={handleClosePaymentModal}
                                            className="w-full px-4 py-2 border border-white/20 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
                                        >
                                            {t('radio_nocaima_donor_cancel') || 'Cancelar'}
                                        </button>
                                    </>
                                )}

                                {paymentFlow === 'payment-method-select' && (
                                    <>
                                        <h2 className="text-[#00e9fa] font-mono text-lg uppercase tracking-wider mb-2">
                                            {t(`radio_nocaima_donation_${selectedDonationOption?.id}_title`) || selectedDonationOption?.title || 'Contribución'}
                                        </h2>
                                        <p className="text-3xl font-bold text-white mb-6">
                                            {selectedDonationOption?.amount_display || selectedDonationOption?.amount}
                                        </p>
                                        <h3 className="text-[#00e9fa] font-mono text-sm uppercase tracking-wider mb-2">
                                            {t('radio_nocaima_payment_methods') || 'Métodos de Pago'}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            {t('radio_nocaima_payment_method_selected') || 'Selecciona tu método de pago preferido'}
                                        </p>
                                        <div className="space-y-3 mb-6">
                                            {support_page?.payment_methods?.map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => handlePaymentMethodSelect(method)}
                                                    className="w-full p-4 border border-white/20 hover:border-[#00e9fa] bg-white/5 hover:bg-white/10 text-white hover:text-[#00e9fa] font-mono text-sm uppercase tracking-wider transition-all duration-300 rounded-sm"
                                                >
                                                    {method.replace('_', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setPaymentFlow('donor-info')}
                                            className="w-full px-4 py-2 border border-white/20 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
                                        >
                                            {t('radio_nocaima_back_to_donation') || 'Volver'}
                                        </button>
                                    </>
                                )}

                                {paymentFlow === 'processing' && (
                                    <div className="text-center">
                                        <div className="mb-6">
                                            <div className="inline-block">
                                                <div className="w-16 h-16 border-4 border-white/20 border-t-[#00e9fa] rounded-full animate-spin"></div>
                                            </div>
                                        </div>
                                        <h2 className="text-[#00e9fa] font-mono text-lg uppercase tracking-wider mb-2">
                                            {t('radio_nocaima_processing_payment') || 'Procesando Pago'}
                                        </h2>
                                        <p className="text-gray-400 text-sm">
                                            {selectedPaymentMethod?.replace('_', ' ')} • {selectedDonationOption?.amount_display || selectedDonationOption?.amount}
                                        </p>
                                    </div>
                                )}

                                {paymentFlow === 'complete' && (
                                    <>
                                        <div className="text-center mb-6">
                                            <div className="inline-block mb-4">
                                                <div className="w-16 h-16 bg-[#00e9fa]/20 border-2 border-[#00e9fa] rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-[#00e9fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h2 className="text-[#00e9fa] font-mono text-lg uppercase tracking-wider mb-2">
                                                {t('radio_nocaima_payment_complete') || 'Pago Completado'}
                                            </h2>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-3 text-sm mb-6">
                                            <p className="text-gray-400">
                                                <span className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                                                    {t('radio_nocaima_payment_transaction') || 'Número de Transacción'}
                                                </span>
                                                <span className="text-[#00e9fa] font-mono break-all">{transactionId}</span>
                                            </p>
                                            <p className="text-gray-400">
                                                <span className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                                                    {t('radio_nocaima_payment_amount') || 'Monto'}
                                                </span>
                                                <span className="text-white font-mono">{selectedDonationOption?.amount_display || selectedDonationOption?.amount}</span>
                                            </p>
                                            <p className="text-gray-400">
                                                <span className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                                                    {t('radio_nocaima_payment_date') || 'Fecha'}
                                                </span>
                                                <span className="text-white font-mono">{new Date().toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                        <p className="text-gray-300 text-center text-sm mb-6">
                                            {t('radio_nocaima_payment_success') || 'Gracias por tu contribución a Estación Comunitaria Nocaima'}
                                        </p>
                                        <button
                                            onClick={handleClosePaymentModal}
                                            className="w-full px-4 py-2 bg-[#00e9fa] text-black font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors"
                                        >
                                            {t('radio_nocaima_continue') || 'Continuar'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                }
            </div >
        </Layout >
    );
}