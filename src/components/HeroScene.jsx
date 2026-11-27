import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const PALETTE = ['#00e9fa', '#ffffff', '#0a0a0a', '#00e9fa', '#1a3a3d', '#00b8c9'];
const KINDS = ['sphere', 'torus', 'capsule', 'sphere', 'box', 'knot', 'sphere', 'capsule'];

function seeded(i) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function makeGeometry(kind) {
  switch (kind) {
    case 'sphere': return new THREE.SphereGeometry(1, 48, 48);
    case 'torus': return new THREE.TorusGeometry(0.8, 0.32, 32, 64);
    case 'capsule': return new THREE.CapsuleGeometry(0.5, 1, 16, 32);
    case 'box': return new THREE.BoxGeometry(1.3, 1.3, 1.3);
    case 'knot': return new THREE.TorusKnotGeometry(0.6, 0.22, 128, 24);
    default: return new THREE.SphereGeometry(1, 32, 32);
  }
}

export default function HeroScene({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir1 = new THREE.DirectionalLight(0xffffff, 2.1);
    dir1.position.set(5, 6, 5);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0x7fdfff, 0.8);
    dir2.position.set(-6, -2, 3);
    scene.add(dir2);

    const group = new THREE.Group();
    scene.add(group);

    const count = 22;
    const items = Array.from({ length: count }, (_, i) => {
      const r1 = seeded(i + 1);
      const r2 = seeded(i + 31);
      const r3 = seeded(i + 77);
      const angle = r1 * Math.PI * 2;
      const radius = 0.6 + r2 * 2.6;
      const kind = KINDS[i % KINDS.length];
      const color = PALETTE[i % PALETTE.length];
      const metal = i % 3 === 0;
      const geo = makeGeometry(kind);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: metal ? 0.15 : 0.25,
        metalness: metal ? 0.9 : 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const scale = 0.28 + r3 * 0.42;
      mesh.scale.setScalar(scale);
      const home = new THREE.Vector3(Math.cos(angle) * radius * 1.4, Math.sin(angle) * radius * 0.8, (r3 - 0.5) * 3);
      mesh.position.set(home.x * 3, home.y * 3, home.z - 6);
      group.add(mesh);
      return {
        mesh, geo, mat, home,
        rotSpeed: new THREE.Vector3(r1 - 0.5, r2 - 0.5, r3 - 0.5).multiplyScalar(1.2),
        phase: r1 * 10,
        vel: new THREE.Vector3(),
      };
    });

    const pointer = { x: 0, y: 0 };
    const mouse3 = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    const viewport = { width: 0, height: 0 };
    const updateViewport = () => {
      const vFov = (camera.fov * Math.PI) / 180;
      viewport.height = 2 * Math.tan(vFov / 2) * camera.position.z;
      viewport.width = viewport.height * camera.aspect;
    };
    updateViewport();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      mouse3.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);

      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.25, 0.05);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.15, 0.05);

      if (!reduceMotion) {
        for (const it of items) {
          const m = it.mesh;
          tmp.copy(it.home);
          tmp.y += Math.sin(t * 0.8 + it.phase) * 0.25;
          tmp.x += Math.cos(t * 0.5 + it.phase) * 0.15;
          tmp.sub(m.position).multiplyScalar(2.2);
          it.vel.add(tmp.multiplyScalar(dt));
          tmp.copy(m.position).sub(mouse3);
          tmp.z = 0;
          const d = tmp.length();
          if (d < 1.8) {
            tmp.normalize().multiplyScalar((1.8 - d) * 14 * dt);
            it.vel.add(tmp);
          }
          it.vel.multiplyScalar(0.92);
          m.position.addScaledVector(it.vel, dt * 6);
          m.rotation.x += it.rotSpeed.x * dt;
          m.rotation.y += it.rotSpeed.y * dt;
          m.rotation.z += it.rotSpeed.z * dt;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateViewport();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      for (const it of items) { it.geo.dispose(); it.mat.dispose(); }
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
}
