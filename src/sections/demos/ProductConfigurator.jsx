import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Check } from 'lucide-react';
import DemoShell from './DemoShell';

/**
 * ProductConfigurator — visor 3D ligero estilo e-commerce: un producto
 * (envase industrial estilizado) que rota solo, se orbita con arrastre y
 * cambia de color en vivo con los swatches. El loop WebGL se detiene
 * cuando `active` es false.
 */

const COLORS = [
  { id: 'cyan', hex: 0x00e9fa, label: '#00E9FA' },
  { id: 'violet', hex: 0x8a2be2, label: '#8A2BE2' },
  { id: 'ember', hex: 0xff4d1a, label: '#FF4D1A' },
  { id: 'white', hex: 0xe5e7eb, label: '#E5E7EB' },
  { id: 'blue', hex: 0x0055ff, label: '#0055FF' },
];

export default function ProductConfigurator({ active, lang }) {
  const mountRef = useRef(null);
  const loopRef = useRef(null);
  const materialRef = useRef(null);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.4, 2.4, 4.4);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x334155, 3.2));

    const keyLight = new THREE.PointLight(0x00e9fa, 8, 24);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 3, 20);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0055ff, 2.4);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    /* Producto: envase industrial estilizado (cuerpo + cuello + tapa + anillo) */
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: COLORS[0].hex,
      metalness: 0.55,
      roughness: 0.3,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x111928, metalness: 0.85, roughness: 0.25 });
    const accentMaterial = new THREE.MeshBasicMaterial({ color: 0x00e9fa, wireframe: true, transparent: true, opacity: 0.25 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 2.0, 40), bodyMaterial);
    root.add(body);

    const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.85, 0.45, 40), bodyMaterial);
    shoulder.position.y = 1.2;
    root.add(shoulder);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.5, 32), darkMaterial);
    neck.position.y = 1.6;
    root.add(neck);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.42, 32), darkMaterial);
    cap.position.y = 2.0;
    root.add(cap);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 12, 48), accentMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.55;
    root.add(ring);

    const grid = new THREE.GridHelper(8, 16, 0x00e9fa, 0x142035);
    grid.position.y = -1.6;
    scene.add(grid);

    materialRef.current = bodyMaterial;

    /* Interacción: orbitar con arrastre */
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
      root.rotation.y += (event.clientX - prevX) * 0.007;
      root.rotation.x = Math.max(-0.5, Math.min(0.5, root.rotation.x + (event.clientY - prevY) * 0.007));
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

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    /* Loop con control start/stop para pausar cuando la demo no es activa */
    let animationId = 0;
    let running = false;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isDragging) root.rotation.y += 0.004;
      renderer.render(scene, camera);
    };

    loopRef.current = {
      start() {
        if (running) return;
        running = true;
        animationId = requestAnimationFrame(animate);
      },
      stop() {
        running = false;
        cancelAnimationFrame(animationId);
      },
    };
    loopRef.current.start();

    return () => {
      loopRef.current = null;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      root.traverse((node) => {
        if (node.isMesh) {
          node.geometry.dispose();
        }
      });
      bodyMaterial.dispose();
      darkMaterial.dispose();
      accentMaterial.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
      materialRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!loopRef.current) return;
    if (active) loopRef.current.start();
    else loopRef.current.stop();
  }, [active]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.setHex(COLORS[colorIndex].hex);
    }
  }, [colorIndex]);

  const activeColor = COLORS[colorIndex];

  return (
    <DemoShell
      title={lang === 'es' ? 'CONFIGURADOR_3D // E-COMMERCE' : '3D_CONFIGURATOR // E-COMMERCE'}
      right={
        <span className="hidden sm:inline-block text-[#00e9fa]/70 border border-[#00e9fa]/20 rounded px-1.5 py-0.5 bg-[#00e9fa]/5">
          {lang === 'es' ? 'ARRASTRA PARA ORBITAR' : 'DRAG TO ORBIT'}
        </span>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2" role="group" aria-label={lang === 'es' ? 'Color del producto' : 'Product color'}>
            {COLORS.map((color, i) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setColorIndex(i)}
                aria-label={color.label}
                aria-pressed={i === colorIndex}
                className={`relative h-6 w-6 rounded-full border transition-all duration-300 ${
                  i === colorIndex
                    ? 'border-white scale-110 shadow-[0_0_12px_rgba(0,233,250,0.4)]'
                    : 'border-white/20 hover:scale-105'
                }`}
                style={{ backgroundColor: color.label }}
              >
                {i === colorIndex && (
                  <Check size={12} className="absolute inset-0 m-auto text-black" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <span className="text-gray-500">
            {lang === 'es' ? 'Acabado' : 'Finish'}: <span className="text-[#00e9fa]">{activeColor.label}</span>
          </span>
        </div>
      }
    >
      <div className="absolute inset-0">
        <div ref={mountRef} className="w-full h-full" style={{ touchAction: 'none' }} />
      </div>
    </DemoShell>
  );
}
