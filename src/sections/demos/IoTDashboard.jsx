import React, { useEffect, useRef, useState } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity, Database, Radio } from 'lucide-react';
import DemoShell from './DemoShell';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

/**
 * IoTDashboard — telemetría simulada con evento de pérdida de conectividad:
 * la serie "sincronizada" se aplana, la de "buffer local" crece y, al volver
 * la conexión, se reconcilia (pico de sincronización y buffer a cero).
 * Las actualizaciones se detienen cuando `active` es false.
 */

const POINTS = 36;
const OFFLINE_EVERY_MS = 9000;
const TICK_MS = 900;

function seed() {
  return Array.from({ length: POINTS }, (_, i) => ({
    label: `${String(i).padStart(2, '0')}s`,
    synced: 38 + Math.random() * 6,
    buffered: 0,
  }));
}

export default function IoTDashboard({ active, lang }) {
  const [data, setData] = useState(seed);
  const [offline, setOffline] = useState(false);
  const offlineRef = useRef(false);
  offlineRef.current = offline;

  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setOffline((prev) => !prev), OFFLINE_EVERY_MS);
    return () => clearInterval(timer);
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;

    const timer = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        const wasOffline = offlineRef.current;

        const jitter = 38 + Math.random() * 6;
        const synced = wasOffline ? last.synced : jitter;
        const buffered = wasOffline
          ? Math.min(60, last.buffered + 4 + Math.random() * 4)
          : Math.max(0, last.buffered - 30);

        const stamp = (parseInt(last.label, 10) + 1) % 60;
        next.push({
          label: `${String(stamp).padStart(2, '0')}s`,
          synced,
          buffered,
        });
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [active]);

  const syncedTotal = data[data.length - 1].synced.toFixed(1);
  const bufferedTotal = data[data.length - 1].buffered.toFixed(1);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: lang === 'es' ? 'Sincronizado' : 'Synced',
        data: data.map((d) => d.synced),
        borderColor: '#00e9fa',
        backgroundColor: 'rgba(0, 233, 250, 0.08)',
        fill: true,
        pointRadius: 0,
        borderWidth: 1.5,
        tension: 0.4,
      },
      {
        label: lang === 'es' ? 'Buffer local' : 'Local buffer',
        data: data.map((d) => d.buffered),
        borderColor: '#8a2be2',
        backgroundColor: 'rgba(138, 43, 226, 0.10)',
        fill: true,
        pointRadius: 0,
        borderWidth: 1.5,
        borderDash: [4, 3],
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#9ca3af',
          boxWidth: 10,
          boxHeight: 2,
          font: { family: 'JetBrains Mono, monospace', size: 9 },
        },
      },
      tooltip: {
        backgroundColor: '#0a0a12',
        borderColor: 'rgba(0, 233, 250, 0.2)',
        borderWidth: 1,
        titleFont: { family: 'JetBrains Mono, monospace', size: 10 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 10 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#4b5563', font: { family: 'JetBrains Mono, monospace', size: 9 }, maxTicksLimit: 9 },
      },
      y: {
        min: 0,
        max: 70,
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#4b5563', font: { family: 'JetBrains Mono, monospace', size: 9 } },
      },
    },
  };

  return (
    <DemoShell
      title={lang === 'es' ? 'TELEMETRÍA_EDGE // ZONA_REMOTA' : 'EDGE_TELEMETRY // REMOTE_ZONE'}
      right={
        <span
          className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 border uppercase tracking-[0.15em] ${
            offline
              ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
              : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
          }`}
        >
          <Radio size={10} />
          {offline
            ? lang === 'es'
              ? 'OFFLINE · BUFFERING'
              : 'OFFLINE · BUFFERING'
            : lang === 'es'
              ? 'EN LÍNEA'
              : 'ONLINE'}
        </span>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Activity size={12} className="text-[#00e9fa]" />
              {lang === 'es' ? 'Sincronizado' : 'Synced'}: <span className="text-white">{syncedTotal}k</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Database size={12} className="text-purple-400" />
              {lang === 'es' ? 'Buffer' : 'Buffer'}: <span className="text-white">{bufferedTotal}</span>
            </span>
          </div>
          <span>{lang === 'es' ? 'Reconciliación atómica al reconectar' : 'Atomic reconciliation on reconnect'}</span>
        </div>
      }
    >
      <div className="absolute inset-0 p-3 sm:p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </DemoShell>
  );
}
