import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Cpu, Flame, Gauge, Layers, Radio, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/* ============================================================
   COPY bilingüe
   ============================================================ */
const COPY = {
  es: {
    hud: {
      live: 'TWIN_LIVE: TURBINA_GAS_U04',
      ws: 'WS://SYNC_24MS',
      hint: 'Arrastrar para orbitar 360° · WebGL 60 FPS',
    },
    modes: { solid: 'Sólido', mesh: 'Malla 3D', thermal: 'Térmico' },
    alarm: { off: 'Simular Alarma', on: 'Anomalía Activa', banner: 'TÉRMICA > 84.6°C' },
    inspector: {
      title: 'TELEMETRÍA EN VIVO',
      frequency: 'Frec. 50Hz',
      latency: 'Latencia',
    },
    status: { ok: 'ÓPTIMO', normal: 'NORMAL', alert: 'ALERTA' },
    footer: { events: 'Eventos', latency: 'Latencia' },
    sensors: {
      'VIB-09': { name: 'Vibración Radial', metric: 'Vibración' },
      'TMP-44': { name: 'Núcleo Térmico', metric: 'Temperatura' },
      'RPM-01': { name: 'Tacómetro Inductivo', metric: 'Velocidad' },
      'FLW-12': { name: 'Caudal Hidráulico', metric: 'Caudal' },
    },
  },
  en: {
    hud: {
      live: 'TWIN_LIVE: GAS_TURBINE_U04',
      ws: 'WS://SYNC_24MS',
      hint: 'Drag to orbit 360° · WebGL 60 FPS',
    },
    modes: { solid: 'Solid', mesh: '3D Mesh', thermal: 'Thermal' },
    alarm: { off: 'Simulate Alarm', on: 'Anomaly Active', banner: 'THERMAL > 84.6°C' },
    inspector: {
      title: 'LIVE TELEMETRY',
      frequency: 'Freq. 50Hz',
      latency: 'Latency',
    },
    status: { ok: 'OPTIMAL', normal: 'NORMAL', alert: 'ALERT' },
    footer: { events: 'Events', latency: 'Latency' },
    sensors: {
      'VIB-09': { name: 'Radial Vibration', metric: 'Vibration' },
      'TMP-44': { name: 'Thermal Core', metric: 'Temperature' },
      'RPM-01': { name: 'Inductive Tachometer', metric: 'Speed' },
      'FLW-12': { name: 'Hydraulic Flow', metric: 'Flow' },
    },
  },
};

/* Sensores: id, clave de telemetría, unidad y posición en la escena 3D */
const SENSORS = [
  { id: 'VIB-09', key: 'vibration', unit: 'mm/s', position: [0, 1.4, 0] },
  { id: 'TMP-44', key: 'temp', unit: '°C', position: [1.2, 0.2, 0.8] },
  { id: 'RPM-01', key: 'rpm', unit: 'RPM', position: [-1.2, -0.4, -0.6] },
  { id: 'FLW-12', key: 'flow', unit: 'L/min', position: [0.8, -1.2, -0.8] },
];

const DEFAULT_MODE = 'solid';
const DEFAULT_ALARM = false;
const DEFAULT_SENSOR = 'TMP-44';

const STATUS_STYLES = {
  ok: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  normal: 'text-[#00e9fa] border-[#00e9fa]/30 bg-[#00e9fa]/10',
  alert: 'text-red-400 border-red-500/40 bg-red-500/10',
};

const DOT_STYLES = {
  ok: 'bg-emerald-400',
  normal: 'bg-[#00e9fa]',
  alert: 'bg-red-400',
};

