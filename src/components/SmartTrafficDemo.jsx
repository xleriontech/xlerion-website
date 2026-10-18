import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

const OPPOSITE_PHASE = { NS: 'EW', EW: 'NS' };

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

const VehicleDot = ({ dir, progress, type }) => {
    let x = 50, y = 50;
    const p = clamp(progress, 0, 1);
    if (dir === 'N') y = 0 + p * 100;
    if (dir === 'S') y = 100 - p * 100;
    if (dir === 'E') x = 100 - p * 100;
    if (dir === 'W') x = 0 + p * 100;
    const size = type === 'bus' ? 8 : 6;
    const colors = { car: 'bg-cyan-300', motorcycle: 'bg-yellow-400', bus: 'bg-orange-400' };
    const color = colors[type] || 'bg-cyan-300';
    return (
        <div className="absolute" style={{ left: `calc(${x}% - ${size / 2}px)`, top: `calc(${y}% - ${size / 2}px)` }}>
            <div className={`${color} shadow-[0_0_6px_rgba(0,233,250,0.6)] rounded-sm`} style={{ width: `${size}px`, height: `${size}px` }} />
        </div>
    );
};

const WaitingStack = ({ count, dir }) => {
    const show = Math.min(10, count);
    const nodes = [];
    for (let i = 0; i < show; i++) {
        let style = {};
        const offset = i * 8;
        if (dir === 'N') style = { left: '50%', top: `${8 + offset}px`, transform: 'translateX(-50%)' };
        if (dir === 'S') style = { left: '50%', bottom: `${8 + offset}px`, transform: 'translateX(-50%)' };
        if (dir === 'E') style = { right: `${8 + offset}px`, top: '50%', transform: 'translateY(-50%)' };
        if (dir === 'W') style = { left: `${8 + offset}px`, top: '50%', transform: 'translateY(-50%)' };
        nodes.push(
            <div key={dir + ':' + i} className="absolute" style={style}>
                <div className="w-[6px] h-[6px] rounded-[2px] bg-white/70" />
            </div>
        );
    }
    return (
        <>
            {nodes}
            {count > show && (
                <div className="absolute text-[10px] text-white/70" style={dir === 'N' ? { left: '50%', top: `${8 + show * 8 + 4}px`, transform: 'translateX(-50%)' }
                    : dir === 'S' ? { left: '50%', bottom: `${8 + show * 8 + 4}px`, transform: 'translateX(-50%)' }
                        : dir === 'E' ? { right: `${8 + show * 8 + 4}px`, top: '50%', transform: 'translateY(-50%)' }
                            : { left: `${8 + show * 8 + 4}px`, top: '50%', transform: 'translateY(-50%)' }}>
                    +{count - show}
                </div>
            )}
        </>
    );
};

