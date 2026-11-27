import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const CYAN = new THREE.Color('#00e9fa');
const WHITE = new THREE.Color('#ffffff');

function makeBuildingMaterial(accent = false) {
  return new THREE.MeshPhysicalMaterial({
    color: accent ? new THREE.Color('#0d2a30') : new THREE.Color('#0a1014'),
    emissive: accent ? CYAN : new THREE.Color('#001318'),
    emissiveIntensity: accent ? 0.35 : 0.08,
    metalness: 0.55,
    roughness: 0.28,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.96,
  });
}

export default function HeroScene({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    let w = mount.clientWidth || window.innerWidth;
    let h = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.018);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 120);
    camera.position.set(0, 7.5, 14);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(6, 10, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x7fdfff, 0.9);
    fill.position.set(-8, 4, -4);
    scene.add(fill);
    const rim = new THREE.PointLight(0x00e9fa, 18, 30, 2);
    rim.position.set(0, 4, 0);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    // Ground grid
    const grid = new THREE.GridHelper(26, 26, 0x00e9fa, 0x0a2a2f);
    grid.position.y = -2.2;
    if (grid.material) {
      grid.material.transparent = true;
      grid.material.opacity = 0.25;
    }
    root.add(grid);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2.21;
    root.add(plane);

    // City buildings
    const city = new THREE.Group();
    root.add(city);
    const buildings = [];
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00e9fa, transparent: true, opacity: 0.35 });

    const layout = [];
    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        const dist = Math.abs(x) + Math.abs(z);
        if (dist > 7) continue;
        if (Math.random() < 0.18 && dist > 1) continue;
        const hgt = dist < 2 ? 2.8 + Math.random() * 3.2 : 0.8 + Math.random() * (3.2 - dist * 0.25);
        layout.push({ x: x * 1.25, z: z * 1.25, h: Math.max(0.6, hgt), accent: Math.random() > 0.72 || dist < 2 });
      }
    }

    for (const b of layout) {
      const mat = makeBuildingMaterial(b.accent);
      const mesh = new THREE.Mesh(boxGeo, mat);
      const sx = 0.72 + Math.random() * 0.35;
      const sz = 0.72 + Math.random() * 0.35;
      mesh.scale.set(sx, b.h, sz);
      mesh.position.set(b.x, -2.2 + b.h / 2, b.z);
      city.add(mesh);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(sx, b.h, sz)), edgeMat.clone());
      edges.position.copy(mesh.position);
      edges.material.opacity = b.accent ? 0.55 : 0.18;
      city.add(edges);

      buildings.push({ mesh, edges, baseY: mesh.position.y, h: b.h, phase: Math.random() * Math.PI * 2, accent: b.accent });
    }

    // IoT/network nodes and connections
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00e9fa });
    const nodePositions = [];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const r = 2.2 + Math.random() * 4.2;
      const y = -0.5 + Math.random() * 4.8;
      const p = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
      const m = new THREE.Mesh(nodeGeo, nodeMat.clone());
      m.position.copy(p);
      root.add(m);
      nodes.push({ mesh: m, base: p.clone(), phase: Math.random() * Math.PI * 2 });
      nodePositions.push(p);
    }

    const linePts = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const d = nodePositions[i].distanceTo(nodePositions[j]);
        if (d < 2.8 && linePts.length < 220 * 2) {
          linePts.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z, nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    const linesMat = new THREE.LineBasicMaterial({ color: 0x00e9fa, transparent: true, opacity: 0.12 });
    const netLines = new THREE.LineSegments(linesGeo, linesMat);
    root.add(netLines);

    // Central digital twin core
    const core = new THREE.Group();
    core.position.y = 0.8;
    root.add(core);
    const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x06161a, emissive: 0x00e9fa, emissiveIntensity: 0.45, metalness: 0.8, roughness: 0.15, wireframe: false, transparent: true, opacity: 0.9 });
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), coreMat);
    core.add(coreMesh);
    const coreWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.08, 1), new THREE.MeshBasicMaterial({ color: 0x00e9fa, wireframe: true, transparent: true, opacity: 0.35 }));
    core.add(coreWire);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.015, 16, 120), new THREE.MeshBasicMaterial({ color: 0x00e9fa, transparent: true, opacity: 0.55 }));
    ring.rotation.x = Math.PI / 2;
    core.add(ring);
    const ring2 = ring.clone();
    ring2.rotation.y = Math.PI / 2;
    ring2.scale.setScalar(0.82);
    ring2.material = ring.material.clone();
    ring2.material.opacity = 0.3;
    core.add(ring2);

    // Scanner plane
    const scan = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 5.8, 80),
      new THREE.MeshBasicMaterial({ color: 0x00e9fa, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    );
    scan.rotation.x = -Math.PI / 2;
    scan.position.y = -1.2;
    root.add(scan);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.elapsedTime;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      const targetRY = pointer.x * 0.45;
      const targetRX = pointer.y * -0.18;
      root.rotation.y += (targetRY - root.rotation.y) * 0.04;
      root.rotation.x += (targetRX - root.rotation.x) * 0.04;

      core.rotation.y = t * 0.35;
      core.rotation.x = Math.sin(t * 0.4) * 0.12;
      coreWire.rotation.y = -t * 0.2;
      ring.rotation.z = t * 0.25;
      ring2.rotation.x = Math.PI / 2 + t * 0.18;

      scan.position.y = -2.1 + ((Math.sin(t * 0.7) + 1) / 2) * 5.2;
      scan.material.opacity = 0.03 + (Math.cos(t * 0.7) * 0.02 + 0.02);

      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        const pulse = b.accent ? 1 + Math.sin(t * 1.4 + b.phase) * 0.03 : 1;
        b.mesh.scale.y = b.h * pulse;
        b.mesh.position.y = -2.2 + (b.h * pulse) / 2;
        b.edges.scale.y = pulse;
        b.edges.position.y = b.mesh.position.y;
        if (b.mesh.material.emissiveIntensity !== undefined) {
          b.mesh.material.emissiveIntensity = b.accent ? 0.25 + (Math.sin(t * 1.6 + b.phase) + 1) * 0.18 : 0.06;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const bob = Math.sin(t * 0.9 + n.phase) * 0.08;
        n.mesh.position.y = n.base.y + bob;
        const s = 0.8 + (Math.sin(t * 2 + n.phase) + 1) * 0.35;
        n.mesh.scale.setScalar(s);
        n.mesh.material.opacity = 0.55 + (Math.sin(t * 1.8 + n.phase) + 1) * 0.2;
        n.mesh.material.transparent = true;
      }

      rim.intensity = 14 + Math.sin(t * 1.2) * 4;
      if (!reduceMotion) renderer.render(scene, camera);
      else if (t < 0.05) renderer.render(scene, camera);
    };
    animate();
    if (reduceMotion) renderer.render(scene, camera);

    const onResize = () => {
      w = mount.clientWidth || window.innerWidth;
      h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      boxGeo.dispose();
      edgeMat.dispose();
      nodeGeo.dispose();
      linesGeo.dispose(); linesMat.dispose();
      plane.geometry.dispose(); plane.material.dispose();
      grid.geometry.dispose();
      if (Array.isArray(grid.material)) grid.material.forEach(m=>m.dispose()); else grid.material.dispose();
      scan.geometry.dispose(); scan.material.dispose();
      coreMesh.geometry.dispose(); coreMat.dispose();
      coreWire.geometry.dispose(); coreWire.material.dispose();
      ring.geometry.dispose(); ring.material.dispose();
      ring2.geometry.dispose(); ring2.material.dispose();
      buildings.forEach(b => { b.mesh.material.dispose(); b.edges.geometry.dispose(); b.edges.material.dispose(); });
      nodes.forEach(n => n.mesh.material.dispose());
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
}
