import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function RoadmapModal({ serviceId, serviceName, subserviceId, parameters, onClose }) {
    const { t, language } = useLanguage();
    const [roadmapData, setRoadmapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customParams] = useState(parameters || {});
    const [availableSubservices, setAvailableSubservices] = useState([]);
    const [selectedSubservice, setSelectedSubservice] = useState(subserviceId);

    // Load available subservices for the service
    useEffect(() => {
        if (!serviceId) return;
        fetch(`/api/roadmaps.php/templates?service=${serviceId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.subservices) {
                    setAvailableSubservices(data.data.subservices);
                    if (!selectedSubservice && data.data.subservices.length > 0) {
                        setSelectedSubservice(data.data.subservices[0].id);
                    }
                }
            })
            .catch(err => console.error('Error loading subservices:', err));
    }, [serviceId, selectedSubservice]);

    // Generate roadmap
    useEffect(() => {
        if (!serviceId || !selectedSubservice) return;

        const generateRoadmap = async () => {
            setLoading(true);
            setError(null);

            const payload = {
                service: serviceId,
                subservice: selectedSubservice,
                parameters: customParams
            };

            try {
                const res = await fetch('/api/roadmaps.php/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (data.success) {
                    setRoadmapData(data.roadmap);
                } else {
                    setError(data.error || 'Error generating roadmap');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        generateRoadmap();
    }, [serviceId, selectedSubservice, customParams]);    // Render sprint card
    const renderSprint = (sprint, index) => {
        const lang = language === 'es' ? 'es' : 'en';
        return (
            <div key={index} className="bg-black/40 border border-[#00e9fa]/30 rounded-lg p-4 hover:border-[#00e9fa] transition-all">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="text-lg font-bold text-[#00e9fa]">{sprint.name[lang]}</h4>
                        <p className="text-sm text-gray-400">{sprint.description[lang]}</p>
                    </div>
                    <span className="bg-[#00e9fa] text-black px-3 py-1 rounded-full text-sm font-bold">
                        {sprint.duration_weeks} {t('roadmap_weeks')}
                    </span>
                </div>

                {sprint.deliverables && sprint.deliverables.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{t('roadmap_deliverables')}</p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {sprint.deliverables.map((deliverable, i) => (
                                <li key={i}>{deliverable[lang]}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {sprint.roles && sprint.roles.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{t('roadmap_roles')}</p>
                        <div className="flex flex-wrap gap-2">
                            {sprint.roles.map((role, i) => (
                                <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render milestone marker
    const renderMilestone = (milestone, index) => {
        const lang = language === 'es' ? 'es' : 'en';
        return (
            <div key={index} className="my-4 p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🏁</span>
                    <div>
                        <p className="text-yellow-400 font-bold">{milestone.name[lang]}</p>
                        <p className="text-sm text-gray-400">{milestone.description[lang]}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#00e9fa] rounded-xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-[#00e9fa]/30 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-[#00e9fa] mb-2">
                                🗺️ {t('roadmap_title')} — {serviceName}
                            </h3>
                            <p className="text-gray-400">{t('roadmap_subtitle')}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-400 hover:text-white text-2xl transition-colors"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Subservice selector */}
                    {availableSubservices.length > 1 && (
                        <div className="mt-4">
                            <label className="text-sm text-gray-400 block mb-2">{t('roadmap_select_subservice')}</label>
                            <select
                                value={selectedSubservice}
                                onChange={(e) => setSelectedSubservice(e.target.value)}
                                className="w-full md:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00e9fa] focus:outline-none"
                            >
                                {availableSubservices.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name[language === 'es' ? 'es' : 'en']}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00e9fa]"></div>
                            <p className="ml-4 text-gray-400">{t('roadmap_loading')}</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400">
                            ⚠️ {t('roadmap_error')}: {error}
                        </div>
                    )}

                    {!loading && !error && roadmapData && (
                        <div className="space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#00e9fa]">{roadmapData.total_sprints}</p>
                                    <p className="text-sm text-gray-400">{t('roadmap_total_sprints')}</p>
                                </div>
                                <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#00e9fa]">{roadmapData.total_weeks}</p>
                                    <p className="text-sm text-gray-400">{t('roadmap_total_weeks')}</p>
                                </div>
                                <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#00e9fa]">{roadmapData.team.length}</p>
                                    <p className="text-sm text-gray-400">{t('roadmap_team_members')}</p>
                                </div>
                                <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#00e9fa]">{roadmapData.milestones.length}</p>
                                    <p className="text-sm text-gray-400">{t('roadmap_milestones')}</p>
                                </div>
                            </div>

                            {/* Team composition */}
                            <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-bold text-[#00e9fa] mb-3">👥 {t('roadmap_recommended_team')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {roadmapData.team.map((member, i) => (
                                        <span key={i} className="bg-[#00e9fa]/10 border border-[#00e9fa] text-[#00e9fa] px-3 py-1 rounded-full text-sm">
                                            {member}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Sprints timeline */}
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-4">📅 {t('roadmap_sprints_timeline')}</h4>
                                <div className="space-y-4">
                                    {roadmapData.sprints.map((sprint, index) => {
                                        // Check if there's a milestone after this sprint
                                        const milestone = roadmapData.milestones.find(m => m.after_sprint === sprint.name.en);
                                        return (
                                            <React.Fragment key={index}>
                                                {renderSprint(sprint, index)}
                                                {milestone && renderMilestone(milestone, index)}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Buffer info */}
                            {roadmapData.buffer_weeks > 0 && (
                                <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-4">
                                    <p className="text-orange-400 font-semibold">
                                        ⏱️ {t('roadmap_buffer_included')}: {roadmapData.buffer_weeks} {t('roadmap_weeks')}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">{t('roadmap_buffer_explanation')}</p>
                                </div>
                            )}

                            {/* Calibration projects */}
                            {roadmapData.calibration_projects && roadmapData.calibration_projects.length > 0 && (
                                <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
                                    <h4 className="text-lg font-bold text-[#00e9fa] mb-3">🎯 {t('roadmap_calibration_projects')}</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                        {roadmapData.calibration_projects.map((project, i) => (
                                            <li key={i}>{project}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
