import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink, Code, Video, Image as ImageIcon, Layers } from 'lucide-react';
import Layout from '../components/Layout';
import rendersConfig from '../data/rendersConfig.json';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

const PortfolioReelsPage = () => {
    const { t, lang } = useLanguage();
    useAnalytics('Portfolio', 'portfolio');
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    const backgroundRef = React.useRef(null);

    // Forzar re-render cuando cambia el idioma
    React.useEffect(() => {
        // El hook t ya re-renderiza al cambiar de idioma
    }, [lang]);

    // SEO metadata para la página de portafolio/reels
    React.useEffect(() => {
        const setMeta = (name, content) => {
            if (!content) return;
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('name', name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        const setProperty = (property, content) => {
            if (!content) return;
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://xlerion.com';
        const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://xlerion.com/portafolio';

        const metaTitle = `Xlerion | ${t('portfolio_page_title')}`;
        const metaDescription = t('portfolio_page_intro');
        const metaImage = `${origin}/images/convocatorias-alianzas-parallax.jpg`;

        document.title = metaTitle;
        setMeta('description', metaDescription);
        setMeta('robots', 'index, follow');

        setProperty('og:title', metaTitle);
        setProperty('og:description', metaDescription);
        setProperty('og:type', 'website');
        setProperty('og:url', pageUrl);
        setProperty('og:image', metaImage);

        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', metaTitle);
        setMeta('twitter:description', metaDescription);
        setMeta('twitter:image', metaImage);
    }, [t, lang]);

    // Parallax suave para el fondo
    React.useEffect(() => {
        let ticking = false;

        const updateParallax = () => {
            if (!backgroundRef.current) return;
            const offset = window.scrollY * 0.2;
            backgroundRef.current.style.transform = `translateY(${offset}px) scale(1.05)`;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Categorías de filtrado - se actualizan cuando cambia el idioma
    const categories = React.useMemo(() => [
        { id: 'all', label: t('portfolio_category_all') },
        { id: 'videos', label: t('portfolio_category_videos') },
        { id: 'demos', label: t('portfolio_category_demos') },
        { id: 'design', label: t('portfolio_category_design') },
        { id: '3d', label: t('portfolio_category_3d') }
    ], [t]);

    // Portfolio items - Videos, imágenes, demos - se actualizan cuando cambia el idioma
    const pickRandomRenderFilename = () => {
        const arr = Array.isArray(rendersConfig?.renders) ? rendersConfig.renders : [];
        if (arr.length === 0) return null;
        const i = Math.floor(Math.random() * arr.length);
        return arr[i].filename;
    };

    const randomFilename = pickRandomRenderFilename();
    const rendersThumbnail = randomFilename
        ? `/images/renders/${randomFilename}`
        : '/images/portfolio/3d-placeholder.png';

    const portfolioItems = React.useMemo(() => ([
        {
            id: 1,
            type: 'video',
            category: 'videos',
            title: t('portfolio_item_1_title'),
            description: t('portfolio_item_1_desc'),
            thumbnail: '/total-darkness/images/xlerions-totaldarkness.png',
            videoUrl: '/videos/total-darkness-demo.mp4',
            tags: ['MMIG', '3D', 'Interactive']
        },
        {
            id: 2,
            type: 'demo',
            category: 'demos',
            title: t('portfolio_item_2_title'),
            description: t('portfolio_item_2_desc'),
            thumbnail: '/images/portfolio/BlockChain.jpg',
            demoUrl: '/toolkit/validacion',
            tags: ['Toolkit', 'JavaScript', 'Modular']
        },
        {
            id: 3,
            type: 'demo',
            category: 'demos',
            title: t('portfolio_item_3_title'),
            description: t('portfolio_item_3_desc'),
            thumbnail: '/images/portfolio/facial-recognition-thumb.svg',
            demoUrl: '#',
            tags: ['AI', 'Computer Vision', 'Security']
        },
        {
            id: 4,
            type: 'image',
            category: '3d',
            title: t('portfolio_item_4_title'),
            description: t('portfolio_item_4_desc'),
            thumbnail: rendersThumbnail,
            galleryUrl: '/portfolio/renders-3d',
            tags: ['Blender', '3D Modeling', 'Animation']
        },
        {
            id: 5,
            type: 'demo',
            category: 'demos',
            title: t('portfolio_item_5_title'),
            description: t('portfolio_item_5_desc'),
            thumbnail: '/images/portfolio/greenwave-3d-thumb.jpg',
            demoUrl: '/demo/greenwave-3d',
            tags: ['AI', 'Algorithm', 'Adaptive', 'Real-time', '3D']
        },
        {
            id: 6,
            type: 'image',
            category: 'design',
            title: t('portfolio_item_6_title'),
            description: t('portfolio_item_6_desc'),
            thumbnail: '/images/legal-privacidad-parallax.jpg',
            fullImage: '/images/legal-privacidad-parallax.jpg',
            tags: ['Documentation', 'UX', 'Architecture'],
            link: '/documentacion'
        }
        ,
        {
            id: 7,
            type: 'demo',
            category: 'design',
            title: 'Currículum — Miguel Rodríguez',
            description: 'Perfil visual y resumen profesional (versión descargable).',
            thumbnail: '/images/portfolio/3d-placeholder.png',
            link: '/curriculum.html',
            tags: ['CV', 'Profile', 'Download']
        },
        {
            id: 8,
            type: 'demo',
            category: 'demos',
            title: t('portfolio_item_8_title'),
            description: t('portfolio_item_8_desc'),
            thumbnail: '/images/portfolio/videogames-thumb.jpg',
            link: '/proyectos/videojuegos',
            tags: ['Unity 3D', 'C#', 'Game Development']
        }
    ]), [t, rendersThumbnail]);

    // Filtrar items por categoría
    const filteredItems = selectedCategory === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === selectedCategory);

    // Handler para abrir modal o navegar a galería
    const openItem = (item) => {
        // If item has an explicit link, navigate or open it
        if (item && item.link) {
            try {
                if (item.link.endsWith('.html') || item.link.startsWith('http')) {
                    // Static file or external link: navigate browser directly
                    window.location.href = item.link;
                } else {
                    // Internal SPA route
                    navigate(item.link);
                }
            } catch (e) {
                // fallback
                window.location.href = item.link;
            }
            return;
        }

        if (item.id === 4) {
            // Para 3D renders, navegar a la galería
            navigate('/portfolio/renders-3d');
        } else {
            // Para otros items, abrir el modal
            setSelectedItem(item);
        }
    };

    // Handler para cerrar modal
    const closeModal = () => {
        setSelectedItem(null);
    };

    const FacialRecognitionDemo = ({ t }) => {
        const [scanning, setScanning] = useState(false);
        const [detected, setDetected] = useState(null);
        const [scanProgress, setScanProgress] = useState(0);
        const [liveMode, setLiveMode] = useState(false);
        const [stream, setStream] = useState(null);
        const [cameraError, setCameraError] = useState(null);
        const videoRef = React.useRef(null);

        // Cleanup stream on unmount
        React.useEffect(() => {
            return () => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            };
        }, [stream]);

        const enableCamera = async () => {
            try {
                setCameraError(null);
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: 'user' }
                });
                setStream(mediaStream);
                setLiveMode(true);

                // Wait for next render to set video source
                setTimeout(() => {
                    if (videoRef.current && mediaStream) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.play().catch(err => {
                            console.error('Video play error:', err);
                        });
                    }
                }, 100);
            } catch (err) {
                console.error('Camera error:', err);
                if (err.name === 'NotAllowedError') {
                    setCameraError(t('portfolio_facial_permission_denied'));
                } else if (err.name === 'NotFoundError') {
                    setCameraError(t('portfolio_facial_no_camera'));
                } else {
                    setCameraError(t('portfolio_facial_camera_error'));
                }
            }
        };

        const disableCamera = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            setLiveMode(false);
            setDetected(null);
            setScanning(false);
        };

        const startScan = () => {
            setScanning(true);
            setDetected(null);
            setScanProgress(0);

            const progressInterval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);

            setTimeout(() => {
                const rand = Math.random();
                let result;
                if (rand < 0.25) {
                    result = 'authorized';
                } else if (rand < 0.5) {
                    result = 'unauthorized';
                } else if (rand < 0.75) {
                    result = 'wanted';
                } else {
                    result = 'clean';
                }
                setDetected(result);
                setScanning(false);
                clearInterval(progressInterval);
            }, 2000);
        };

        const stopScan = () => {
            setScanning(false);
            setDetected(null);
            setScanProgress(0);
        };

        return (
            <div className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => liveMode ? disableCamera() : setDetected(null)}
                        className={`flex-1 px-3 py-2 rounded font-mono text-xs transition-colors ${!liveMode
                            ? 'bg-[#00e9fa] text-black'
                            : 'bg-[#333436] text-gray-400 hover:bg-[#404040]'
                            }`}
                    >
                        {t('portfolio_facial_mode_simulated')}
                    </button>
                    <button
                        onClick={liveMode ? disableCamera : enableCamera}
                        className={`flex-1 px-3 py-2 rounded font-mono text-xs transition-colors ${liveMode
                            ? 'bg-[#00e9fa] text-black'
                            : 'bg-[#333436] text-gray-400 hover:bg-[#404040]'
                            }`}
                    >
                        {liveMode ? '📹 ' + t('portfolio_facial_mode_live') : t('portfolio_facial_enable_camera')}
                    </button>
                </div>

                {/* Camera Error */}
                {cameraError && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-xs font-mono">{cameraError}</p>
                    </div>
                )}

                {/* Camera Feed Simulation */}
                <div className="relative bg-[#0f1115] border-2 border-[#00e9fa]/30 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                    {/* Live Video */}
                    {liveMode && stream && (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            onLoadedMetadata={(e) => {
                                e.target.play().catch(err => console.error('Play error:', err));
                            }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}

                    {/* Scanning Grid */}
                    {scanning && (
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-30 z-10">
                            {Array.from({ length: 48 }).map((_, i) => (
                                <div key={i} className="border border-[#00e9fa]/20"></div>
                            ))}
                        </div>
                    )}

                    {/* Face Detection Box */}
                    <div className={`relative z-20 ${liveMode && stream ? 'bg-black/60 rounded-lg p-4' : ''}`}>
                        {!scanning && !detected && (
                            <div className="text-center">
                                <div className="text-6xl mb-3">👤</div>
                                <p className="text-gray-500 text-sm font-mono">{t('portfolio_facial_camera_feed')}</p>
                            </div>
                        )}

                        {scanning && (
                            <div className="text-center">
                                <div className="relative">
                                    <div className="text-6xl mb-3 animate-pulse">👤</div>
                                    <div className="absolute inset-0 border-4 border-[#00e9fa] rounded-lg animate-ping"></div>
                                </div>
                                <p className="text-[#00e9fa] text-sm font-mono mt-4">{t('portfolio_facial_scanning')}</p>
                                <div className="w-48 h-2 bg-black/50 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-[#00e9fa] transition-all duration-200"
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {!scanning && detected !== null && (
                            <div className="text-center">
                                {detected === 'authorized' && (
                                    <>
                                        <div className="text-6xl mb-3 text-green-400">✓</div>
                                        <p className="text-sm font-bold text-green-400">{t('portfolio_facial_authorized')}</p>
                                        <p className="text-gray-400 text-xs mt-2 font-mono">{t('portfolio_facial_detected')}</p>
                                    </>
                                )}
                                {detected === 'unauthorized' && (
                                    <>
                                        <div className="text-6xl mb-3 text-red-400">✗</div>
                                        <p className="text-sm font-bold text-red-400">{t('portfolio_facial_unauthorized')}</p>
                                        <p className="text-gray-400 text-xs mt-2 font-mono">{t('portfolio_facial_detected')}</p>
                                    </>
                                )}
                                {detected === 'wanted' && (
                                    <>
                                        <div className="text-6xl mb-3 text-red-600 animate-pulse">🚨</div>
                                        <p className="text-sm font-bold text-red-600 uppercase">{t('portfolio_facial_wanted')}</p>
                                        <p className="text-red-400 text-xs mt-2 font-mono">{t('portfolio_facial_wanted_desc')}</p>
                                        <div className="mt-2 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded">
                                            <p className="text-[10px] text-red-300 font-mono">ID: #{Math.floor(Math.random() * 9999)}</p>
                                        </div>
                                    </>
                                )}
                                {detected === 'clean' && (
                                    <>
                                        <div className="text-6xl mb-3 text-blue-400">👤</div>
                                        <p className="text-sm font-bold text-blue-400">{t('portfolio_facial_clean_record')}</p>
                                        <p className="text-blue-300 text-xs mt-2 font-mono">{t('portfolio_facial_clean_desc')}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Scanning Line Effect */}
                    {scanning && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00e9fa] to-transparent animate-scan"></div>
                    )}
                </div>

                {/* Control Button */}
                <button
                    onClick={scanning ? stopScan : startScan}
                    className={`w-full px-4 py-3 rounded font-mono text-sm transition-colors ${scanning
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#00e9fa] hover:bg-[#00d4e0] text-black'
                        }`}
                >
                    {scanning ? t('portfolio_facial_stop_scan') : t('portfolio_facial_start_scan')}
                </button>
            </div>
        );
    };

    // Transit System Demo Component
    const TransitSystemDemo = ({ t }) => {
        const [running, setRunning] = useState(false);
        const [lanes, setLanes] = useState({
            north: { light: 'red', passed: 0, waiting: 0 },
            south: { light: 'red', passed: 0, waiting: 0 },
            east: { light: 'red', passed: 0, waiting: 0 },
            west: { light: 'red', passed: 0, waiting: 0 }
        });
        const [metrics, setMetrics] = useState({
            totalVehicles: 0,
            avgWaitTime: 0,
            efficiency: 0
        });
        // Dual lanes: incoming (waiting) and outgoing (passing)
        const [_incomingVehicles, setIncomingVehicles] = useState({
            north: [],
            south: [],
            east: [],
            west: []
        });
        const [outgoingVehicles, setOutgoingVehicles] = useState({
            north: [],
            south: [],
            east: [],
            west: []
        });
        const intervalRef = React.useRef(null);
        const animationRef = React.useRef(null);
        const cycleRef = React.useRef(0);

        React.useEffect(() => {
            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (animationRef.current) clearInterval(animationRef.current);
            };
        }, []);

        const startSimulation = () => {
            setRunning(true);
            cycleRef.current = 0;

            // Vehicle animation interval - slower for realism
            animationRef.current = setInterval(() => {
                // Move outgoing vehicles (green - already released)
                setOutgoingVehicles(prev => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach(lane => {
                        updated[lane] = updated[lane]
                            .map(v => {
                                const newPosition = v.position + 1.5; // Slower movement
                                // Count when vehicle exits
                                if (newPosition >= 100 && !v.counted) {
                                    setLanes(prevLanes => {
                                        const newLanes = {
                                            ...prevLanes,
                                            [lane]: {
                                                ...prevLanes[lane],
                                                passed: prevLanes[lane].passed + 1
                                            }
                                        };

                                        // Reset simulation every 100 vehicles
                                        const totalPassed = Object.values(newLanes).reduce((sum, l) => sum + l.passed, 0);
                                        if (totalPassed >= 100) {
                                            // Reset counters and generate new random vehicles
                                            Object.keys(newLanes).forEach(l => {
                                                newLanes[l].passed = 0;
                                                newLanes[l].waiting = 0;
                                            });

                                            // Clear all vehicles
                                            setIncomingVehicles({
                                                north: [],
                                                south: [],
                                                east: [],
                                                west: []
                                            });
                                            setOutgoingVehicles({
                                                north: [],
                                                south: [],
                                                east: [],
                                                west: []
                                            });

                                            // Generate new random starting vehicles
                                            setTimeout(() => {
                                                setIncomingVehicles({
                                                    north: Array(Math.floor(Math.random() * 8) + 2).fill(0).map((_, i) => ({
                                                        id: Date.now() + Math.random() + i,
                                                        position: 0,
                                                        counted: false
                                                    })),
                                                    south: Array(Math.floor(Math.random() * 12) + 3).fill(0).map((_, i) => ({
                                                        id: Date.now() + Math.random() + i + 100,
                                                        position: 0,
                                                        counted: false
                                                    })),
                                                    east: Array(Math.floor(Math.random() * 10) + 2).fill(0).map((_, i) => ({
                                                        id: Date.now() + Math.random() + i + 200,
                                                        position: 0,
                                                        counted: false
                                                    })),
                                                    west: Array(Math.floor(Math.random() * 8) + 1).fill(0).map((_, i) => ({
                                                        id: Date.now() + Math.random() + i + 300,
                                                        position: 0,
                                                        counted: false
                                                    }))
                                                });
                                            }, 500);
                                        }

                                        return newLanes;
                                    });
                                    return { ...v, position: newPosition, counted: true };
                                }
                                return { ...v, position: newPosition };
                            })
                            .filter(v => v.position < 105);
                    });
                    return updated;
                });

                // Add new incoming vehicles randomly with varied probability
                setIncomingVehicles(prev => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach(lane => {
                        // Random max capacity per lane (between 15 and 35)
                        const maxCapacity = Math.floor(Math.random() * 21) + 15;

                        // Variable probability - some lanes may have no traffic temporarily
                        const baseProbability = lane === 'south' ? 0.40 : lane === 'east' ? 0.35 : 0.25;
                        const variableProbability = Math.random() < 0.1 ? 0 : baseProbability; // 10% chance of no traffic

                        if (Math.random() < variableProbability && updated[lane].length < maxCapacity) {
                            updated[lane].push({
                                id: Date.now() + Math.random(),
                                position: 0,
                                counted: false
                            });
                        }
                    });

                    // Update waiting count for all lanes
                    setLanes(prevLanes => {
                        const newLanes = { ...prevLanes };
                        Object.keys(updated).forEach(lane => {
                            newLanes[lane] = {
                                ...newLanes[lane],
                                waiting: updated[lane].length
                            };
                        });

                        // Update metrics with current state
                        setMetrics(prevMetrics => {
                            const totalWaiting = Object.values(newLanes).reduce((sum, lane) => sum + lane.waiting, 0);
                            const totalPassed = Object.values(newLanes).reduce((sum, lane) => sum + lane.passed, 0);

                            return {
                                ...prevMetrics,
                                totalVehicles: totalWaiting + totalPassed
                            };
                        });

                        return newLanes;
                    });

                    return updated;
                });
            }, 100);

            // Traffic light cycle interval - adaptive intelligent switching
            intervalRef.current = setInterval(() => {
                setIncomingVehicles(prevIncoming => {
                    const updated = { ...prevIncoming };

                    setLanes(prevLanes => {
                        const newLanes = { ...prevLanes };

                        // SAFETY: Reset ALL lights to red first (no two greens ever)
                        Object.keys(newLanes).forEach(lane => {
                            newLanes[lane] = { ...newLanes[lane], light: 'red' };
                        });

                        // Find lane with most waiting vehicles
                        const sortedLanes = Object.entries(newLanes)
                            .map(([lane, data]) => ({ lane, waiting: data.waiting }))
                            .sort((a, b) => b.waiting - a.waiting);

                        const priorityLane = sortedLanes[0].lane;
                        const priorityWaiting = sortedLanes[0].waiting;
                        const secondPriority = sortedLanes[1].waiting;

                        // Adaptive release logic:
                        // - ONLY ONE lane gets green light at a time (safety)
                        // - Always process the lane with most vehicles
                        // - Release 1 vehicle per cycle (realistic timing)
                        // - If heavily congested (8+ and 2x more), release 2 vehicles
                        let vehiclesToRelease = 1;

                        if (priorityWaiting > 0) {
                            // If priority lane has much more than others, release more vehicles
                            if (priorityWaiting >= secondPriority * 2 && priorityWaiting >= 8) {
                                vehiclesToRelease = 2;
                            }

                            // SAFETY: Only ONE green light at intersection
                            newLanes[priorityLane].light = 'green';

                            // Double-check: Ensure no other lane is green
                            Object.keys(newLanes).forEach(lane => {
                                if (lane !== priorityLane) {
                                    newLanes[lane].light = 'red';
                                }
                            });

                            // Release vehicles from incoming to outgoing
                            setOutgoingVehicles(prevOutgoing => {
                                const outUpdated = { ...prevOutgoing };
                                const actualRelease = Math.min(vehiclesToRelease, updated[priorityLane].length);

                                if (actualRelease > 0) {
                                    // Check if lane is clear (no vehicles in the first 30% of the path)
                                    const laneClear = !outUpdated[priorityLane].some(v => v.position < 30);

                                    if (laneClear) {
                                        const released = updated[priorityLane].splice(0, actualRelease);

                                        // Calculate safe starting positions with spacing
                                        const startPosition = 0; // Start from the beginning
                                        const spacing = 10; // Minimum distance between vehicles

                                        outUpdated[priorityLane] = [
                                            ...outUpdated[priorityLane],
                                            ...released.map((v, index) => ({
                                                ...v,
                                                position: startPosition + (index * spacing),
                                                counted: false
                                            }))
                                        ];
                                    }
                                }

                                return outUpdated;
                            });

                            // Update waiting count after release
                            newLanes[priorityLane].waiting = updated[priorityLane].length;
                        }

                        // Update all metrics
                        const totalWaiting = Object.values(newLanes).reduce((sum, lane) => sum + lane.waiting, 0);
                        const totalPassed = Object.values(newLanes).reduce((sum, lane) => sum + lane.passed, 0);
                        const avgWait = totalWaiting > 0 ? Math.round((totalWaiting / 4) * 2) : 0;
                        const efficiency = totalPassed > 0 ? Math.min(95, Math.round((totalPassed / (totalPassed + totalWaiting)) * 100)) : 50;

                        setMetrics({
                            totalVehicles: totalWaiting + totalPassed,
                            avgWaitTime: avgWait,
                            efficiency: efficiency
                        });

                        return newLanes;
                    });

                    return updated;
                });

                cycleRef.current++;
            }, 1000); // Faster cycle to release vehicles one by one
        };

        const stopSimulation = () => {
            setRunning(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (animationRef.current) {
                clearInterval(animationRef.current);
                animationRef.current = null;
            }
            setLanes({
                north: { light: 'red', passed: 0, waiting: 0 },
                south: { light: 'red', passed: 0, waiting: 0 },
                east: { light: 'red', passed: 0, waiting: 0 },
                west: { light: 'red', passed: 0, waiting: 0 }
            });
            setIncomingVehicles({ north: [], south: [], east: [], west: [] });
            setOutgoingVehicles({ north: [], south: [], east: [], west: [] });
            setMetrics({ totalVehicles: 0, avgWaitTime: 0, efficiency: 0 });
        };

        const getLightColor = (light) => {
            switch (light) {
                case 'green': return '#10b981';
                case 'yellow': return '#f59e0b';
                case 'red': return '#ef4444';
                default: return '#6b7280';
            }
        };

        return (
            <div className="space-y-6">
                {/* Main Visualization Container */}
                <div className="bg-[#0f1115] border-2 border-[#00e9fa]/30 rounded-lg p-6">
                    {/* Top: NORTH Traffic Light */}
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-3 bg-black/90 px-6 py-3 rounded-lg border-2 border-gray-700">
                            <span className="text-sm font-bold text-gray-300">⬆️ NORTE</span>
                            <div className="w-10 h-10 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: getLightColor(lanes.north.light),
                                    boxShadow: `0 0 25px ${getLightColor(lanes.north.light)}`
                                }}>
                            </div>
                            <span className="text-sm font-bold text-gray-400">{lanes.north.waiting} 🚗</span>
                        </div>
                    </div>

                    {/* Middle Row: WEST + INTERSECTION + EAST */}
                    <div className="flex items-center justify-center gap-4">
                        {/* WEST Traffic Light */}
                        <div className="flex flex-col items-center gap-2 bg-black/90 px-5 py-5 rounded-lg border-2 border-gray-700">
                            <span className="text-sm font-bold text-gray-300">⬅️ OESTE</span>
                            <div className="w-10 h-10 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: getLightColor(lanes.west.light),
                                    boxShadow: `0 0 25px ${getLightColor(lanes.west.light)}`
                                }}>
                            </div>
                            <span className="text-sm font-bold text-gray-400">{lanes.west.waiting} 🚗</span>
                        </div>

                        {/* Intersection Grid - EXTRA LARGE (48rem = 768px) */}
                        <div className="relative w-[48rem] h-[48rem] flex-shrink-0 bg-[#0a0a0a] rounded-lg border-2 border-gray-800">
                            {/* Background roads */}
                            <div className="absolute inset-0">
                                {/* Vertical road */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-40 h-full bg-[#1a1a1a]">
                                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-yellow-600/30"></div>
                                </div>
                                {/* Horizontal road */}
                                <div className="absolute top-1/2 -translate-y-1/2 h-40 w-full bg-[#1a1a1a]">
                                    <div className="absolute top-1/2 -translate-y-1/2 h-0.5 w-full bg-yellow-600/30"></div>
                                </div>
                            </div>

                            {/* NORTH LANE */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-[44%]">
                                {/* Waiting zone (RED) */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-900/10 border border-red-500/30 rounded-t flex flex-col items-center justify-end p-4">
                                    <div className="text-xs text-red-400 font-bold mb-2">🚗 Esperando</div>
                                    <div className="text-4xl font-bold text-red-500">{lanes.north.waiting}</div>
                                    {/* Visual queue */}
                                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                                        {Array.from({ length: Math.min(lanes.north.waiting, 15) }).map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Passing zone (GREEN) */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-green-900/10 border border-green-500/30 flex flex-col items-center justify-start p-4">
                                    <div className="text-xs text-green-400 font-bold mb-2">✓ Pasando</div>
                                    <div className="text-3xl font-bold text-green-500">{outgoingVehicles.north.length}</div>
                                    {/* Visual movement */}
                                    <div className="mt-2 space-y-1">
                                        {outgoingVehicles.north.slice(0, 10).map((v, i) => (
                                            <div key={v.id} className="w-5 h-5 bg-green-400 rounded-full mx-auto"
                                                style={{ opacity: 1 - (i * 0.1) }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SOUTH LANE */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-[44%]">
                                {/* Waiting zone (RED) */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-red-900/10 border border-red-500/30 rounded-b flex flex-col items-center justify-start p-4">
                                    <div className="text-xs text-red-400 font-bold mb-2">🚗 Esperando</div>
                                    <div className="text-4xl font-bold text-red-500">{lanes.south.waiting}</div>
                                    {/* Visual queue */}
                                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                                        {Array.from({ length: Math.min(lanes.south.waiting, 15) }).map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Passing zone (GREEN) */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-green-900/10 border border-green-500/30 flex flex-col items-center justify-end p-4">
                                    <div className="text-xs text-green-400 font-bold mb-2">✓ Pasando</div>
                                    <div className="text-3xl font-bold text-green-500">{outgoingVehicles.south.length}</div>
                                    {/* Visual movement */}
                                    <div className="mb-2 space-y-1">
                                        {outgoingVehicles.south.slice(0, 10).map((v, i) => (
                                            <div key={v.id} className="w-5 h-5 bg-green-400 rounded-full mx-auto"
                                                style={{ opacity: 1 - (i * 0.1) }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* EAST LANE */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[44%] h-36">
                                {/* Waiting zone (RED) */}
                                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-red-900/10 border border-red-500/30 rounded-r flex flex-col items-center justify-center p-4">
                                    <div className="text-xs text-red-400 font-bold mb-2">🚗 Esperando</div>
                                    <div className="text-4xl font-bold text-red-500">{lanes.east.waiting}</div>
                                    {/* Visual queue */}
                                    <div className="flex flex-wrap gap-1 mt-3 justify-center max-w-[80px]">
                                        {Array.from({ length: Math.min(lanes.east.waiting, 10) }).map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Passing zone (GREEN) */}
                                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-green-900/10 border border-green-500/30 flex flex-col items-center justify-center p-4">
                                    <div className="text-xs text-green-400 font-bold mb-2">✓ Pasando</div>
                                    <div className="text-3xl font-bold text-green-500">{outgoingVehicles.east.length}</div>
                                    {/* Visual movement */}
                                    <div className="flex gap-1 mt-2">
                                        {outgoingVehicles.east.slice(0, 8).map((v, i) => (
                                            <div key={v.id} className="w-4 h-4 bg-green-400 rounded-full"
                                                style={{ opacity: 1 - (i * 0.12) }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* WEST LANE */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[44%] h-36">
                                {/* Waiting zone (RED) */}
                                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-red-900/10 border border-red-500/30 rounded-l flex flex-col items-center justify-center p-4">
                                    <div className="text-xs text-red-400 font-bold mb-2">🚗 Esperando</div>
                                    <div className="text-4xl font-bold text-red-500">{lanes.west.waiting}</div>
                                    {/* Visual queue */}
                                    <div className="flex flex-wrap gap-1 mt-3 justify-center max-w-[80px]">
                                        {Array.from({ length: Math.min(lanes.west.waiting, 10) }).map((_, i) => (
                                            <div key={i} className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Passing zone (GREEN) */}
                                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-green-900/10 border border-green-500/30 flex flex-col items-center justify-center p-4">
                                    <div className="text-xs text-green-400 font-bold mb-2">✓ Pasando</div>
                                    <div className="text-3xl font-bold text-green-500">{outgoingVehicles.west.length}</div>
                                    {/* Visual movement */}
                                    <div className="flex gap-1 mt-2 flex-row-reverse">
                                        {outgoingVehicles.west.slice(0, 8).map((v, i) => (
                                            <div key={v.id} className="w-4 h-4 bg-green-400 rounded-full"
                                                style={{ opacity: 1 - (i * 0.12) }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Center intersection indicator */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#00e9fa]/5 border-2 border-[#00e9fa]/30 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#00e9fa" strokeWidth="2">
                                    <path d="M12 2 L12 22 M2 12 L22 12" />
                                </svg>
                            </div>
                        </div>

                        {/* EAST Traffic Light */}
                        <div className="flex flex-col items-center gap-2 bg-black/90 px-5 py-5 rounded-lg border-2 border-gray-700">
                            <span className="text-sm font-bold text-gray-300">➡️ ESTE</span>
                            <div className="w-10 h-10 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: getLightColor(lanes.east.light),
                                    boxShadow: `0 0 25px ${getLightColor(lanes.east.light)}`
                                }}>
                            </div>
                            <span className="text-sm font-bold text-gray-400">{lanes.east.waiting} 🚗</span>
                        </div>
                    </div>

                    {/* Bottom: SOUTH Traffic Light */}
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-3 bg-black/90 px-6 py-3 rounded-lg border-2 border-gray-700">
                            <span className="text-sm font-bold text-gray-300">⬇️ SUR</span>
                            <div className="w-10 h-10 rounded-full transition-all duration-300"
                                style={{
                                    backgroundColor: getLightColor(lanes.south.light),
                                    boxShadow: `0 0 25px ${getLightColor(lanes.south.light)}`
                                }}>
                            </div>
                            <span className="text-sm font-bold text-gray-400">{lanes.south.waiting} 🚗</span>
                        </div>
                    </div>
                </div>

                {/* Stats and Metrics Row */}
                {running && (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Left: Statistics Panel */}
                        <div className="bg-[#0f1115] border border-[#00e9fa]/20 rounded-lg p-4">
                            <h3 className="text-sm text-[#00e9fa] font-bold text-center border-b border-[#00e9fa]/30 pb-2 mb-3">
                                ESTADÍSTICAS POR VÍA
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center border border-gray-700 rounded p-2">
                                    <p className="text-[10px] text-gray-400 uppercase mb-2 font-bold">⬆️ {t('portfolio_transit_north')}</p>
                                    <div className="flex justify-around items-center gap-2">
                                        <div className="bg-red-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-red-400">{lanes.north.waiting}</p>
                                            <p className="text-[8px] text-red-300">🚗 Esperan</p>
                                        </div>
                                        <div className="bg-green-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-green-400">{lanes.north.passed}</p>
                                            <p className="text-[8px] text-green-300">✓ Pasaron</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center border border-gray-700 rounded p-2">
                                    <p className="text-[10px] text-gray-400 uppercase mb-2 font-bold">⬇️ {t('portfolio_transit_south')}</p>
                                    <div className="flex justify-around items-center gap-2">
                                        <div className="bg-red-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-red-400">{lanes.south.waiting}</p>
                                            <p className="text-[8px] text-red-300">🚗 Esperan</p>
                                        </div>
                                        <div className="bg-green-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-green-400">{lanes.south.passed}</p>
                                            <p className="text-[8px] text-green-300">✓ Pasaron</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center border border-gray-700 rounded p-2">
                                    <p className="text-[10px] text-gray-400 uppercase mb-2 font-bold">➡️ {t('portfolio_transit_east')}</p>
                                    <div className="flex justify-around items-center gap-2">
                                        <div className="bg-red-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-red-400">{lanes.east.waiting}</p>
                                            <p className="text-[8px] text-red-300">🚗 Esperan</p>
                                        </div>
                                        <div className="bg-green-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-green-400">{lanes.east.passed}</p>
                                            <p className="text-[8px] text-green-300">✓ Pasaron</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center border border-gray-700 rounded p-2">
                                    <p className="text-[10px] text-gray-400 uppercase mb-2 font-bold">⬅️ {t('portfolio_transit_west')}</p>
                                    <div className="flex justify-around items-center gap-2">
                                        <div className="bg-red-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-red-400">{lanes.west.waiting}</p>
                                            <p className="text-[8px] text-red-300">🚗 Esperan</p>
                                        </div>
                                        <div className="bg-green-900/20 px-2 py-1 rounded">
                                            <p className="text-lg font-bold text-green-400">{lanes.west.passed}</p>
                                            <p className="text-[8px] text-green-300">✓ Pasaron</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: How it Works */}
                        <div className="bg-[#0f1115] border border-[#00e9fa]/20 rounded-lg p-4">
                            <h3 className="text-sm text-[#00e9fa] font-bold text-center border-b border-[#00e9fa]/30 pb-2 mb-3">
                                Cómo Funciona
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                        <p className="text-[11px] font-bold text-red-400">Zona Roja</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        Vehículos esperando en cola. El número indica cuántos hay.
                                    </p>
                                </div>
                                <div className="bg-green-900/20 border border-green-500/30 rounded p-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <p className="text-[11px] font-bold text-green-400">Zona Verde</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        Vehículos pasando después de recibir luz verde.
                                    </p>
                                </div>
                                <div className="bg-yellow-900/10 border border-yellow-600/30 rounded p-2">
                                    <p className="text-[11px] text-yellow-400 font-bold mb-1">⚡ IA Adaptativa:</p>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        El sistema detecta qué vía tiene más tráfico acumulado y le da prioridad automáticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Metrics Panel */}
                {running && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#0f1115] border border-[#00e9fa]/20 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-[#00e9fa]">{metrics.totalVehicles}</p>
                            <p className="text-xs text-gray-400 mt-2">{t('portfolio_transit_total_vehicles')}</p>
                        </div>
                        <div className="bg-[#0f1115] border border-[#00e9fa]/20 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-yellow-400">{metrics.avgWaitTime}s</p>
                            <p className="text-xs text-gray-400 mt-2">{t('portfolio_transit_avg_wait')}</p>
                        </div>
                        <div className="bg-[#0f1115] border border-[#00e9fa]/20 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-green-400">{metrics.efficiency}%</p>
                            <p className="text-xs text-gray-400 mt-2">{t('portfolio_transit_efficiency')}</p>
                        </div>
                    </div>
                )}

                {/* Control Button */}
                <button
                    onClick={running ? stopSimulation : startSimulation}
                    className={`w-full px-6 py-4 rounded font-mono text-base transition-colors ${running
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#00e9fa] hover:bg-[#00d4e0] text-black'
                        }`}
                >
                    {running ? t('portfolio_transit_stop_sim') : t('portfolio_transit_start_sim')}
                </button>
            </div>
        );
    };

    return (
        <Layout>
            <div className="light relative min-h-screen bg-black text-white overflow-hidden">
                <div
                    ref={backgroundRef}
                    className="pointer-events-none absolute inset-0 bg-cover bg-center filter blur-[2px] scale-105 transition-transform duration-300"
                    style={{ backgroundImage: 'url(/images/convocatorias-alianzas-parallax.jpg)' }}
                    aria-hidden="true"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" aria-hidden="true" />

                {/* Header */}
                <div className="relative container mx-auto px-4 pt-32 pb-16 z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-400 hover:text-[#00e9fa] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('back_home')}
                    </Link>

                    <div className="mb-12">
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[#00e9fa]">
                            {t('portfolio_page_title')}
                        </h1>
                        <p className="text-xl text-gray-400 font-mono">
                            {t('portfolio_page_subtitle')}
                        </p>
                    </div>

                    <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-16">
                        {t('portfolio_page_intro')}
                    </p>

                    {/* Filter Categories */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-6 py-3 rounded-lg font-mono text-sm transition-all ${selectedCategory === cat.id
                                    ? 'bg-[#00e9fa] text-black'
                                    : 'bg-[#333436] text-gray-300 hover:bg-[#444] hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map(item => {
                            const isFacialRecognition = item.id === 3;
                            const isTotalDarkness = item.id === 1;
                            const is3DRenders = item.id === 4;
                            // If this is the Curriculum item, render it as a simple button
                            // instead of a full card. Clicking will navigate/open the link.
                            if (item.title && item.title.toLowerCase().includes('currículum')) {
                                return null;
                            }

                            return (
                                <div
                                    key={item.id}
                                    className={`group relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00e9fa]/20 ${isTotalDarkness ? 'bg-black' : isFacialRecognition ? 'bg-black/70 border border-[#00e9fa]/25 backdrop-blur' : 'bg-[#1a1a1a]'}`}
                                    onClick={() => openItem(item)}
                                >
                                    {/* Thumbnail */}
                                    <div className={`relative h-80 overflow-hidden ${isTotalDarkness ? 'bg-black' : is3DRenders ? 'bg-black' : 'bg-[#333436]'}`}>
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className={`w-full h-full transition-transform duration-300 ${is3DRenders ? 'object-cover group-hover:scale-110' : 'object-cover group-hover:scale-110'}`}
                                            style={is3DRenders ? { transform: 'scale(1.3)', objectPosition: 'center' } : isTotalDarkness ? { objectFit: 'contain', objectPosition: 'center' } : { transform: 'scale(1.4)', objectPosition: 'center' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-600"><span class="text-6xl">🎬</span></div>';
                                            }}
                                        />

                                        {/* Overlay Icon */}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {item.type === 'video' && <Play className="w-16 h-16 text-[#00e9fa]" />}
                                            {item.type === 'demo' && <Code className="w-16 h-16 text-[#00e9fa]" />}
                                            {item.type === 'image' && <ImageIcon className="w-16 h-16 text-[#00e9fa]" />}
                                        </div>

                                        {/* Type Badge */}
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 rounded-full text-xs font-mono text-[#00e9fa] flex items-center gap-2">
                                            {item.type === 'video' && <Video className="w-3 h-3" />}
                                            {item.type === 'demo' && <Code className="w-3 h-3" />}
                                            {item.type === 'image' && <Layers className="w-3 h-3" />}
                                            {item.type.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={is3DRenders ? 'p-6 pt-3' : 'p-6'}>
                                        <h3 className={`text-xl font-bold mb-2 transition-colors ${isFacialRecognition ? 'text-[#00e9fa]' : 'text-white group-hover:text-[#00e9fa]'}`}>
                                            {item.title}
                                        </h3>
                                        <p className={`text-sm mb-4 line-clamp-2 ${isFacialRecognition ? 'text-gray-200' : 'text-gray-400'}`}>
                                            {item.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 text-xs rounded font-mono ${isFacialRecognition ? 'bg-[#00e9fa]/10 border border-[#00e9fa]/30 text-[#00e9fa]' : 'bg-[#333436] text-gray-400'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Curriculum button: render outside of the card grid, centered horizontally and below the cards */}
                    {(() => {
                        const curriculumItem = portfolioItems.find(it => it.title && it.title.toLowerCase().includes('currículum'));
                        if (!curriculumItem) return null;
                        return (
                            <div className="w-full flex justify-center mt-8">
                                <div className="inline-block">
                                    <button
                                        onClick={() => openItem(curriculumItem)}
                                        className="px-6 py-4 border border-[#00e9fa] text-[#00e9fa] rounded-md font-mono uppercase tracking-wider hover:bg-[#00e9fa] hover:text-black transition-colors"
                                        aria-label={curriculumItem.title}
                                    >
                                        {curriculumItem.title}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}

                    {/* No Results */}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">{t('portfolio_no_results')}</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {selectedItem && (
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <div
                            className="relative bg-[#1a1a1a] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/80 hover:bg-[#00e9fa] hover:text-black rounded-full flex items-center justify-center transition-all"
                            >
                                ✕
                            </button>

                            {/* Modal Content */}
                            <div className="p-8">
                                {/* Video */}
                                {selectedItem.type === 'video' && (
                                    <div className="mb-6">
                                        <video
                                            controls
                                            autoPlay
                                            className="w-full rounded-lg"
                                            src={selectedItem.videoUrl}
                                        >
                                            {t('portfolio_video_not_supported')}
                                        </video>
                                    </div>
                                )}

                                {/* Image */}
                                {selectedItem.type === 'image' && (
                                    <div className="mb-6">
                                        <img
                                            src={selectedItem.fullImage || selectedItem.thumbnail}
                                            alt={selectedItem.title}
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Image Link Button */}
                                {selectedItem.type === 'image' && selectedItem.link && (
                                    <div className="mb-6">
                                        <Link
                                            to={selectedItem.link}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00e9fa] text-black rounded-lg hover:bg-[#00d4e0] transition-colors font-mono"
                                        >
                                            {t('portfolio_open_demo')}
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}

                                {/* Demo Link - Standard (solo si hay URL real) */}
                                {selectedItem.type === 'demo' &&
                                    selectedItem.id !== 2 &&
                                    selectedItem.id !== 5 &&
                                    selectedItem.demoUrl &&
                                    selectedItem.demoUrl !== '#' && (
                                        <div className="mb-6 h-96 bg-[#333436] rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <Code className="w-16 h-16 text-[#00e9fa] mx-auto mb-4" />
                                                <p className="text-gray-400 mb-4">{t('portfolio_demo_preview')}</p>
                                                <Link
                                                    to={selectedItem.demoUrl}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00e9fa] text-black rounded-lg hover:bg-[#00d4e0] transition-colors font-mono"
                                                >
                                                    {t('portfolio_open_demo')}
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                {/* GreenWave Demo - Special Layout */}
                                {selectedItem.type === 'demo' && selectedItem.id === 5 && (
                                    <div className="mb-6 space-y-6">
                                        {/* Descripción General */}
                                        <div className="bg-black/40 border border-[#00e9fa]/40 rounded-lg p-6">
                                            <h3 className="text-lg font-bold text-[#00e9fa] mb-3">{t('greenwave_3d_title')}</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {t('greenwave_3d_desc')}
                                            </p>
                                        </div>

                                        {/* Key Metrics */}
                                        <div className="bg-black/40 border border-[#00e9fa]/40 rounded-lg p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                                {/* Key Features */}
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#00e9fa] mb-4 flex items-center gap-3">
                                                        <svg className="w-6 h-6 stroke-[#00e9fa]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                                            <path d="M6 9h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"></path>
                                                            <circle cx="12" cy="15" r="2"></circle>
                                                        </svg>
                                                        {t('greenwave_3d_features_title')}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        <li className="flex items-start gap-2 text-gray-300">
                                                            <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                            <span>{t('greenwave_3d_feature_1')}</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 text-gray-300">
                                                            <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                            <span>{t('greenwave_3d_feature_2')}</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 text-gray-300">
                                                            <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                            <span>{t('greenwave_3d_feature_3')}</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 text-gray-300">
                                                            <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                            <span>{t('greenwave_3d_feature_4')}</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 text-gray-300">
                                                            <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                            <span>{t('greenwave_3d_feature_5')}</span>
                                                        </li>
                                                        <li className="flex items-start gap-2 text-gray-300">
                                                            <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                            <span>{t('greenwave_3d_feature_6')}</span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Datos Técnicos */}
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#00e9fa] mb-4 flex items-center gap-3">
                                                        <svg className="w-6 h-6 stroke-[#00e9fa]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                                            <polyline points="19 12 12 19 5 12"></polyline>
                                                            <polyline points="19 8 12 15 5 8"></polyline>
                                                        </svg>
                                                        {t('greenwave_3d_technical_title')}
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="bg-black/30 border border-[#00e9fa]/30 rounded p-3">
                                                            <p className="text-xs text-gray-400 mb-1">{t('greenwave_3d_cities_label')}</p>
                                                            <p className="text-2xl font-bold text-[#00e9fa]">{t('greenwave_3d_cities_value')}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{t('greenwave_3d_cities_desc')}</p>
                                                        </div>
                                                        <div className="bg-black/30 border border-[#00e9fa]/30 rounded p-3">
                                                            <p className="text-xs text-gray-400 mb-1">{t('greenwave_3d_intersections_label')}</p>
                                                            <p className="text-2xl font-bold text-[#00e9fa]">{t('greenwave_3d_intersections_value')}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{t('greenwave_3d_intersections_desc')}</p>
                                                        </div>
                                                        <div className="bg-black/30 border border-[#00e9fa]/30 rounded p-3">
                                                            <p className="text-xs text-gray-400 mb-1">{t('greenwave_3d_rendering_label')}</p>
                                                            <p className="text-2xl font-bold text-[#00e9fa]">{t('greenwave_3d_rendering_value')}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{t('greenwave_3d_rendering_desc')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Impacto Ambiental y Económico */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-black/30 border border-[#00e9fa]/30 rounded p-4">
                                                    <p className="text-xs text-gray-400 mb-2">{t('greenwave_3d_co2_label')}</p>
                                                    <p className="text-2xl font-bold text-[#00e9fa]">{t('greenwave_3d_co2_value')}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{t('greenwave_3d_co2_desc')}</p>
                                                </div>
                                                <div className="bg-black/30 border border-[#00e9fa]/30 rounded p-4">
                                                    <p className="text-xs text-gray-400 mb-2">{t('greenwave_3d_fuel_label')}</p>
                                                    <p className="text-2xl font-bold text-[#00e9fa]">{t('greenwave_3d_fuel_value')}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{t('greenwave_3d_fuel_desc')}</p>
                                                </div>
                                                <div className="bg-black/30 border border-[#00e9fa]/30 rounded p-4">
                                                    <p className="text-xs text-gray-400 mb-2">{t('greenwave_3d_traffic_label')}</p>
                                                    <p className="text-2xl font-bold text-[#00e9fa]">{t('greenwave_3d_traffic_value')}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{t('greenwave_3d_traffic_desc')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Casos de Uso */}
                                        <div className="bg-black/40 border border-[#00e9fa]/40 rounded-lg p-6">
                                            <h3 className="text-lg font-bold text-[#00e9fa] mb-4 flex items-center gap-3">
                                                <svg className="w-6 h-6 stroke-[#00e9fa]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2-3h2l2 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
                                                    <circle cx="12" cy="13" r="3"></circle>
                                                </svg>
                                                {t('greenwave_3d_usecases_title')}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-black/30 rounded p-3 border border-[#00e9fa]/30">
                                                    <p className="text-sm font-semibold text-[#00e9fa] mb-1">{t('greenwave_3d_usecase_1_title')}</p>
                                                    <p className="text-xs text-gray-400">{t('greenwave_3d_usecase_1_desc')}</p>
                                                </div>
                                                <div className="bg-black/30 rounded p-3 border border-[#00e9fa]/30">
                                                    <p className="text-sm font-semibold text-[#00e9fa] mb-1">{t('greenwave_3d_usecase_2_title')}</p>
                                                    <p className="text-xs text-gray-400">{t('greenwave_3d_usecase_2_desc')}</p>
                                                </div>
                                                <div className="bg-black/30 rounded p-3 border border-[#00e9fa]/30">
                                                    <p className="text-sm font-semibold text-[#00e9fa] mb-1">{t('greenwave_3d_usecase_3_title')}</p>
                                                    <p className="text-xs text-gray-400">{t('greenwave_3d_usecase_3_desc')}</p>
                                                </div>
                                                <div className="bg-black/30 rounded p-3 border border-[#00e9fa]/30">
                                                    <p className="text-sm font-semibold text-[#00e9fa] mb-1">{t('greenwave_3d_usecase_4_title')}</p>
                                                    <p className="text-xs text-gray-400">{t('greenwave_3d_usecase_4_desc')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arquitectura del Sistema */}
                                        <div className="bg-black/40 border border-[#00e9fa]/40 rounded-lg p-6">
                                            <h3 className="text-lg font-bold text-[#00e9fa] mb-4 flex items-center gap-3">
                                                <svg className="w-6 h-6 stroke-[#00e9fa]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                                    <rect x="3" y="3" width="7" height="7"></rect>
                                                    <rect x="14" y="3" width="7" height="7"></rect>
                                                    <rect x="14" y="14" width="7" height="7"></rect>
                                                    <rect x="3" y="14" width="7" height="7"></rect>
                                                    <line x1="10" y1="6" x2="14" y2="6"></line>
                                                    <line x1="10" y1="17" x2="14" y2="17"></line>
                                                    <line x1="6" y1="10" x2="6" y2="14"></line>
                                                    <line x1="17" y1="10" x2="17" y2="14"></line>
                                                </svg>
                                                {t('greenwave_3d_architecture_title')}
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex gap-3">
                                                    <span className="text-[#00e9fa] font-bold min-w-24">{t('greenwave_3d_arch_capture')}:</span>
                                                    <span className="text-gray-300">{t('greenwave_3d_arch_capture_desc')}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-[#00e9fa] font-bold min-w-24">{t('greenwave_3d_arch_edgenode')}:</span>
                                                    <span className="text-gray-300">{t('greenwave_3d_arch_edgenode_desc')}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-[#00e9fa] font-bold min-w-24">{t('greenwave_3d_arch_algorithm')}:</span>
                                                    <span className="text-gray-300">{t('greenwave_3d_arch_algorithm_desc')}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-[#00e9fa] font-bold min-w-24">{t('greenwave_3d_arch_backhaul')}:</span>
                                                    <span className="text-gray-300">{t('greenwave_3d_arch_backhaul_desc')}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-[#00e9fa] font-bold min-w-24">{t('greenwave_3d_arch_database')}:</span>
                                                    <span className="text-gray-300">{t('greenwave_3d_arch_database_desc')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stack Tecnológico */}
                                        <div className="bg-black/40 rounded p-6 border border-[#00e9fa]/40">
                                            <h4 className="text-sm font-bold text-[#00e9fa] mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 stroke-[#00e9fa]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                                    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                                                    <line x1="12" y1="12" x2="20" y2="7.5"></line>
                                                    <line x1="12" y1="12" x2="12" y2="21"></line>
                                                    <line x1="12" y1="12" x2="4" y2="7.5"></line>
                                                </svg>
                                                {t('greenwave_3d_infrastructure_title')}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_cameras')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_lidar')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_radar')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_edge')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_jetson')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_gpu')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_backhaul')}</span>
                                                <span className="px-3 py-1 bg-black/50 border border-[#00e9fa]/40 rounded-full text-xs text-gray-300">{t('greenwave_3d_infra_database')}</span>
                                            </div>
                                        </div>

                                        {/* Ventajas Competitivas */}
                                        <div className="bg-black/40 border border-[#00e9fa]/40 rounded-lg p-6">
                                            <h3 className="text-lg font-bold text-[#00e9fa] mb-4 flex items-center gap-3">
                                                <svg className="w-6 h-6 stroke-[#00e9fa]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                                </svg>
                                                {t('greenwave_3d_competitive_title')}
                                            </h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                    <span>{t('greenwave_3d_competitive_1')}</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                    <span>{t('greenwave_3d_competitive_2')}</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                    <span>{t('greenwave_3d_competitive_3')}</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                    <span>{t('greenwave_3d_competitive_4')}</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-gray-300">
                                                    <span className="text-[#00e9fa] mt-1 font-bold">▪</span>
                                                    <span>{t('greenwave_3d_competitive_5')}</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Call to Action */}
                                        <div className="bg-black/40 border border-[#00e9fa]/40 rounded-lg p-6 text-center">
                                            <Link
                                                to="/demo/greenwave-3d"
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00e9fa] to-[#00b8cc] text-black rounded-lg hover:from-[#00d4e0] hover:to-[#00a3b8] transition-all font-mono font-bold text-lg shadow-lg shadow-[#00e9fa]/50 mb-3"
                                            >
                                                {t('greenwave_3d_access_button')}
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                            <p className="text-xs text-gray-400">{t('greenwave_3d_access_note')}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Smart Integration Toolkit Interactive Demos */}
                                {selectedItem.type === 'demo' && selectedItem.id === 2 && (
                                    <div className="mb-6">
                                        <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-[#00e9fa]">Demos Interactivas del Toolkit</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <Link
                                                    to="/proyectos/smart-integration/blockchain"
                                                    className="flex items-center justify-between p-3 bg-black/50 border border-[#00e9fa]/30 rounded hover:border-[#00e9fa] hover:bg-black/70 transition-all group"
                                                >
                                                    <div>
                                                        <p className="font-bold text-[#00e9fa] group-hover:text-white">Blockchain & Criptografía</p>
                                                        <p className="text-xs text-gray-400">Integración de criptografía, hashing SHA-256 y demos interactivas</p>
                                                    </div>
                                                    <span className="text-[#00e9fa]">→</span>
                                                </Link>
                                                <Link
                                                    to="/proyectos/smart-integration/tax-tracker"
                                                    className="flex items-center justify-between p-3 bg-black/50 border border-[#00e9fa]/30 rounded hover:border-[#00e9fa] hover:bg-black/70 transition-all group"
                                                >
                                                    <div>
                                                        <p className="font-bold text-[#00e9fa] group-hover:text-white">Tax Tracker - IVA Colombia</p>
                                                        <p className="text-xs text-gray-400">Rastreo interactivo de impuestos con blockchain y timeline animado</p>
                                                    </div>
                                                    <span className="text-[#00e9fa]">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Info - No mostrar para GreenWave */}
                                {selectedItem.id !== 5 && (
                                    <>
                                        <h2 className="text-3xl font-bold mb-4 text-[#00e9fa]">
                                            {selectedItem.title}
                                        </h2>
                                        <p className="text-gray-300 mb-6 leading-relaxed">
                                            {selectedItem.description}
                                        </p>
                                    </>
                                )}

                                {/* Tags - No mostrar para GreenWave */}
                                {selectedItem.id !== 5 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selectedItem.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-[#333436] text-sm text-gray-400 rounded-full font-mono"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {selectedItem.id === 2 && (
                                    <div className="space-y-6 p-6 rounded-lg border border-[#00e9fa]/30 bg-[#0f1115]">
                                        {/* Blockchain & Cryptography Section */}
                                        <div>
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">Integración Blockchain & Criptografía</p>
                                            <p className="text-gray-200 mb-3">Módulo avanzado de blockchain que conecta tecnologías de criptografía, hashing SHA-256 y rastreo distribuido de transacciones.</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li>Smart Contracts: Validación automática de transacciones en cadena ligera (Hyperledger/Ethereum testnet)</li>
                                                <li>Criptografía SHA-256: Hashing seguro de registros y certificaciones digitales</li>
                                                <li>Tax Tracker Demo: Rastreo interactivo del IVA en Colombia con distribución por sectores</li>
                                                <li>Timeline Progresivo: Animación 5 días mostrando impacto del IVA en servicios públicos</li>
                                                <li>Blockchain Records: Visualización de hashes y detalles de transacciones inmutables</li>
                                            </ul>
                                        </div>

                                        {/* Tax Tracker Interactive Demo */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">Aplicación Práctica: Tax Tracker</p>
                                            <p className="text-gray-200 mb-3">Sistema de rastreo de impuestos IVA en Colombia con blockchain. Simula el recaudo y distribución de impuestos en 5 sectores clave:</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li><span className="text-[#00e9fa]">Salud Pública (25%)</span>: Hospitales, medicinas, programas preventivos</li>
                                                <li><span className="text-[#00e9fa]">Educación (20%)</span>: Escuelas, universidades, becas</li>
                                                <li><span className="text-[#00e9fa]">Infraestructura - Vías (30%)</span>: Carreteras, puentes, mantenimiento</li>
                                                <li><span className="text-[#00e9fa]">Seguridad y Defensa (15%)</span>: Fuerzas armadas, policía, seguridad</li>
                                                <li><span className="text-[#00e9fa]">Otros Servicios (10%)</span>: Cultura, ambiente, servicios varios</li>
                                            </ul>
                                        </div>

                                        {/* Features & Capabilities */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">Características Técnicas</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li>Simulador Interactivo: Ingresa montos de compra para visualizar distribución de impuestos</li>
                                                <li>Hashes SHA-256: Cada registro de blockchain muestra hash criptográfico único y verificable</li>
                                                <li>Timeline Animado: Animación progresiva de 5 días mostrando llegada de impuestos a cada sector</li>
                                                <li>Validación de Transacciones: Montos mínimos y máximos con formato de moneda colombiana</li>
                                                <li>Copy-to-Clipboard: Funcionalidad para copiar hashes de transacciones directamente</li>
                                                <li>Responsive Design: Optimizado para mobile, tablet y desktop</li>
                                            </ul>
                                        </div>

                                        {/* Use Cases & Applications */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">Casos de Uso</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li>Educación: Demostración de blockchain y criptografía a estudiantes</li>
                                                <li>Transparencia Fiscal: Visualizar cómo los impuestos se distribuyen en servicios públicos</li>
                                                <li>Fintech: Simulador de transacciones inmutables y rastreo de fondos</li>
                                                <li>Auditoría: Verificación de integridad de registros mediante hashes SHA-256</li>
                                                <li>Dashboard Empresarial: Panel centralizado para monitoreo de impuestos y asignaciones</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Facial Recognition System Demo */}
                                {selectedItem.id === 3 && (
                                    <div className="space-y-6 p-6 rounded-lg border border-[#00e9fa]/30 bg-[#0f1115]">
                                        {/* Functionalities Section */}
                                        <div>
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">{t('portfolio_facial_detail_title')}</p>
                                            <p className="text-gray-200 mb-3">{t('portfolio_facial_detail_body')}</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li>{t('portfolio_facial_detail_1')}</li>
                                                <li>{t('portfolio_facial_detail_2')}</li>
                                                <li>{t('portfolio_facial_detail_3')}</li>
                                                <li>{t('portfolio_facial_detail_4')}</li>
                                            </ul>
                                        </div>

                                        {/* Interactive Facial Recognition Demo */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-3">{t('portfolio_facial_demo_title')}</p>
                                            <FacialRecognitionDemo t={t} />
                                        </div>

                                        {/* System Architecture */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-3">{t('portfolio_facial_architecture_title')}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div className="bg-[#0f1115] p-3 rounded border border-[#00e9fa]/10 text-center">
                                                    <div className="mb-2 flex justify-center">
                                                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#00e9fa" strokeWidth="1.5">
                                                            <rect x="2" y="4" width="20" height="14" rx="2" />
                                                            <circle cx="12" cy="11" r="3" />
                                                            <path d="M12 14v3M8 21h8" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs text-gray-300">{t('portfolio_facial_arch_1')}</p>
                                                </div>
                                                <div className="bg-[#0f1115] p-3 rounded border border-[#00e9fa]/10 text-center">
                                                    <div className="mb-2 flex justify-center">
                                                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#00e9fa" strokeWidth="1.5">
                                                            <circle cx="12" cy="8" r="3" />
                                                            <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" />
                                                            <path d="M9 8h6M12 5v6" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs text-gray-300">{t('portfolio_facial_arch_2')}</p>
                                                </div>
                                                <div className="bg-[#0f1115] p-3 rounded border border-[#00e9fa]/10 text-center">
                                                    <div className="mb-2 flex justify-center">
                                                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#00e9fa" strokeWidth="1.5">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                                            <path d="M3 9h18M9 3v18" />
                                                            <path d="M14 14l3 3M14 17l3-3" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs text-gray-300">{t('portfolio_facial_arch_3')}</p>
                                                </div>
                                                <div className="bg-[#0f1115] p-3 rounded border border-[#00e9fa]/10 text-center">
                                                    <div className="mb-2 flex justify-center">
                                                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#00e9fa" strokeWidth="1.5">
                                                            <path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z" />
                                                            <path d="M10 21h4M12 5v4M10 9h4" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs text-gray-300">{t('portfolio_facial_arch_4')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Use Cases */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">{t('portfolio_facial_use_cases_title')}</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li>{t('portfolio_facial_use_case_1')}</li>
                                                <li>{t('portfolio_facial_use_case_2')}</li>
                                                <li>{t('portfolio_facial_use_case_3')}</li>
                                                <li>{t('portfolio_facial_use_case_4')}</li>
                                            </ul>
                                        </div>

                                        {/* Differential Value */}
                                        <div className="p-4 rounded-lg border border-[#00e9fa]/20 bg-black/40">
                                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e9fa] mb-2">{t('portfolio_facial_features_title')}</p>
                                            <ul className="list-disc list-inside text-gray-300 space-y-1.5">
                                                <li>{t('portfolio_facial_feature_1')}</li>
                                                <li>{t('portfolio_facial_feature_2')}</li>
                                                <li>{t('portfolio_facial_feature_3')}</li>
                                                <li>{t('portfolio_facial_feature_4')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* LEGAL ATTRIBUTION FOOTER - Professional Copyright & Credits */}
                                <div className="mt-8 pt-8 border-t border-[#00e9fa]/20">
                                    <div className="bg-black/40 border border-[#00e9fa]/20 rounded-lg p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="text-[#00e9fa] font-bold text-sm">©</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-mono uppercase tracking-[0.15em] text-[#00e9fa] mb-1">Intellectual Property & Copyright</p>
                                                <p className="text-xs text-gray-400">
                                                    {selectedItem.id === 1 && "© 2024 Xlerion. TOTAL DARKNESS is a proprietary interactive multimedia platform combining music, narrative, and gaming mechanics. All original content, code, music compositions, 3D assets, and game mechanics are the exclusive intellectual property of Xlerion S.A.S. Licensed under Colombian Copyright Law (Ley 23 de 1982)."}
                                                    {selectedItem.id === 2 && "© 2024 Xlerion. Xlerion Smart Integration Toolkit is a proprietary modular software suite. All source code, algorithms, architectural designs, and integrated modules are the exclusive intellectual property of Xlerion S.A.S. Protected under international copyright and software patent law."}
                                                    {selectedItem.id === 3 && "© 2024 Xlerion. Sistema de Reconocimiento Facial (Facial Recognition System) is proprietary technology incorporating artificial intelligence and computer vision algorithms. All source code, training datasets (processed), ML models, and documentation are the exclusive intellectual property of Xlerion S.A.S."}
                                                    {selectedItem.id === 4 && "© 2024 Xlerion. 3D Modeling & Animation collection represents original artistic works created with Blender. All 3D models, textures, rigs, animations, and rendered outputs are the exclusive intellectual property of Xlerion S.A.S."}
                                                    {selectedItem.id === 5 && "© 2024 Xlerion. Xlerion GreenWave is a proprietary AI-driven urban mobility optimization platform. All algorithms, traffic analysis systems, adaptive control mechanisms, real-time data processing, and 3D visualization engines are the exclusive intellectual property of Xlerion S.A.S. Patent pending in multiple jurisdictions."}
                                                    {selectedItem.id === 6 && "© 2024 Xlerion. Arquitectura de Documentación represents proprietary technical documentation architecture. All documentation structures, UX designs, content frameworks, and organizational systems are the exclusive intellectual property of Xlerion S.A.S."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="text-[#00e9fa] font-bold text-sm">®</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-mono uppercase tracking-[0.15em] text-[#00e9fa] mb-1">Credits & Attribution</p>
                                                <p className="text-xs text-gray-400">
                                                    {selectedItem.id === 1 && "Developed by: Xlerion Creative Engineering. Executive Production: Xlerion S.A.S. Music Production & Composition: Original scores by Xlerion Audio Lab. 3D Development: Xlerion 3D Studio. Interactive Design: Xlerion UX Innovation Team."}
                                                    {selectedItem.id === 2 && "Architecture & Development: Xlerion Software Engineering Team. Integration Engineering: Xlerion Systems Integration Lab. Quality Assurance: Xlerion QA Division. Documentation: Xlerion Technical Writing Team."}
                                                    {selectedItem.id === 3 && "AI/ML Engineering: Xlerion Artificial Intelligence Research Lab. Computer Vision Module: Xlerion Vision Systems. Security Implementation: Xlerion Cybersecurity Team. User Interface: Xlerion Design Studio."}
                                                    {selectedItem.id === 4 && "3D Artists: Xlerion 3D Modeling Team. Animation Direction: Xlerion Animation Studio. Texture & Lighting: Xlerion Visual Effects Lab. Asset Management: Xlerion Production Pipeline."}
                                                    {selectedItem.id === 5 && "Algorithm Development: Xlerion AI Research & Development. Traffic Analysis: Xlerion Urban Mobility Lab. 3D Engine & Visualization: Xlerion Graphics Engineering. Real-time Systems: Xlerion Performance Optimization Team."}
                                                    {selectedItem.id === 6 && "Documentation Architecture: Xlerion Information Architecture Team. UX Design: Xlerion User Experience Studio. Content Strategy: Xlerion Strategic Communications. Technical Review: Xlerion Engineering Oversight."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="text-[#00e9fa] font-bold text-sm">⚖</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-mono uppercase tracking-[0.15em] text-[#00e9fa] mb-1">Legal Notice & Restrictions</p>
                                                <p className="text-xs text-gray-400">
                                                    Unauthorized reproduction, distribution, modification, or commercial exploitation of this work or any component thereof is strictly prohibited and constitutes violation of international copyright law, the Digital Millennium Copyright Act (DMCA), and Colombian intellectual property statutes. All rights are reserved exclusively to Xlerion S.A.S. For licensing inquiries, contact: legal@xlerion.com
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="text-[#00e9fa] font-bold text-sm">∞</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-mono uppercase tracking-[0.15em] text-[#00e9fa] mb-1">Attribution Requirements</p>
                                                <p className="text-xs text-gray-400">
                                                    If authorized for use, attribution must include: "© 2024 Xlerion S.A.S. All rights reserved." This attribution must be prominently displayed in all derivative works, publications, presentations, and commercial applications. Failure to provide proper attribution constitutes breach of license agreement.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transit System Demo */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PortfolioReelsPage;