export default function SmartTrafficDemo() {
    const { t } = useLanguage();

    const [mode, setMode] = useState('intelligent'); // 'intelligent' | 'traditional'
    const [running, setRunning] = useState(true);
    const [speed, setSpeed] = useState(1); // 0.5x .. 2x
    const [preset, setPreset] = useState('normal'); // 'valley' | 'normal' | 'rush'

    // Vehicle composition: count by type (cars, motorcycles, buses)
    const [vehicleTypes, setVehicleTypes] = useState({ car: 0.6, motorcycle: 0.25, bus: 0.15 });

    const [waiting, setWaiting] = useState({ N: 8, S: 5, E: 14, W: 3 });
    const [phase, setPhase] = useState('NS'); // NS or EW
    const [lastReleased, setLastReleased] = useState({ N: 0, S: 0, E: 0, W: 0, total: 0 });
    const [totals, setTotals] = useState({ N: 0, S: 0, E: 0, W: 0, total: 0 });
    const [cycleStats, setCycleStats] = useState({ intelligent: 0, traditional: 0, intelligentTotal: 0, traditionalTotal: 0 });

    const [active, setActive] = useState([]); // vehicles crossing: {id, dir, progress, type}
    const idRef = useRef(1);

    // current cycle plan and timing
    const planRef = useRef(null);
    const lastTickRef = useRef(null);
    const arrivalAccRef = useRef(0);

    // Initialize refs once
    useEffect(() => {
        if (!planRef.current) {
            planRef.current = { plan: { N: 0, S: 0, E: 0, W: 0, total: 0 }, remaining: { N: 0, S: 0, E: 0, W: 0, total: 0 }, startedAt: performance.now(), durationSec: 2 };
        }
        if (!lastTickRef.current) {
            lastTickRef.current = performance.now();
        }
    }, []);

    // Arrival rate configuration by preset
    const arrivalRates = useMemo(() => ({
        valley: { N: 0.3, S: 0.25, E: 0.4, W: 0.2 },       // low flow
        normal: { N: 0.9, S: 0.8, E: 1.1, W: 0.6 },        // medium flow
        rush: { N: 1.5, S: 1.4, E: 1.8, W: 1.2 }           // high flow
    }), []);

    // Vehicle capacity weights: relative units
    const _capacityWeights = useMemo(() => ({
        car: 1,                 // 1 unit
        motorcycle: 0.7,        // 0.7 units
        bus: 3                  // 3 units
    }), []);

    const isNS = phase === 'NS';

    const lights = useMemo(() => ({
        N: isNS ? 'green' : 'red',
        S: isNS ? 'green' : 'red',
        E: isNS ? 'red' : 'green',
        W: isNS ? 'red' : 'green',
    }), [isNS]);

    // Helpers
    const computeNextPlan = useCallback((w, currentPhase) => {
        const cap = mode === 'intelligent' ? 20 : 10; // Regla principal y comparación
        if (mode === 'traditional') {
            const nextPhase = OPPOSITE_PHASE[currentPhase];
            const group = nextPhase === 'NS' ? (w.N + w.S) : (w.E + w.W);
            const total = Math.min(cap, group);
            let a = 0, b = 0;
            if (nextPhase === 'NS') {
                const sum = w.N + w.S;
                if (sum > 0) { a = Math.floor(total * (w.N / sum)); b = total - a; }
                return { phase: 'NS', plan: { N: a, S: b, E: 0, W: 0, total } };
            } else {
                const sum = w.E + w.W;
                if (sum > 0) { a = Math.floor(total * (w.E / sum)); b = total - a; }
                return { phase: 'EW', plan: { N: 0, S: 0, E: a, W: b, total } };
            }
        }
        // Intelligent: elegir grupo con mayor demanda y repartir proporcionalmente
        const demNS = w.N + w.S;
        const demEW = w.E + w.W;
        const chosen = demNS >= demEW ? 'NS' : 'EW';
        const demand = chosen === 'NS' ? demNS : demEW;
        const total = Math.min(cap, demand);
        if (chosen === 'NS') {
            let a = 0, b = 0; const sum = demNS;
            if (sum > 0) { a = Math.floor(total * (w.N / sum)); b = total - a; }
            return { phase: 'NS', plan: { N: a, S: b, E: 0, W: 0, total } };
        } else {
            let a = 0, b = 0; const sum = demEW;
            if (sum > 0) { a = Math.floor(total * (w.E / sum)); b = total - a; }
            return { phase: 'EW', plan: { N: 0, S: 0, E: a, W: b, total } };
        }
    }, [mode]);

    const beginCycle = (nextPhase, nextPlan) => {
        const release = { ...nextPlan.plan };
        const durationSec = Math.max(0.8, nextPlan.plan.total / 6); // ~6 veh/seg → 20 veh ≈ 3.3s
        planRef.current = {
            plan: { ...release, total: nextPlan.plan.total },
            remaining: { ...release, total: nextPlan.plan.total },
            startedAt: performance.now(),
            durationSec,
        };
        setPhase(nextPhase);
    };

    const spawnCrossing = useCallback((dir, count) => {
        if (count <= 0) return [];
        const items = [];
        for (let i = 0; i < count; i++) {
            // Randomly assign vehicle type based on composition
            const rand = Math.random();
            let type = 'car';
            if (rand < vehicleTypes.motorcycle) type = 'motorcycle';
            else if (rand < vehicleTypes.motorcycle + vehicleTypes.bus) type = 'bus';
            items.push({ id: idRef.current++, dir, progress: 0, type });
        }
        return items;
    }, [vehicleTypes]);

    const reset = () => {
        setWaiting({ N: 8, S: 5, E: 14, W: 3 });
        setPhase('NS');
        setLastReleased({ N: 0, S: 0, E: 0, W: 0, total: 0 });
        setTotals({ N: 0, S: 0, E: 0, W: 0, total: 0 });
        setCycleStats({ intelligent: 0, traditional: 0, intelligentTotal: 0, traditionalTotal: 0 });
        setActive([]);
        planRef.current = { plan: { N: 0, S: 0, E: 0, W: 0, total: 0 }, remaining: { N: 0, S: 0, E: 0, W: 0, total: 0 }, startedAt: performance.now(), durationSec: 1.2 };
    };

    // Main loop
    useEffect(() => {
        lastTickRef.current = performance.now();
        const interval = setInterval(() => {
            if (!running) { lastTickRef.current = performance.now(); return; }
            const now = performance.now();
            const dt = ((now - lastTickRef.current) / 1000) * speed; // seconds scaled
            lastTickRef.current = now;

            // 1) arrivals (approx every 1s)
            arrivalAccRef.current += dt;
            if (arrivalAccRef.current >= 1) {
                arrivalAccRef.current = 0;
                setWaiting(prev => {
                    const addRand = (baseP) => {
                        // probability of 0..3 arrivals biased to 0/1
                        const r = Math.random();
                        if (r < baseP * 0.5) return 0;
                        if (r < baseP * 0.8) return 1;
                        if (r < baseP * 0.95) return 2;
                        return 3;
                    };
                    // Use preset-based arrival rates
                    const rates = arrivalRates[preset];
                    const inc = {
                        N: addRand(rates.N),
                        S: addRand(rates.S),
                        E: addRand(rates.E),
                        W: addRand(rates.W),
                    };
                    return {
                        N: prev.N + inc.N,
                        S: prev.S + inc.S,
                        E: prev.E + inc.E,
                        W: prev.W + inc.W,
                    };
                });
            }

            // 2) release per current plan
            setWaiting(prevWaiting => {
                const current = planRef.current;
                let remaining = { ...current.remaining };
                let greenDirs = phase === 'NS' ? ['N', 'S'] : ['E', 'W'];

                // compute to release this tick: target 6 veh/s across the green pair
                const target = 6 * dt;
                const pairRemaining = greenDirs.reduce((acc, d) => acc + (remaining[d] || 0), 0);

                let spawn = { N: 0, S: 0, E: 0, W: 0 };
                if (pairRemaining > 0) {
                    // proportional release across the two directions
                    for (const d of greenDirs) {
                        const share = remaining[d] / pairRemaining;
                        spawn[d] = Math.min(remaining[d], Math.floor(target * share + 0.0001));
                    }
                    // ensure at least one if any remaining and target accumulated small
                    if (spawn[greenDirs[0]] + spawn[greenDirs[1]] === 0) {
                        const pick = remaining[greenDirs[0]] >= remaining[greenDirs[1]] ? greenDirs[0] : greenDirs[1];
                        spawn[pick] = 1;
                    }
                }

                // Apply spawn to waiting counts and plan remaining
                const nextWaiting = { ...prevWaiting };
                for (const d of greenDirs) {
                    const s = clamp(spawn[d], 0, nextWaiting[d]);
                    nextWaiting[d] = nextWaiting[d] - s;
                    remaining[d] -= s;
                    current.remaining[d] = remaining[d];
                }
                const releasedThisTick = (spawn.N || 0) + (spawn.S || 0) + (spawn.E || 0) + (spawn.W || 0);
                current.remaining.total = Math.max(0, current.remaining.total - releasedThisTick);

                // spawn active vehicles for animation
                const newActive = [
                    ...spawnCrossing(greenDirs[0], spawn[greenDirs[0]]),
                    ...spawnCrossing(greenDirs[1], spawn[greenDirs[1]]),
                ];
                if (newActive.length) { setActive(prev => [...prev, ...newActive]); }

                // if cycle done → finalize and choose next cycle
                if (current.remaining.total <= 0) {
                    const finalReleased = { ...current.plan };
                    setLastReleased({ ...finalReleased, total: finalReleased.total || 0 });
                    setTotals(prev => ({
                        N: prev.N + finalReleased.N,
                        S: prev.S + finalReleased.S,
                        E: prev.E + finalReleased.E,
                        W: prev.W + finalReleased.W,
                        total: prev.total + (finalReleased.total || 0)
                    }));

                    // Track efficiency: intelligent mode can release up to 20 per cycle vs traditional 10
                    setCycleStats(prev => ({
                        intelligent: mode === 'intelligent' ? prev.intelligent + 1 : prev.intelligent,
                        traditional: mode === 'traditional' ? prev.traditional + 1 : prev.traditional,
                        intelligentTotal: mode === 'intelligent' ? prev.intelligentTotal + (finalReleased.total || 0) : prev.intelligentTotal,
                        traditionalTotal: mode === 'traditional' ? prev.traditionalTotal + (finalReleased.total || 0) : prev.traditionalTotal
                    }));

                    // compute next cycle based on updated waiting snapshot
                    const snap = { ...nextWaiting };
                    const next = computeNextPlan(snap, phase);
                    beginCycle(next.phase, next);
                }

                return nextWaiting;
            });

            // 3) animate active vehicles
            setActive(prev => {
                if (prev.length === 0) return prev;
                const speedPerSec = 1 / 1.2; // finish in ~1.2s
                const updated = prev.map(v => ({ ...v, progress: v.progress + speedPerSec * dt }));
                return updated.filter(v => v.progress < 1.0);
            });

        }, 200);
        return () => clearInterval(interval);
    }, [running, speed, mode, phase, preset, arrivalRates, computeNextPlan, spawnCrossing]);

    // Kick-off initial plan on mount and when mode changes
    useEffect(() => {
        const next = computeNextPlan(waiting, OPPOSITE_PHASE[phase]);
        // Use a timer to avoid cascading setState during effect
        const timer = setTimeout(() => {
            beginCycle(next.phase, next);
        }, 0);
        return () => clearTimeout(timer);
    }, [mode, computeNextPlan, waiting, phase]);

    // UI helpers
    const lightClass = (c) => c === 'green' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Visualization */}
            <div className="w-full flex flex-col gap-4">
                {/* Control row 1: Mode selector */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm">{t('traffic_mode')}:</span>
                        <div className="inline-flex bg-secondary/60 rounded-md overflow-hidden">
                            <button
                                className={`px-3 py-1 text-sm ${mode === 'traditional' ? 'bg-primary text-black' : 'text-white/80'}`}
                                onClick={() => setMode('traditional')}
                            >{t('traffic_mode_traditional')}</button>
                            <button
                                className={`px-3 py-1 text-sm ${mode === 'intelligent' ? 'bg-primary text-black' : 'text-white/80'}`}
                                onClick={() => setMode('intelligent')}
                            >{t('traffic_mode_intelligent')}</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm">{t('traffic_preset')}:</span>
                        <select value={preset} onChange={(e) => setPreset(e.target.value)} className="px-2 py-1 text-sm bg-secondary/60 text-white rounded-md border border-white/20">
                            <option value="valley">{t('traffic_preset_valley')}</option>
                            <option value="normal">{t('traffic_preset_normal')}</option>
                            <option value="rush">{t('traffic_preset_rush')}</option>
                        </select>
                    </div>
                </div>

                {/* Control row 2: Vehicle composition & controls */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 text-xs text-white/70">
                        <span className="font-semibold">{t('traffic_vehicle_type')}:</span>
                        <label className="flex items-center gap-1">
                            {t('traffic_car')}: <input type="range" min={0} max={1} step={0.05} value={vehicleTypes.car} onChange={(e) => {
                                const c = parseFloat(e.target.value);
                                const m = vehicleTypes.motorcycle;
                                const b = 1 - c - m;
                                if (b >= 0) setVehicleTypes({ car: c, motorcycle: m, bus: b });
                            }} className="w-16" />
                        </label>
                        <label className="flex items-center gap-1">
                            {t('traffic_motorcycle')}: <input type="range" min={0} max={1} step={0.05} value={vehicleTypes.motorcycle} onChange={(e) => {
                                const m = parseFloat(e.target.value);
                                const c = vehicleTypes.car;
                                const b = 1 - c - m;
                                if (b >= 0) setVehicleTypes({ car: c, motorcycle: m, bus: b });
                            }} className="w-16" />
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-primary text-black rounded-md text-sm" onClick={() => setRunning(v => !v)}>
                            {running ? t('traffic_pause') : t('traffic_start')}
                        </button>
                        <button className="px-3 py-1 bg-white/10 text-white rounded-md text-sm" onClick={reset}>{t('traffic_reset')}</button>
                        <label className="text-white/70 text-sm ml-2">{t('traffic_speed')}
                            <input type="range" min={0.5} max={2} step={0.1} value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="ml-2 align-middle" />
                        </label>
                    </div>
                </div>

                <div className="relative bg-[#0b0b0c] border border-white/10 rounded-lg overflow-hidden shadow-inner w-full h-[32rem]">
                    {/* Roads */}
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-full bg-[#1b1c1f]" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-full bg-[#1b1c1f]" />
                    {/* Center box */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#222326] border border-white/10 rounded-md" />

                    {/* Traffic lights */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-2 w-3 h-3 rounded-full ${lightClass(lights.N)} shadow-[0_0_8px_rgba(0,0,0,0.6)]`} />
                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-2 w-3 h-3 rounded-full ${lightClass(lights.S)} shadow-[0_0_8px_rgba(0,0,0,0.6)]`} />
                    <div className={`absolute top-1/2 -translate-y-1/2 left-2 w-3 h-3 rounded-full ${lightClass(lights.W)} shadow-[0_0_8px_rgba(0,0,0,0.6)]`} />
                    <div className={`absolute top-1/2 -translate-y-1/2 right-2 w-3 h-3 rounded-full ${lightClass(lights.E)} shadow-[0_0_8px_rgba(0,0,0,0.6)]`} />

                    {/* Waiting stacks */}
                    <WaitingStack count={waiting.N} dir="N" />
                    <WaitingStack count={waiting.S} dir="S" />
                    <WaitingStack count={waiting.E} dir="E" />
                    <WaitingStack count={waiting.W} dir="W" />

                    {/* Active vehicles */}
                    {active.map(v => (
                        <VehicleDot key={v.id} dir={v.dir} progress={v.progress} type={v.type} />
                    ))}

                    {/* Phase label */}
                    <div className="absolute left-2 top-2 text-xs text-white/60 bg-black/30 px-2 py-1 rounded">
                        {isNS ? t('traffic_phase_ns') : t('traffic_phase_ew')}
                    </div>
                </div>
            </div>

            {/* Side panel */}
            <div className="bg-[#111215] border border-white/10 rounded-lg p-4 flex flex-col gap-4">
                {/* Xlerion Way Branding */}
                <div className="pb-3 border-b border-white/10">
                    <div className="text-primary font-bold text-xs tracking-wide">✦ XLERION WAY</div>
                    <div className="text-white/60 text-xs">Agente de Tránsito Digital</div>
                </div>

                {/* Efficiency Indicator */}
                {mode === 'intelligent' && cycleStats.intelligent > 0 && (
                    <div className="bg-primary/10 border border-primary/30 rounded p-3">
                        <div className="text-white/80 text-xs mb-2">Eficiencia vs. Tradicional</div>
                        <div className="text-primary font-bold text-lg">
                            +{Math.round(((cycleStats.intelligentTotal - cycleStats.traditionalTotal) / Math.max(1, cycleStats.traditionalTotal)) * 100)}%
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                            Inteligente: {cycleStats.intelligentTotal} | Tradicional: {cycleStats.traditionalTotal}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-white font-semibold text-sm mb-2">{t('traffic_waiting_header')}</h3>
                    <div className="grid grid-cols-2 gap-2 text-white/80 text-sm">
                        <div>🧭 {t('north')}: <span className="font-mono">{waiting.N}</span></div>
                        <div>🧭 {t('south')}: <span className="font-mono">{waiting.S}</span></div>
                        <div>🧭 {t('east')}: <span className="font-mono">{waiting.E}</span></div>
                        <div>🧭 {t('west')}: <span className="font-mono">{waiting.W}</span></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-semibold text-sm mb-2">{t('traffic_released_header')}</h3>
                    <div className="text-white/80 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div>{t('north')}: <span className="font-mono">{lastReleased.N}</span></div>
                            <div>{t('south')}: <span className="font-mono">{lastReleased.S}</span></div>
                            <div>{t('east')}: <span className="font-mono">{lastReleased.E}</span></div>
                            <div>{t('west')}: <span className="font-mono">{lastReleased.W}</span></div>
                        </div>
                        <div className="mt-2">{t('traffic_released_total')}: <span className="font-mono">{lastReleased.total}</span></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-semibold text-sm mb-2">{t('traffic_cumulative_header')}</h3>
                    <div className="text-white/80 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div>{t('north')}: <span className="font-mono">{totals.N}</span></div>
                            <div>{t('south')}: <span className="font-mono">{totals.S}</span></div>
                            <div>{t('east')}: <span className="font-mono">{totals.E}</span></div>
                            <div>{t('west')}: <span className="font-mono">{totals.W}</span></div>
                        </div>
                        <div className="mt-2">{t('traffic_cumulative_total')}: <span className="font-mono">{totals.total}</span></div>
                    </div>
                </div>
                <div className="text-white/60 text-xs leading-snug">
                    <div>• {t('traffic_rule_cap')}</div>
                    <div>• {t('traffic_rule_adapt')}</div>
                    <div>• {t('traffic_rule_sync')}</div>
                </div>
            </div>
        </div>
    );
}
