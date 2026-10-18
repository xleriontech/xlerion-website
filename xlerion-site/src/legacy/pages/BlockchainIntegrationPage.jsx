import React, { useState } from 'react';
import { Lock, Shield, Link2, FileCheck, ChevronDown, Code, Zap, Database, Network, Key, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import TaxTrackerDemo from '../components/AIDemo/TaxTrackerDemo';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function BlockchainIntegrationPage() {
    const { t } = useLanguage();
    useAnalytics('Blockchain Integration', 'service');
    const [expandedFeature, setExpandedFeature] = useState(null);

    const cryptoAlgorithms = [
        { name: 'SHA-256', type: 'Hash', apps: 'Bitcoin, Ethereum, General' },
        { name: 'ECDSA', type: 'Firma Digital', apps: 'Wallets, Transacciones' },
        { name: 'AES-256', type: 'Cifrado Simétrico', apps: 'Datos Privados' },
        { name: 'RSA-4096', type: 'Cifrado Asimétrico', apps: 'Intercambio de Claves' },
    ];

    const blockchainNetworks = [
        { name: 'Ethereum', symbol: 'ETH', features: 'Smart Contracts, DeFi, NFTs' },
        { name: 'Polygon', symbol: 'MATIC', features: 'Layer 2, Escalabilidad' },
        { name: 'Bitcoin', symbol: 'BTC', features: 'PoW, Seguridad, UTXO' },
        { name: 'BSC', symbol: 'BNB', features: 'Alta velocidad, Costos bajos' },
    ];

    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/soluciones-parallax.jpg"
                    alt="Blockchain Integration Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Lock className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('blockchain_integration_banner_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('blockchain_integration_banner_title')}</h1>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('blockchain_integration_header')}</p>
                </header>

                {/* Key Features */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('blockchain_integration_features_title')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: t('blockchain_integration_feature_1_title'),
                                desc: t('blockchain_integration_feature_1_desc'),
                                details: 'Solidity, Vyper, Gas optimization, Auditoría de seguridad, Testing frameworks'
                            },
                            {
                                icon: Link2,
                                title: t('blockchain_integration_feature_2_title'),
                                desc: t('blockchain_integration_feature_2_desc'),
                                details: 'Merkle Trees, Timestamping, Event logging, Forensic analysis'
                            },
                            {
                                icon: FileCheck,
                                title: t('blockchain_integration_feature_3_title'),
                                desc: t('blockchain_integration_feature_3_desc'),
                                details: 'ERC-20, ERC-721, ERC-1155, Minting automation, Metadata IPFS'
                            },
                            {
                                icon: Lock,
                                title: t('blockchain_integration_feature_4_title'),
                                desc: t('blockchain_integration_feature_4_desc'),
                                details: 'Atomic swaps, Bridge protocols, Cross-chain messaging, Liquidity pools'
                            }
                        ].map((feature, idx) => {
                            const Icon = feature.icon;
                            const isExpanded = expandedFeature === idx;
                            return (
                                <div
                                    key={idx}
                                    className="p-8 border border-white/10 bg-white/5 rounded-sm hover:border-[#00e9fa]/50 transition-all cursor-pointer"
                                    onClick={() => setExpandedFeature(isExpanded ? null : idx)}
                                >
                                    <Icon size={24} className="text-[#00e9fa] mb-3" />
                                    <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center justify-between">
                                        {feature.title}
                                        <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-[#00e9fa] text-xs font-mono leading-relaxed">{feature.details}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Crypto Algorithms Table */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> Algoritmos Criptográficos
                    </h2>
                    <div className="overflow-x-auto border border-white/10 rounded-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em]">Algoritmo</th>
                                    <th className="px-6 py-4 text-left text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em]">Tipo</th>
                                    <th className="px-6 py-4 text-left text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em]">Aplicaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cryptoAlgorithms.map((algo, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white font-mono">{algo.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{algo.type}</td>
                                        <td className="px-6 py-4 text-gray-400">{algo.apps}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Blockchain Networks */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> Redes Blockchain Soportadas
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {blockchainNetworks.map((network, idx) => (
                            <div key={idx} className="p-6 border border-white/10 bg-white/5 rounded-sm hover:border-[#00e9fa]/50 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-white font-bold text-lg">{network.name}</h3>
                                    <span className="text-[#00e9fa] font-mono text-sm font-semibold">{network.symbol}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{network.features}</p>
                                <div className="mt-4 flex items-center gap-2 text-[#00e9fa] text-xs font-mono">
                                    <CheckCircle size={14} />
                                    Integración Completa
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Demo Section - Tax Tracker */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> Demo Interactiva - Rastreador de Impuestos
                    </h2>
                    <TaxTrackerDemo />
                </section>

                {/* Use Cases */}
                <section>
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('blockchain_integration_usecases_title')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('blockchain_integration_usecase_1_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('blockchain_integration_usecase_1_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('blockchain_integration_usecase_2_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('blockchain_integration_usecase_2_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('blockchain_integration_usecase_3_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('blockchain_integration_usecase_3_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('blockchain_integration_usecase_4_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('blockchain_integration_usecase_4_desc')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