/* Aplica el estado de vista (sólido / malla / térmico / alarma) a los materiales */
function applyViewState(materials, mode, alarmActive) {
  const { rotor, core, blade, shroud, flange } = materials;

  if (alarmActive) {
    rotor.wireframe = false;
    rotor.color.setHex(0xff2b2b);
    rotor.emissive.setHex(0x5a0000);
    rotor.emissiveIntensity = 0.8;
    blade.color.setHex(0xff4d1a);
    blade.emissive.setHex(0x7a1800);
    blade.emissiveIntensity = 0.7;
    shroud.color.setHex(0xff9900);
    shroud.opacity = 0.65;
    flange.color.setHex(0xff2b2b);
    core.color.setHex(0xff5533);
    return;
  }

  blade.emissive.setHex(0x000000);
  blade.emissiveIntensity = 0;

  if (mode === 'mesh') {
    rotor.wireframe = true;
    rotor.color.setHex(0x00e9fa);
    rotor.emissive.setHex(0x003b4d);
    rotor.emissiveIntensity = 0.6;
    shroud.color.setHex(0x00e9fa);
    shroud.opacity = 0.85;
    blade.color.setHex(0x00e9fa);
    flange.color.setHex(0x00e9fa);
    core.color.setHex(0x00e9fa);
    return;
  }

  if (mode === 'thermal') {
    rotor.wireframe = false;
    rotor.color.setHex(0xcc2a00);
    rotor.emissive.setHex(0x7a1500);
    rotor.emissiveIntensity = 0.8;
    shroud.color.setHex(0xff8800);
    shroud.opacity = 0.55;
    blade.color.setHex(0xff5500);
    flange.color.setHex(0xff3300);
    core.color.setHex(0xffcc00);
    return;
  }

  rotor.wireframe = false;
  rotor.color.setHex(0x111928);
  rotor.emissive.setHex(0x000000);
  rotor.emissiveIntensity = 0;
  shroud.color.setHex(0x00e9fa);
  shroud.opacity = 0.4;
  blade.color.setHex(0x1f2937);
  flange.color.setHex(0x0055ff);
  core.color.setHex(0x00e9fa);
}

/* Resalta el baliza del sensor seleccionado y cambia a rojo en alarma */
function applyBeaconState(beacons, selectedId, alarmActive) {
  beacons.forEach((beacon) => {
    const selected = beacon.id === selectedId;
    const color = alarmActive ? 0xff3344 : selected ? 0xffffff : 0x00e9fa;

    beacon.material.color.setHex(color);
    beacon.ringMaterial.color.setHex(color);
    beacon.ringMaterial.opacity = selected ? 0.9 : 0.45;

    const scale = selected ? 1.7 : 1;
    beacon.mesh.scale.set(scale, scale, scale);
  });
}

/**
 * DigitalTwinViewer3D
 * Visor WebGL (three) de una turbina/reactor industrial procedural, con HUD SCADA,
 * modos de vista, telemetría simulada y sensores seleccionables. Sin props.
 */
