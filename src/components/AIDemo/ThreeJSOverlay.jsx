import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeJSOverlay({ predictions = [], canvasSize = { width: 400, height: 300 } }) {
    const containerRef = useRef(null);
    const boxesRef = useRef([]);

    const getColorForClass = (index) => {
        const colorHex = ['#00e9fa', '#00ff88', '#ff6b35', '#ffdd00', '#bb86fc'][index % 5];
        const hex = colorHex.replace('#', '0x');
        return new THREE.Color(parseInt(hex, 16));
    };

    // Normalize bbox helper
    const toBox = (bbox, width, height) => {
        if (!bbox || bbox.length < 4) return null;
        const [a, b, c, d] = bbox.map(Number);

        const normalized = [a, b, c, d].every((v) => v >= 0 && v <= 1);
        if (normalized) {
            const x1 = a * width;
            const y1 = b * height;
            const x2 = x1 + c * width;
            const y2 = y1 + d * height;
            return [x1, y1, x2, y2];
        }

        const looksLikeSize = c > 0 && d > 0 && (c <= width / 2 || d <= height / 2);
        if (looksLikeSize && (c + a <= width) && (d + b <= height)) {
            return [a, b, a + c, b + d];
        }

        return [a, b, c, d];
    };

    useEffect(() => {
        if (!containerRef.current || !predictions.length) return;

        const width = canvasSize.width;
        const height = canvasSize.height;

        // Initialize Three.js scene (reset each time for clean render)
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        // Orthographic camera: origin at top-left like image coordinates
        const camera = new THREE.OrthographicCamera(
            0, width,           // left, right
            height, 0,          // bottom, top (flipped for image coords)
            0.1, 1000
        );
        camera.position.z = 100;

        // Create 3D markers for each detection
        predictions.forEach((pred, index) => {
            const box = toBox(pred.bbox, width, height);
            if (!box) return;

            const [x1, y1, x2, y2] = box;
            const boxWidth = x2 - x1;
            const boxHeight = y2 - y1;
            const centerX = x1 + boxWidth / 2;
            const centerY = y1 + boxHeight / 2;

            const color = getColorForClass(index);

            // Create 3D box with correct positioning
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, 15);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.7,
                wireframe: false,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);
            // Position in image coordinates: center of box
            mesh.position.set(centerX, centerY, 5);
            mesh.userData.baseRotation = { x: 0, y: 0 };

            scene.add(mesh);
            boxesRef.current.push(mesh);

            // Create border lines to highlight the box
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: color, linewidth: 3 })
            );
            line.position.copy(mesh.position);
            scene.add(line);
            boxesRef.current.push(line);

            // Create text label with score - positioned above the box
            const labelCanvas = document.createElement('canvas');
            const ctx = labelCanvas.getContext('2d');
            labelCanvas.width = 256;
            labelCanvas.height = 64;

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
            ctx.strokeStyle = color.getStyle();
            ctx.lineWidth = 3;
            ctx.strokeRect(2, 2, labelCanvas.width - 4, labelCanvas.height - 4);
            ctx.fillStyle = color.getStyle();
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${pred.class}`, labelCanvas.width / 2, 40);
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`${(pred.score * 100).toFixed(0)}%`, labelCanvas.width / 2, 60);

            const texture = new THREE.CanvasTexture(labelCanvas);
            const labelGeom = new THREE.PlaneGeometry(boxWidth * 1.3, 50);
            const labelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            const label = new THREE.Mesh(labelGeom, labelMat);
            label.position.set(centerX, centerY - boxHeight / 2 - 35, 10);

            scene.add(label);
            boxesRef.current.push(label);
        });

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(width / 2, height / 2, 150);
        scene.add(pointLight);

        // Animation loop with smooth rotation
        let frameId;
        let frameCount = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            frameCount++;

            // Rotate 3D boxes smoothly for visual effect
            boxesRef.current.forEach((mesh) => {
                if (mesh.geometry && mesh.geometry.type === 'BoxGeometry') {
                    mesh.rotation.x = Math.sin(frameCount * 0.005) * 0.3;
                    mesh.rotation.y = frameCount * 0.008;
                    mesh.rotation.z = Math.cos(frameCount * 0.007) * 0.2;
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(frameId);
            renderer.dispose();
        };
    }, [predictions, canvasSize]);

    // Cleanup
    useEffect(() => {
        return () => {
            boxesRef.current = [];
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none"
            style={{
                width: canvasSize.width,
                height: canvasSize.height
            }}
        />
    );
}
