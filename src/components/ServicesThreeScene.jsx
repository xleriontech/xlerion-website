import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SERVICES = [
    { name: 'Modular', color: 0x00e9fa },
    { name: 'Diagnostics', color: 0x00f9b8 },
    { name: 'Branding', color: 0x00d9c5 },
    { name: 'Documentation', color: 0x00b89f },
    { name: '3D Integration', color: 0x0099b8 },
    { name: 'Consulting', color: 0x006d97 }
];

export default function ServicesThreeScene() {
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
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00e9fa, 2);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);

        const nodeGroup = new THREE.Group();
        scene.add(nodeGroup);

        const nodes = SERVICES.map((service, i) => {
            const group = new THREE.Group();

            const geometry = new THREE.OctahedronGeometry(0.6, 0);
            const material = new THREE.MeshPhongMaterial({
                color: service.color,
                emissive: service.color,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.85,
                wireframe: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);

            const glowGeometry = new THREE.OctahedronGeometry(0.8, 0);
            const glowMaterial = new THREE.MeshPhongMaterial({
                color: service.color,
                emissive: service.color,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.2,
                wireframe: true
            });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            group.add(glowMesh);

            const angle = (i / SERVICES.length) * Math.PI * 2;
            const radius = 5;
            group.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );

            nodeGroup.add(group);

            return { group, mesh, glowMesh, material, glowMaterial, angle, color: service.color };
        });

        const connections = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const points = [
                    nodes[i].group.position.clone(),
                    nodes[j].group.position.clone()
                ];
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0x00e9fa,
                    transparent: true,
                    opacity: 0.15
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                nodeGroup.add(line);
                connections.push({ line, from: i, to: j });
            }
        }

        const centerGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const centerMaterial = new THREE.MeshPhongMaterial({
            color: 0x00e9fa,
            emissive: 0x00e9fa,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
        nodeGroup.add(centerMesh);

        const dataParticlesGeometry = new THREE.BufferGeometry();
        const particleCount = 60;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 4;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

            const color = new THREE.Color(SERVICES[Math.floor(Math.random() * SERVICES.length)].color);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        dataParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        dataParticlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const dataParticlesMaterial = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.5
        });
        const dataParticles = new THREE.Points(dataParticlesGeometry, dataParticlesMaterial);
        scene.add(dataParticles);

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

            nodeGroup.rotation.z += 0.001;

            nodes.forEach((node, i) => {
                node.mesh.rotation.x += 0.008;
                node.mesh.rotation.y += 0.012;

                const pulse = 1 + Math.sin(elapsed * 2 + i * 1.2) * 0.15;
                node.mesh.scale.setScalar(pulse);

                node.glowMesh.rotation.x -= 0.005;
                node.glowMesh.rotation.y -= 0.008;
                node.glowMesh.scale.setScalar(pulse * 1.2);

                node.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 1.5 + i) * 0.2;
            });

            centerMesh.rotation.x += 0.01;
            centerMesh.rotation.y += 0.015;
            centerMaterial.emissiveIntensity = 0.8 + Math.sin(elapsed * 3) * 0.2;

            connections.forEach((conn, i) => {
                const fromPos = nodes[conn.from].group.position;
                const toPos = nodes[conn.to].group.position;
                const linePositions = conn.line.geometry.attributes.position.array;
                linePositions[0] = fromPos.x;
                linePositions[1] = fromPos.y;
                linePositions[2] = fromPos.z;
                linePositions[3] = toPos.x;
                linePositions[4] = toPos.y;
                linePositions[5] = toPos.z;
                conn.line.geometry.attributes.position.needsUpdate = true;

                conn.line.material.opacity = 0.1 + Math.sin(elapsed + i * 0.5) * 0.08;
            });

            dataParticles.rotation.z += 0.0003;

            camera.position.x += (mouseX * 2 - camera.position.x) * 0.015;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.015;
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
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{ filter: 'blur(1px)' }}
        />
    );
}
