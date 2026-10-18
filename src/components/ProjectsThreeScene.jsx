import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PROJECT_STATS = [
    { name: 'Total Darkness', value: 1, color: 0x00e9fa },
    { name: 'Toolkit', value: 4, color: 0x00f9b8 },
    { name: 'Transit', value: 3, color: 0x00d9c5 },
    { name: 'Community Tech', value: 2, color: 0x00b89f },
    { name: 'Radio Nocaima', value: 1, color: 0x0099b8 },
    { name: 'El Ropero', value: 1, color: 0x006d97 }
];

export default function ProjectsThreeScene() {
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
        camera.position.z = 14;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00e9fa, 1.5);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const barGroup = new THREE.Group();
        scene.add(barGroup);

        const maxValue = Math.max(...PROJECT_STATS.map(p => p.value));

        const bars = PROJECT_STATS.map((stat, i) => {
            const group = new THREE.Group();

            const barHeight = (stat.value / maxValue) * 4 + 0.5;
            const barGeometry = new THREE.BoxGeometry(0.6, barHeight, 0.6);
            const barMaterial = new THREE.MeshPhongMaterial({
                color: stat.color,
                emissive: stat.color,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.85
            });
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.y = barHeight / 2;
            group.add(bar);

            const glowGeometry = new THREE.BoxGeometry(0.7, barHeight + 0.1, 0.7);
            const glowMaterial = new THREE.MeshPhongMaterial({
                color: stat.color,
                emissive: stat.color,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.15,
                wireframe: true
            });
            const glowBar = new THREE.Mesh(glowGeometry, glowMaterial);
            glowBar.position.y = barHeight / 2;
            group.add(glowBar);

            const baseGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
            const baseMaterial = new THREE.MeshPhongMaterial({
                color: stat.color,
                emissive: stat.color,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.5
            });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            group.add(base);

            const angle = (i / PROJECT_STATS.length) * Math.PI * 2;
            const radius = 4;
            group.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );

            barGroup.add(group);

            return { group, bar, glowBar, barMaterial, glowMaterial, barHeight, stat };
        });

        const orbitGeometry = new THREE.RingGeometry(3.8, 4, 64);
        const orbitMaterial = new THREE.MeshPhongMaterial({
            color: 0x00e9fa,
            emissive: 0x00e9fa,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        const centerGeometry = new THREE.OctahedronGeometry(0.5, 0);
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0x00e9fa,
            emissive: 0x00e9fa,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
        scene.add(centerMesh);

        const dataStreamGeometry = new THREE.BufferGeometry();
        const streamCount = 80;
        const streamPositions = new Float32Array(streamCount * 3);
        const streamColors = new Float32Array(streamCount * 3);

        for (let i = 0; i < streamCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 5;
            streamPositions[i * 3] = Math.cos(angle) * radius;
            streamPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            streamPositions[i * 3 + 2] = Math.sin(angle) * radius;

            const color = new THREE.Color(PROJECT_STATS[Math.floor(Math.random() * PROJECT_STATS.length)].color);
            streamColors[i * 3] = color.r;
            streamColors[i * 3 + 1] = color.g;
            streamColors[i * 3 + 2] = color.b;
        }

        dataStreamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
        dataStreamGeometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));

        const dataStreamMaterial = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.5
        });
        const dataStream = new THREE.Points(dataStreamGeometry, dataStreamMaterial);
        scene.add(dataStream);

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

            barGroup.rotation.y += 0.002;

            bars.forEach((barData, i) => {
                const pulse = 1 + Math.sin(elapsed * 1.5 + i * 1.2) * 0.08;
                barData.bar.scale.y = pulse;
                barData.glowBar.scale.y = pulse;

                barData.barMaterial.emissiveIntensity = 0.4 + Math.sin(elapsed * 2 + i) * 0.15;
                barData.glowMaterial.opacity = 0.1 + Math.sin(elapsed * 2 + i) * 0.05;
            });

            centerMesh.rotation.x += 0.01;
            centerMesh.rotation.y += 0.015;
            centerMaterial.emissiveIntensity = 0.8 + Math.sin(elapsed * 3) * 0.2;

            orbit.rotation.z += 0.003;
            orbitMaterial.opacity = 0.15 + Math.sin(elapsed) * 0.05;

            dataStream.rotation.y += 0.001;

            camera.position.x += (mouseX * 2 - camera.position.x) * 0.015;
            camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.015;
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
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{ filter: 'blur(1px)' }}
        />
    );
}
