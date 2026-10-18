import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MODULES = [
    { name: 'Validation', color: 0x00e9fa, icon: 'check' },
    { name: 'Logging', color: 0x00f9b8, icon: 'terminal' },
    { name: 'Diagnostics', color: 0x00d9c5, icon: 'activity' },
    { name: 'Performance', color: 0x00b89f, icon: 'zap' }
];

export default function ToolkitThreeScene() {
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 12;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00e9fa, 1.5);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const centralGeometry = new THREE.IcosahedronGeometry(1.5, 2);
        const centralMaterial = new THREE.MeshPhongMaterial({
            color: 0x0a0a12,
            emissive: 0x00e9fa,
            emissiveIntensity: 0.3,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const centralMesh = new THREE.Mesh(centralGeometry, centralMaterial);
        scene.add(centralMesh);

        const moduleMeshes = MODULES.map((mod, i) => {
            const angle = (i / MODULES.length) * Math.PI * 2;
            const radius = 4;

            const group = new THREE.Group();

            const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const cubeMaterial = new THREE.MeshPhongMaterial({
                color: mod.color,
                emissive: mod.color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            group.add(cube);

            const ringGeometry = new THREE.RingGeometry(1, 1.1, 32);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: mod.color,
                emissive: mod.color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            group.add(ring);

            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: mod.color,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);

            group.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );

            scene.add(group);

            return { group, cube, ring, line, angle, color: mod.color };
        });

        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const color = new THREE.Color(0x00e9fa);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const clock = new THREE.Clock();

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            centralMesh.rotation.x += 0.003;
            centralMesh.rotation.y += 0.005;

            centralMaterial.emissiveIntensity = 0.3 + Math.sin(elapsed * 2) * 0.1;

            moduleMeshes.forEach((mod, i) => {
                const newAngle = mod.angle + elapsed * 0.3;
                const radius = 4 + Math.sin(elapsed * 0.5 + i) * 0.5;

                mod.group.position.x = Math.cos(newAngle) * radius;
                mod.group.position.y = Math.sin(newAngle) * radius;
                mod.group.position.z = Math.sin(elapsed * 0.3 + i * 0.5) * 0.5;

                mod.cube.rotation.x += 0.01;
                mod.cube.rotation.y += 0.015;

                mod.ring.rotation.x = Math.PI / 2 + Math.sin(elapsed + i) * 0.2;
                mod.ring.rotation.z = elapsed * 0.5;

                const linePositions = mod.line.geometry.attributes.position.array;
                linePositions[0] = 0;
                linePositions[1] = 0;
                linePositions[2] = 0;
                linePositions[3] = mod.group.position.x;
                linePositions[4] = mod.group.position.y;
                linePositions[5] = mod.group.position.z;
                mod.line.geometry.attributes.position.needsUpdate = true;

                const pulseScale = 1 + Math.sin(elapsed * 2 + i * 1.5) * 0.1;
                mod.cube.scale.setScalar(pulseScale);
            });

            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;

            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            renderer.dispose();
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{ filter: 'blur(1px)' }}
        />
    );
}