export function DigitalTwinViewer3D() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  const mountRef = useRef(null);
  const apiRef = useRef(null);

  const [viewMode, setViewMode] = useState(DEFAULT_MODE);
  const [alarm, setAlarm] = useState(DEFAULT_ALARM);
  const [selectedSensor, setSelectedSensor] = useState(DEFAULT_SENSOR);
  const [telemetry, setTelemetry] = useState({
    rpm: 3418,
    temp: 68.4,
    vibration: 1.84,
    flow: 412.5,
    latency: 12,
    events: 14280,
  });

  /* ---------- Telemetría simulada (~1.2s) ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        rpm: Math.floor(3400 + Math.random() * 40),
        temp: Number((68.0 + Math.random() * 1.4).toFixed(1)),
        vibration: Number((1.8 + Math.random() * 0.1).toFixed(2)),
        flow: Number((410 + Math.random() * 6).toFixed(1)),
        latency: Math.floor(11 + Math.random() * 5),
        events: prev.events + Math.floor(12 + Math.random() * 20),
      }));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  /* ---------- Escena WebGL (se construye una sola vez) ---------- */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.6, 3.1, 5.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    /* Iluminación */
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.4);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00e9fa, 4, 16);
    cyanPointLight.position.set(3, 4, 3);
    scene.add(cyanPointLight);

    const directionalLight = new THREE.DirectionalLight(0x0055ff, 2.2);
    directionalLight.position.set(-4, -2, -3);
    scene.add(directionalLight);

    /* Materiales (referenciados para cambiar de modo) */
    const materials = {
      rotor: new THREE.MeshStandardMaterial({ color: 0x111928, metalness: 0.85, roughness: 0.25 }),
      core: new THREE.MeshBasicMaterial({ color: 0x00e9fa, wireframe: true, transparent: true, opacity: 0.35 }),
      blade: new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9, roughness: 0.3 }),
      shroud: new THREE.MeshStandardMaterial({ color: 0x00e9fa, wireframe: true, transparent: true, opacity: 0.4 }),
      flange: new THREE.MeshStandardMaterial({ color: 0x0055ff, metalness: 0.7, roughness: 0.4 }),
    };

    const geometries = [];

    /* Rotor cilíndrico central */
    const rotorGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3.6, 32);
    geometries.push(rotorGeometry);
    const rotor = new THREE.Mesh(rotorGeometry, materials.rotor);
    rotor.rotation.z = Math.PI / 2;
    root.add(rotor);

    /* Núcleo wireframe interior */
    const coreGeometry = new THREE.CylinderGeometry(0.42, 0.42, 3.85, 24);
    geometries.push(coreGeometry);
    const core = new THREE.Mesh(coreGeometry, materials.core);
    core.rotation.z = Math.PI / 2;
    root.add(core);

    /* Anillos de álabes giratorios */
    const bladeGroup = new THREE.Group();
    root.add(bladeGroup);

    const bladeGeometry = new THREE.BoxGeometry(0.06, 0.62, 0.22);
    geometries.push(bladeGeometry);
    const BLADE_COUNT = 16;
    for (let i = 0; i < BLADE_COUNT; i++) {
      const angle = (i / BLADE_COUNT) * Math.PI * 2;
      [-0.8, 0.8].forEach((offsetX) => {
        const blade = new THREE.Mesh(bladeGeometry, materials.blade);
        blade.position.set(offsetX, Math.cos(angle) * 1.1, Math.sin(angle) * 1.1);
        blade.rotation.x = angle + 0.3;
        bladeGroup.add(blade);
      });
    }

    /* Shroud / carcasa wireframe */
    const shroudGeometry = new THREE.CylinderGeometry(1.6, 1.6, 3.2, 28, 6, true);
    geometries.push(shroudGeometry);
    const shroud = new THREE.Mesh(shroudGeometry, materials.shroud);
    shroud.rotation.z = Math.PI / 2;
    root.add(shroud);

    /* Bridas tipo toro */
    const flangeGeometry = new THREE.TorusGeometry(1.65, 0.05, 16, 48);
    geometries.push(flangeGeometry);
    [-1.6, 1.6].forEach((offsetX) => {
      const flange = new THREE.Mesh(flangeGeometry, materials.flange);
      flange.position.x = offsetX;
      flange.rotation.y = Math.PI / 2;
      root.add(flange);
    });

    /* GridHelper de suelo */
    const grid = new THREE.GridHelper(8, 16, 0x00e9fa, 0x142035);
    grid.position.y = -2;
    scene.add(grid);

    /* Balizas de sensores */
    const beaconGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    geometries.push(beaconGeometry);
    const ringGeometry = new THREE.RingGeometry(0.12, 0.16, 24);
    geometries.push(ringGeometry);

    const beacons = SENSORS.map(({ id, position }) => {
      const material = new THREE.MeshBasicMaterial({ color: 0x00e9fa });
      const mesh = new THREE.Mesh(beaconGeometry, material);
      mesh.position.set(position[0], position[1], position[2]);

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00e9fa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      mesh.add(ring);

      root.add(mesh);
      return { id, mesh, ring, material, ringMaterial };
    });

    /* Estado inicial coherente con el primer render */
    applyViewState(materials, DEFAULT_MODE, DEFAULT_ALARM);
    applyBeaconState(beacons, DEFAULT_SENSOR, DEFAULT_ALARM);

    apiRef.current = { materials, beacons };

    /* ---------- Interacción: orbitar arrastrando (ratón + táctil) ---------- */
    const dom = renderer.domElement;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handlePointerDown = (event) => {
      isDragging = true;
      prevX = event.clientX;
      prevY = event.clientY;
      dom.style.cursor = 'grabbing';
    };

    const handlePointerMove = (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - prevX;
      const deltaY = event.clientY - prevY;

      root.rotation.y += deltaX * 0.007;
      root.rotation.x = Math.max(-0.9, Math.min(0.9, root.rotation.x + deltaY * 0.007));

      prevX = event.clientX;
      prevY = event.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      dom.style.cursor = 'grab';
    };

    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    /* ---------- Redimensionado ---------- */
    const handleResize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (!nextWidth || !nextHeight) return;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };
    window.addEventListener('resize', handleResize);

    /* ---------- Bucle de animación ---------- */
    const clock = new THREE.Clock();
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotación suave cuando no se arrastra
      if (!isDragging) {
        root.rotation.y += 0.0035;
      }

      // Giro interno de los álabes
      bladeGroup.rotation.x += 0.04;

      // Pulso de los anillos de sensores
      beacons.forEach((beacon, index) => {
        const pulse = 1 + Math.sin(elapsed * 4 + index) * 0.25;
        beacon.ring.scale.set(pulse, pulse, pulse);
      });

      renderer.render(scene, camera);
    };

    animate();

    /* ---------- Limpieza ---------- */
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      geometries.forEach((geometry) => geometry.dispose());
      Object.values(materials).forEach((material) => material.dispose());
      beacons.forEach((beacon) => {
        beacon.material.dispose();
        beacon.ringMaterial.dispose();
      });
      grid.geometry.dispose();
      grid.material.dispose();

      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      apiRef.current = null;
    };
  }, []);

  /* ---------- Cambio de modo de vista / alarma ---------- */
  useEffect(() => {
    if (!apiRef.current) return;
    applyViewState(apiRef.current.materials, viewMode, alarm);
  }, [viewMode, alarm]);

  /* ---------- Selección de sensor ---------- */
  useEffect(() => {
    if (!apiRef.current) return;
    applyBeaconState(apiRef.current.beacons, selectedSensor, alarm);
  }, [selectedSensor, alarm]);

  /* ---------- Derivados de telemetría ---------- */
  const liveTemp = alarm ? Number((84.6 + (telemetry.temp - 68)).toFixed(1)) : telemetry.temp;

  const getSensorValue = (key) => {
    switch (key) {
      case 'temp':
        return liveTemp.toFixed(1);
      case 'rpm':
        return String(telemetry.rpm);
      case 'vibration':
        return telemetry.vibration.toFixed(2);
      case 'flow':
        return telemetry.flow.toFixed(1);
      default:
        return '—';
    }
  };

  const getSensorStatus = (key) => {
    if (alarm) return 'alert';
    return key === 'temp' ? 'normal' : 'ok';
  };

  const activeSensor = SENSORS.find((sensor) => sensor.id === selectedSensor) || SENSORS[0];
  const activeCopy = c.sensors[activeSensor.id] || { name: activeSensor.id, metric: '' };
  const activeStatus = getSensorStatus(activeSensor.key);

  const modes = [
    { id: 'solid', label: c.modes.solid, Icon: Cpu },
    { id: 'mesh', label: c.modes.mesh, Icon: Layers },
    { id: 'thermal', label: c.modes.thermal, Icon: Flame },
  ];

  return (
    <div className="relative bg-[#050508] border border-[#00e9fa]/20 rounded-lg overflow-hidden">
      {/* HUD superior tipo consola */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-white/[0.08] bg-black/50 font-mono text-[10px] sm:text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping ${
                alarm ? 'bg-red-400' : 'bg-[#00e9fa]'
              }`}
            />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${alarm ? 'bg-red-500' : 'bg-[#00e9fa]'}`} />
          </span>
          <span className="text-white uppercase tracking-[0.15em] truncate">{c.hud.live}</span>
          <span className="hidden sm:inline-block text-[#00e9fa]/70 border border-[#00e9fa]/20 rounded px-1.5 py-0.5 bg-[#00e9fa]/5">
            {c.hud.ws}
          </span>
        </div>

        {/* Tabs de modo de vista */}
        <div className="flex items-center gap-0.5 rounded bg-white/[0.03] border border-white/[0.08] p-0.5">
          {modes.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewMode(id)}
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded uppercase tracking-[0.15em] transition-colors ${
                viewMode === id && !alarm
                  ? 'bg-[#00e9fa]/15 text-[#00e9fa] border border-[#00e9fa]/40'
                  : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Viewport 3D responsivo */}
      <div className="relative h-[360px] sm:h-[440px] lg:h-[520px] w-full cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" style={{ touchAction: 'none' }} />

        {/* Pista de interacción */}
        <div className="pointer-events-none absolute top-3 left-3 px-2 py-1 rounded border border-white/[0.08] bg-black/40 text-[10px] font-mono text-gray-500">
          {c.hud.hint}
        </div>

        {/* Alerta tipo SCADA */}
        {alarm && (
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded border border-red-500/50 bg-red-950/70 text-[10px] sm:text-[11px] font-mono text-red-300 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>SCADA · {c.alarm.banner}</span>
          </div>
        )}

        {/* Tarjeta inspectora del sensor activo */}
        <div className="pointer-events-none absolute top-3 right-3 w-[180px] sm:w-[200px] rounded border border-[#00e9fa]/20 bg-[#0a0a12]/80 backdrop-blur-sm p-3 font-mono">
          <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.2em] text-[#00e9fa]/80">
            <span className="flex items-center gap-1 truncate">
              <Gauge className="w-3 h-3" />
              {c.inspector.title}
            </span>
            <span className={`px-1 py-0.5 rounded border shrink-0 ${STATUS_STYLES[activeStatus]}`}>
              {c.status[activeStatus]}
            </span>
          </div>

          <div className="mt-2 text-[11px] text-white truncate">{activeCopy.name}</div>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">{getSensorValue(activeSensor.key)}</span>
            <span className="text-[10px] text-[#00e9fa]">{activeSensor.unit}</span>
          </div>

          <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[9px] text-gray-500">
            <span>{activeSensor.id}</span>
            <span className="text-[#00e9fa]">
              {c.inspector.latency} {telemetry.latency}ms
            </span>
          </div>
        </div>

        {/* Chips de sensores */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {SENSORS.map((sensor) => {
            const status = getSensorStatus(sensor.key);
            const selected = sensor.id === selectedSensor;

            return (
              <button
                key={sensor.id}
                type="button"
                onClick={() => setSelectedSensor(sensor.id)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono transition-all ${
                  selected
                    ? 'bg-[#00e9fa]/20 border-[#00e9fa]/60 text-white shadow-[0_0_12px_rgba(0,233,250,0.25)]'
                    : 'bg-black/60 border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00e9fa]/30'
                }`}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} />
                {sensor.id}: {getSensorValue(sensor.key)} {sensor.unit}
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra inferior: alarma + ticker de telemetría */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-4 py-2.5 border-t border-white/[0.08] bg-black/50 font-mono text-[10px]">
        <button
          type="button"
          onClick={() => setAlarm((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border uppercase tracking-[0.15em] transition-colors ${
            alarm
              ? 'bg-red-600 text-white border-red-400'
              : 'bg-white/[0.02] text-gray-300 border-white/[0.08] hover:border-red-500/50 hover:text-red-300'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          {alarm ? c.alarm.on : c.alarm.off}
        </button>

        <div className="flex items-center gap-3 text-gray-500">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#00e9fa]" />
            {c.footer.events}: <span className="text-[#00e9fa]">{telemetry.events.toLocaleString()}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#00e9fa]" />
            {c.footer.latency}: <span className="text-white">{telemetry.latency}ms</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default DigitalTwinViewer3D;
