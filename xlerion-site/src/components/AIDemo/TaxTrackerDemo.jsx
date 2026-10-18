import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Activity, Zap, ArrowRight, Building2, Heart, BookOpen, Truck, AlertCircle, Copy, CheckCircle, Lock, Clock, Package } from 'lucide-react';

// Custom SVG Icons in Xlerion Wireframe Style
const HeartIcon = ({ size = 16, color = '#00e9fa' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const BookIcon = ({ size = 16, color = '#00e9fa' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const RoadIcon = ({ size = 16, color = '#00e9fa' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M7 5h10" />
        <path d="M7 12h10" />
        <path d="M7 19h10" />
        <path d="M4 5v14" />
        <path d="M20 5v14" />
    </svg>
);

const ShieldIcon = ({ size = 16, color = '#00e9fa' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const BuildingIcon = ({ size = 16, color = '#00e9fa' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="4" y="2" width="16" height="20" />
        <path d="M8 7h1v3H8zM8 12h1v3H8zM8 17h1v3H8z" />
        <path d="M13 7h1v3h-1zM13 12h1v3h-1zM13 17h1v3h-1z" />
        <path d="M18 7h1v3h-1zM18 12h1v3h-1zM18 17h1v3h-1z" />
    </svg>
);

// Generate a mock SHA-256 hash (simulating blockchain transaction)
const generateTransactionHash = (data) => {
    let hash = 0;
    const str = JSON.stringify(data);
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Convert to hex and create a realistic 64-character hash
    const hex = Math.abs(hash).toString(16).padStart(64, '0').substring(0, 64);
    return hex;
};

// Generate blockchain records for each allocation
const generateBlockchainRecords = (transactionData, allocations) => {
    return allocations.map((allocation) => {
        const blockData = {
            transaction_id: transactionData.id,
            timestamp: new Date().toISOString(),
            sector: allocation.id,
            amount: allocation.amount,
            percentage: allocation.percentage,
            merchant: transactionData.merchant,
            amount_cop: transactionData.basePrice
        };
        return {
            ...allocation,
            hash: generateTransactionHash(blockData),
            blockData
        };
    });
};

const TaxTrackerDemo = () => {
    const [animatingAllocation, setAnimatingAllocation] = useState(false);
    const [transactionAmount, setTransactionAmount] = useState(1000000); // COP
    const [blockchainRecords, setBlockchainRecords] = useState([]);
    const [copiedHash, setCopiedHash] = useState(null);
    const [selectedBlockRecord, setSelectedBlockRecord] = useState(null);
    const [timelineDay, setTimelineDay] = useState(0);
    const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
    const [timelineEvents, setTimelineEvents] = useState([]);

    // Mock transactions
    const transactions = [
        {
            id: 1,
            date: '2026-01-27',
            product: 'Laptop',
            basePrice: 1000000,
            ivaRate: 0.19,
            merchant: 'TechStore Colombia',
            category: 'Electrónica'
        },
        {
            id: 2,
            date: '2026-01-26',
            product: 'Consulta Médica',
            basePrice: 500000,
            ivaRate: 0.19,
            merchant: 'Clínica San Rafael',
            category: 'Salud'
        },
        {
            id: 3,
            date: '2026-01-25',
            product: 'Servicio de Internet',
            basePrice: 200000,
            ivaRate: 0.19,
            merchant: 'ISP Colombia',
            category: 'Servicios'
        }
    ];

    // Tax allocation sectors (based on Colombian tax distribution)
    const taxAllocation = [
        {
            id: 'salud',
            name: 'Salud Pública',
            icon: HeartIcon,
            percentage: 25,
            color: '#00e9fa',
            amount: (transactionAmount * 0.19) * 0.25,
            description: 'Hospitales, medicinas, programas preventivos',
            icon_bg: 'bg-[#00e9fa]/10'
        },
        {
            id: 'educacion',
            name: 'Educación',
            icon: BookIcon,
            percentage: 20,
            color: '#00e9fa',
            amount: (transactionAmount * 0.19) * 0.20,
            description: 'Escuelas, universidades, becas',
            icon_bg: 'bg-[#00e9fa]/10'
        },
        {
            id: 'vias',
            name: 'Infraestructura (Vías)',
            icon: RoadIcon,
            percentage: 30,
            color: '#00e9fa',
            amount: (transactionAmount * 0.19) * 0.30,
            description: 'Carreteras, puentes, mantenimiento',
            icon_bg: 'bg-[#00e9fa]/10'
        },
        {
            id: 'defensa',
            name: 'Seguridad y Defensa',
            icon: ShieldIcon,
            percentage: 15,
            color: '#00e9fa',
            amount: (transactionAmount * 0.19) * 0.15,
            description: 'Fuerzas armadas, policía, seguridad',
            icon_bg: 'bg-[#00e9fa]/10'
        },
        {
            id: 'otros',
            name: 'Otros Servicios',
            icon: BuildingIcon,
            percentage: 10,
            color: '#00e9fa',
            amount: (transactionAmount * 0.19) * 0.10,
            description: 'Cultura, ambiente, servicios varios',
            icon_bg: 'bg-[#00e9fa]/10'
        }
    ];

    const ivaAmount = transactionAmount * 0.19;
    const totalPrice = transactionAmount + ivaAmount;

    // Generate timeline events showing progressive spending
    const generateTimelineEvents = (amount) => {
        const ivaTotal = amount * 0.19;
        return [
            {
                day: 1,
                sector: 'vias',
                sectorName: 'Infraestructura (Vías)',
                color: '#00e9fa',
                amount: ivaTotal * 0.30,
                items: [
                    { item: 'Asfalto para 50m de carretera', cost: ivaTotal * 0.30 * 0.40 },
                    { item: 'Pintura demarcación vial', cost: ivaTotal * 0.30 * 0.25 },
                    { item: 'Señalización de tránsito', cost: ivaTotal * 0.30 * 0.35 }
                ]
            },
            {
                day: 2,
                sector: 'salud',
                sectorName: 'Salud Pública',
                color: '#00e9fa',
                amount: ivaTotal * 0.25,
                items: [
                    { item: 'Vacunas para 20 niños', cost: ivaTotal * 0.25 * 0.35 },
                    { item: 'Medicamentos genéricos', cost: ivaTotal * 0.25 * 0.40 },
                    { item: 'Consultas médicas gratuitas', cost: ivaTotal * 0.25 * 0.25 }
                ]
            },
            {
                day: 3,
                sector: 'educacion',
                sectorName: 'Educación',
                color: '#00e9fa',
                amount: ivaTotal * 0.20,
                items: [
                    { item: 'Libros de texto (50 unidades)', cost: ivaTotal * 0.20 * 0.40 },
                    { item: 'Material escolar', cost: ivaTotal * 0.20 * 0.30 },
                    { item: 'Beca parcial para estudiante', cost: ivaTotal * 0.20 * 0.30 }
                ]
            },
            {
                day: 4,
                sector: 'defensa',
                sectorName: 'Seguridad y Defensa',
                color: '#00e9fa',
                amount: ivaTotal * 0.15,
                items: [
                    { item: 'Equipamiento policía', cost: ivaTotal * 0.15 * 0.40 },
                    { item: 'Patrullaje y vigilancia', cost: ivaTotal * 0.15 * 0.35 },
                    { item: 'Centro de atención 123', cost: ivaTotal * 0.15 * 0.25 }
                ]
            },
            {
                day: 5,
                sector: 'otros',
                sectorName: 'Otros Servicios',
                color: '#00e9fa',
                amount: ivaTotal * 0.10,
                items: [
                    { item: 'Mantenimiento parques', cost: ivaTotal * 0.10 * 0.35 },
                    { item: 'Biblioteca pública', cost: ivaTotal * 0.10 * 0.40 },
                    { item: 'Programa reciclaje', cost: ivaTotal * 0.10 * 0.25 }
                ]
            }
        ];
    };

    const handleSimulateTransaction = () => {
        // Find the first transaction (or create a mock one)
        const currentTransaction = {
            id: `TXN-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            product: 'Compra Simulada',
            basePrice: transactionAmount,
            ivaRate: 0.19,
            merchant: 'Sistema de Rastreo IVA',
            category: 'Demo'
        };

        // Generate blockchain records with hashes
        const records = generateBlockchainRecords(currentTransaction, taxAllocation);
        setBlockchainRecords(records);

        // Generate and start timeline
        const events = generateTimelineEvents(transactionAmount);
        setTimelineEvents(events);
        setTimelineDay(0);
        setIsTimelinePlaying(true);

        // Trigger animation
        setAnimatingAllocation(true);
    };

    // Auto-advance timeline
    useEffect(() => {
        if (isTimelinePlaying && timelineDay < timelineEvents.length) {
            const timer = setTimeout(() => {
                setTimelineDay(prev => {
                    const nextDay = prev + 1;
                    if (nextDay >= timelineEvents.length) {
                        setIsTimelinePlaying(false);
                    }
                    return nextDay;
                });
            }, 2000); // 2 seconds per day
            return () => clearTimeout(timer);
        }
    }, [isTimelinePlaying, timelineDay, timelineEvents.length]);

    const copyToClipboard = (hash) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <div className="space-y-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <DollarSign size={32} className="text-[#00e9fa]" />
                        <h2 className="text-3xl font-bold text-white">Rastreador de Impuestos IVA</h2>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Visualiza en tiempo real cómo los impuestos que pagas en Colombia se distribuyen en salud, educación, vías e infraestructura
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Transaction Simulator */}
                    <div className="space-y-6">
                        {/* Amount Input */}
                        <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                            <label className="block text-gray-400 text-sm font-mono mb-3">
                                Simular Monto de Compra (COP)
                            </label>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#00e9fa] font-mono">$</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={transactionAmount.toLocaleString('es-CO')}
                                    onChange={(e) => {
                                        // Remove non-numeric characters except for empty string
                                        const cleaned = e.target.value.replace(/\D/g, '');
                                        if (cleaned === '') {
                                            setTransactionAmount(0);
                                        } else {
                                            const numValue = parseInt(cleaned, 10);
                                            if (!isNaN(numValue)) {
                                                setTransactionAmount(numValue);
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        // Validate on blur (when user leaves the field)
                                        if (transactionAmount < 10000) {
                                            setTransactionAmount(10000);
                                        }
                                    }}
                                    className="flex-1 bg-black/50 border border-white/10 text-white px-4 py-2 rounded font-mono text-lg focus:outline-none focus:border-[#00e9fa]"
                                    placeholder="Ej: 1.000.000"
                                />
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 bg-black/50 p-4 rounded border border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Precio Base:</span>
                                    <span className="text-white font-mono">$ {transactionAmount.toLocaleString('es-CO')}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
                                    <span className="text-gray-400">IVA (19%):</span>
                                    <span className="text-[#ef4444] font-mono">+ $ {Math.round(ivaAmount).toLocaleString('es-CO')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 mt-2">
                                    <span className="text-white">Total a Pagar:</span>
                                    <span className="text-[#00e9fa] font-mono">$ {Math.round(totalPrice).toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-[#00e9fa]" />
                                Transacciones Recientes
                            </h3>
                            <div className="space-y-2">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        onClick={() => {
                                            setTransactionAmount(tx.basePrice);
                                            setAnimatingAllocation(false);
                                            // Reset bars to 0 before animating again
                                            setTimeout(() => setAnimatingAllocation(true), 50);
                                        }}
                                        className="p-3 bg-white/5 border border-white/10 rounded cursor-pointer hover:border-[#00e9fa]/50 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-white text-sm font-semibold">{tx.product}</p>
                                                <p className="text-gray-500 text-xs">{tx.merchant}</p>
                                            </div>
                                            <span className="text-[#00e9fa] text-sm font-mono">$ {tx.basePrice.toLocaleString('es-CO')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleSimulateTransaction}
                                className="w-full mt-4 py-2 bg-[#00e9fa] text-black font-bold rounded hover:bg-[#00d9ea] transition-colors"
                            >
                                Rastrear Impuestos
                            </button>
                        </div>
                    </div>

                    {/* Right: Tax Allocation Visualization */}
                    <div className="space-y-6">
                        {/* Allocation Overview */}
                        <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-[#00e9fa]" />
                                Distribución del IVA Recaudado
                            </h3>

                            {/* Progress Bars */}
                            <div className="space-y-4">
                                {taxAllocation.map((sector) => {
                                    const Icon = sector.icon;
                                    return (
                                        <div key={sector.id}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded ${sector.icon_bg}`}>
                                                        <Icon size={16} style={{ color: sector.color }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-semibold">{sector.name}</p>
                                                        <p className="text-gray-500 text-xs">{sector.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#00e9fa] font-mono text-sm">$ {Math.round(sector.amount).toLocaleString('es-CO')}</p>
                                                    <p className="text-gray-500 text-xs font-mono">{sector.percentage}%</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: animatingAllocation ? `${sector.percentage}%` : '0%',
                                                        backgroundColor: sector.color
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total IVA Summary */}
                            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-mono">Total IVA a Distribuir:</span>
                                    <span className="text-[#00e9fa] font-bold font-mono text-lg">
                                        $ {Math.round(ivaAmount).toLocaleString('es-CO')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blockchain Records Section */}
                {blockchainRecords.length > 0 && (
                    <div className="bg-[#1a1a1a] border border-green-500/30 rounded-lg p-6">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Lock size={18} className="text-green-400" />
                            Registros en Blockchain - Hashes de Transacción
                        </h3>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {blockchainRecords.map((record) => (
                                <div
                                    key={record.id}
                                    onClick={() => setSelectedBlockRecord(selectedBlockRecord?.id === record.id ? null : record)}
                                    className="p-4 bg-black/50 border border-green-500/20 rounded cursor-pointer hover:border-green-500/50 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded ${record.icon_bg}`}>
                                                {(() => {
                                                    const Icon = record.icon;
                                                    return <Icon size={14} style={{ color: record.color }} />;
                                                })()}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{record.name}</p>
                                                <p className="text-green-400 text-xs font-mono">$ {Math.round(record.amount).toLocaleString('es-CO')}</p>
                                            </div>
                                        </div>
                                        <span className="text-green-400 text-xs font-mono">{record.percentage}%</span>
                                    </div>

                                    {/* Hash Display */}
                                    <div className="bg-black/80 p-3 rounded border border-green-500/20 font-mono text-xs">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500">Hash SHA-256:</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(record.hash);
                                                }}
                                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                            >
                                                {copiedHash === record.hash ? (
                                                    <CheckCircle size={14} className="text-green-400" />
                                                ) : (
                                                    <Copy size={14} className="text-gray-500 hover:text-[#00e9fa]" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-green-500 break-all select-all">{record.hash}</p>
                                    </div>

                                    {/* Expandable Details */}
                                    {selectedBlockRecord?.id === record.id && (
                                        <div className="mt-3 pt-3 border-t border-green-500/20 space-y-2">
                                            <div className="text-xs text-gray-400 space-y-1">
                                                <p><span className="text-green-400">Timestamp:</span> {record.blockData.timestamp}</p>
                                                <p><span className="text-green-400">Transaction ID:</span> {record.blockData.transaction_id}</p>
                                                <p><span className="text-green-400">Merchant:</span> {record.blockData.merchant}</p>
                                                <p><span className="text-green-400">Monto Base (COP):</span> $ {record.blockData.amount_cop.toLocaleString('es-CO')}</p>
                                                <p><span className="text-green-400">Sector:</span> {record.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
                            <p className="font-semibold mb-1">✓ Registrados en Blockchain</p>
                            <p className="text-gray-400">
                                Cada transacción de IVA genera un hash único e inmutable. Imposible alterar los registros. Auditoría total y transparencia.
                            </p>
                        </div>
                    </div>
                )}

                {/* Impact Timeline */}
                <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Zap size={18} className="text-[#00e9fa]" />
                        Impacto Social del IVA Recaudado
                    </h3>

                    <div className="grid md:grid-cols-5 gap-4">
                        {taxAllocation.map((sector) => (
                            <div key={sector.id} className="relative">
                                <div className={`p-4 rounded border border-white/10 bg-white/5 text-center`}>
                                    <div className={`p-3 rounded mb-3 ${sector.icon_bg} flex justify-center`}>
                                        {(() => {
                                            const Icon = sector.icon;
                                            return <Icon size={24} style={{ color: sector.color }} />;
                                        })()}
                                    </div>
                                    <p className="text-white text-xs font-semibold mb-2">{sector.name}</p>
                                    <p className="text-[#00e9fa] font-mono text-sm font-bold">
                                        $ {Math.round(sector.amount).toLocaleString('es-CO')}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-2">
                                        {sector.percentage}% de los impuestos
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Impact Examples */}
                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-[#00e9fa]/10 border border-[#00e9fa]/30 rounded">
                            <p className="text-[#00e9fa] font-semibold text-sm mb-2 flex items-center gap-2">
                                <HeartIcon size={14} color="#00e9fa" />
                                Ejemplo Salud:
                            </p>
                            <p className="text-gray-300 text-xs">
                                Tu IVA de $ {Math.round(ivaAmount * 0.25).toLocaleString('es-CO')} contribuye a medicinas, consultas médicas y tratamientos en hospitales públicos.
                            </p>
                        </div>
                        <div className="p-4 bg-[#00e9fa]/10 border border-[#00e9fa]/30 rounded">
                            <p className="text-[#00e9fa] font-semibold text-sm mb-2 flex items-center gap-2">
                                <BookIcon size={14} color="#00e9fa" />
                                Ejemplo Educación:
                            </p>
                            <p className="text-gray-300 text-xs">
                                Tu IVA de $ {Math.round(ivaAmount * 0.20).toLocaleString('es-CO')} financia becas, colegios y universidades públicas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progressive Timeline - Day by Day Spending */}
                {timelineEvents.length > 0 && (
                    <div className="bg-[#1a1a1a] border border-[#00e9fa]/30 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Clock size={18} className="text-[#00e9fa]" />
                                Línea de Tiempo - Distribución Progresiva del IVA
                            </h3>
                            <div className="text-[#00e9fa] font-mono text-sm">
                                {isTimelinePlaying ? `Día ${timelineDay} de ${timelineEvents.length}` : `Completado (${timelineEvents.length} días)`}
                            </div>
                        </div>

                        {/* Timeline Visualization */}
                        <div className="space-y-4">
                            {timelineEvents.map((event, idx) => {
                                const isVisible = idx < timelineDay;
                                const isCurrent = idx === timelineDay - 1;

                                return (
                                    <div
                                        key={idx}
                                        className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                            }`}
                                    >
                                        {/* Day Badge */}
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold ${isCurrent
                                                ? 'border-[#00e9fa] bg-[#00e9fa]/20 text-[#00e9fa] animate-pulse'
                                                : isVisible
                                                    ? 'border-green-500 bg-green-500/20 text-green-400'
                                                    : 'border-gray-600 bg-gray-800 text-gray-500'
                                                }`}>
                                                Día {event.day}
                                            </div>

                                            {/* Event Details */}
                                            <div className="flex-1">
                                                <div className={`p-4 rounded-lg border ${isCurrent
                                                    ? 'border-[#00e9fa] bg-[#00e9fa]/5'
                                                    : isVisible
                                                        ? 'border-green-500/30 bg-green-500/5'
                                                        : 'border-gray-700 bg-gray-800/50'
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-white font-bold flex items-center gap-2">
                                                            <Package size={16} style={{ color: event.color }} />
                                                            {event.sectorName}
                                                        </h4>
                                                        <span className="text-white font-mono font-bold">
                                                            $ {Math.round(event.amount).toLocaleString('es-CO')}
                                                        </span>
                                                    </div>

                                                    {/* Items purchased/funded */}
                                                    {isVisible && (
                                                        <div className="space-y-2 mt-3">
                                                            {event.items.map((item, itemIdx) => (
                                                                <div
                                                                    key={itemIdx}
                                                                    className="flex items-center justify-between text-sm bg-black/30 p-2 rounded"
                                                                    style={{
                                                                        animation: isCurrent ? `fadeIn 0.5s ease-in ${itemIdx * 0.3}s both` : 'none'
                                                                    }}
                                                                >
                                                                    <span className="text-gray-300">• {item.item}</span>
                                                                    <span className="text-gray-400 font-mono">
                                                                        $ {Math.round(item.cost).toLocaleString('es-CO')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Status indicator */}
                                                    {isVisible && (
                                                        <div className="mt-3 flex items-center gap-2 text-xs">
                                                            {isCurrent ? (
                                                                <>
                                                                    <div className="w-2 h-2 bg-[#00e9fa] rounded-full animate-pulse"></div>
                                                                    <span className="text-[#00e9fa] font-semibold">Procesando ahora...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle size={14} className="text-green-400" />
                                                                    <span className="text-green-400">Completado y registrado en blockchain</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connecting line */}
                                        {idx < timelineEvents.length - 1 && (
                                            <div className={`ml-8 w-0.5 h-8 transition-colors ${isVisible ? 'bg-[#00e9fa]' : 'bg-gray-700'
                                                }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        {timelineDay >= timelineEvents.length && !isTimelinePlaying && (
                            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
                                <p className="text-green-400 font-semibold mb-2">✓ Distribución Completada</p>
                                <p className="text-gray-400 text-sm">
                                    Todo el IVA recaudado ($ {Math.round(ivaAmount).toLocaleString('es-CO')}) fue distribuido exitosamente
                                    en {timelineEvents.length} días. Cada transacción está registrada en blockchain de forma permanente.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Blockchain Transparency Notice */}
                <div className="bg-amber-950/30 border border-amber-600/50 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-amber-100">
                        <p className="font-semibold mb-1">🔐 Transparencia con Blockchain</p>
                        <p>
                            En una implementación en producción, cada transacción y distribución de impuestos sería registrada en un ledger distribuido (blockchain) para garantizar trazabilidad total, auditoría permanente y eliminación de corrupción.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaxTrackerDemo;
