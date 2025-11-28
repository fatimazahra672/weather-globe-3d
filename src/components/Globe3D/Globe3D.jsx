import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import styles from './Globe3D.module.scss';
import { useDispatch } from 'react-redux';
import { setData, resetData } from '../../features/weather/WeatherSlice';

function cartesianToLatLon(x, y, z) {
    const radius = Math.sqrt(x * x + y * y + z * z);
    const lat = Math.asin(y / radius) * (180 / Math.PI);
    let lon = Math.atan2(z, -x) * (180 / Math.PI) - 180;

    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;

    return { lat, lon };
}

function LocationMarkerInternal({ position }) {
    const circleRef = useRef();

    useFrame((state) => {
        if (circleRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
            circleRef.current.scale.set(scale, scale, 1);
            circleRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
        }
    });

    if (!position) return null;

    const { x, y, z } = position;

    return (
        <group position={[x, y, z]}>
            <mesh>
                <sphereGeometry args={[0.008, 16, 16]} />
                <meshBasicMaterial
                    color="#ff0000"
                />
            </mesh>

            <mesh
                ref={circleRef}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.009, 0.013, 32]} />
                <meshBasicMaterial
                    color="#ff0000"
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}

function Earth({ targetPosition, isZooming, onGlobeClick }) {
    const earthRef = useRef();
    const pointerDownPos = useRef(null);

    const texture = useLoader(TextureLoader, 'https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg');
    console.log('✅ Texture chargée avec useLoader!', texture);

    const handlePointerDown = (event) => {
        console.log('👇 PointerDown');
        pointerDownPos.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event) => {
        console.log('👆 PointerUp');

        if (pointerDownPos.current) {
            const dx = Math.abs(event.clientX - pointerDownPos.current.x);
            const dy = Math.abs(event.clientY - pointerDownPos.current.y);
            const distance = Math.sqrt(dx * dx + dy * dy);

            console.log('📏 Distance de mouvement:', distance);

            if (distance < 5) {
                console.log('✅ Clic détecté (pas un drag)');

                const intersect = event.intersections[0];
                console.log('🎯 Intersect:', intersect);

                if (intersect && intersect.object.geometry.type === 'SphereGeometry') {
                    const worldPoint = intersect.point;
                    const localPoint = earthRef.current.worldToLocal(worldPoint.clone());

                    console.log('🌍 Point monde:', worldPoint);
                    console.log('📍 Point local (via group):', localPoint);

                    const { lat, lon } = cartesianToLatLon(localPoint.x, localPoint.y, localPoint.z);

                    console.log('🖱️ Clic sur le globe:', { lat, lon, worldPoint, localPoint });

                    if (onGlobeClick) {
                        console.log('📞 Appel onGlobeClick');
                        onGlobeClick(lat, lon);
                    } else {
                        console.warn('⚠️ onGlobeClick non défini');
                    }
                } else {
                    console.warn('⚠️ Pas de SphereGeometry détectée');
                }
            } else {
                console.log('❌ Drag détecté, pas de clic');
            }
        }

        pointerDownPos.current = null;
    };

    let markerPosition = null;
    if (targetPosition) {
        const { lat, lon } = targetPosition;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const radius = 2.03;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        markerPosition = { x, y, z };
    }

    console.log('🌍 Earth render - Texture:', texture ? '✅ Chargée' : '❌ Non chargée');

    return (
        <group ref={earthRef}>
            <mesh
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerOver={() => {
                    console.log('🖱️ Souris sur le globe');
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    console.log('🖱️ Souris hors du globe');
                    document.body.style.cursor = 'default';
                }}
            >
                <sphereGeometry args={[2, 64, 64]} />
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                    />
                ) : (
                    <meshStandardMaterial
                        color="#1a5f9e"
                        roughness={0.7}
                        metalness={0.2}
                    />
                )}
            </mesh>

            {markerPosition && (
                <LocationMarkerInternal position={markerPosition} />
            )}
        </group>
    );
}

function CameraController({ targetPosition, isZooming, onZoomComplete, horizontalOffset, verticalOffset }) {
    const controlsRef = useRef();
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    console.log('📹 CameraController:', { targetPosition, isZooming, horizontalOffset, verticalOffset, hasControls: !!controlsRef.current });

    useEffect(() => {
        console.log('📹 CameraController useEffect:', { targetPosition, isZooming, hasControls: !!controlsRef.current });

        if (!controlsRef.current) return;

        if (isZooming && targetPosition) {
            console.log('🎯 Zoom vers:', targetPosition);

            const { lat, lon } = targetPosition;

            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            const globeRadius = 2.03;

            const markerX = -(globeRadius * Math.sin(phi) * Math.cos(theta));
            const markerZ = globeRadius * Math.sin(phi) * Math.sin(theta);
            const markerY = globeRadius * Math.cos(phi);

            const cameraDistance = 3.5;
            const cameraX = -(cameraDistance * Math.sin(phi) * Math.cos(theta));
            const cameraZ = cameraDistance * Math.sin(phi) * Math.sin(theta);
            const cameraY = cameraDistance * Math.cos(phi);

            console.log('📍 Position marqueur:', { x: markerX, y: markerY, z: markerZ });
            console.log('📷 Position caméra (avant offset):', { x: cameraX, y: cameraY, z: cameraZ });

            const direction = new THREE.Vector3(-cameraX, -cameraY, -cameraZ).normalize();
            const up = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3().crossVectors(direction, up).normalize();
            const cameraUp = new THREE.Vector3().crossVectors(right, direction).normalize();

            const offsetVector = new THREE.Vector3()
                .addScaledVector(right, -horizontalOffset)
                .addScaledVector(cameraUp, verticalOffset);

            const startPosition = controlsRef.current.object.position.clone();
            const endPosition = new THREE.Vector3(cameraX, cameraY, cameraZ).add(offsetVector);

            console.log('📷 Position caméra (après offset):', {
                x: endPosition.x,
                y: endPosition.y,
                z: endPosition.z,
                offsetH: horizontalOffset,
                offsetV: verticalOffset
            });

            const duration = 2500;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeProgress = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                controlsRef.current.object.position.lerpVectors(
                    startPosition,
                    endPosition,
                    easeProgress
                );

                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    console.log('Zoom termine');
                    onZoomComplete();
                }
            };

            animate();
        }
        else if (!targetPosition && controlsRef.current) {
            console.log('🔙 Retour à la vue normale');

            const startPosition = controlsRef.current.object.position.clone();
            const endPosition = new THREE.Vector3(0, 0, 8);
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeProgress = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                controlsRef.current.object.position.lerpVectors(
                    startPosition,
                    endPosition,
                    easeProgress
                );

                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }
    }, [targetPosition, isZooming, onZoomComplete, horizontalOffset, verticalOffset]);

    return (
        <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={2.5}
            maxDistance={10}
            autoRotate={!targetPosition && !isUserInteracting}
            autoRotateSpeed={0.5}
            rotateSpeed={0.8}
            dampingFactor={0.05}
            enableDamping={true}
            makeDefault
            onStart={() => {
                console.log('OrbitControls - Start');
                setIsUserInteracting(true);
            }}
            onEnd={() => {
                console.log('OrbitControls - End');
                setTimeout(() => setIsUserInteracting(false), 2000);
            }}
            onChange={() => console.log('OrbitControls - Change')}
        />
    );
}

export const Globe3D = ({
    targetLocation,
    isZooming,
    onZoomComplete,
    show,
    horizontalOffset = 0.2,
    verticalOffset = 0
}) => {
    const dispatch = useDispatch();
    const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API;

    console.log('🌍 Globe3D render:', { targetLocation, isZooming, show, horizontalOffset, verticalOffset });
    if (targetLocation) {
        console.log('🗺️ Globe reçoit les coordonnées:', targetLocation);
    }

    const handleGlobeClick = async (lat, lon) => {
        console.log('🌍 Récupération météo pour:', { lat, lon });

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            const { clouds, main, name, sys, weather, wind, timezone } = json;

            console.log('✅ Météo récupérée:', json);

            dispatch(setData({
                clouds,
                main,
                name,
                sys,
                weather,
                wind,
                timezone,
                lat,
                lon
            }));
        } catch (error) {
            console.error('❌ Erreur lors de la récupération de la météo:', error);
        }
    };

    const handleClickOutside = () => {
        console.log('🚫 Clic en dehors du globe - Fermeture de l\'affichage météo');
        dispatch(resetData());
    };

    if (!show) return null;

    return (
        <div
            className={`${styles.globeContainer} ${isZooming ? styles.zooming : ''}`}
            onMouseDown={() => console.log('🖱️ MouseDown sur DIV')}
            onMouseUp={() => console.log('🖱️ MouseUp sur DIV')}
        >
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                style={{ background: 'transparent', cursor: 'grab' }}
                gl={{ antialias: true, alpha: true }}
                onPointerMissed={handleClickOutside}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 3, 5]} intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />

                <Suspense fallback={
                    <mesh>
                        <sphereGeometry args={[2, 64, 64]} />
                        <meshStandardMaterial
                            color="#1a5f9e"
                            roughness={0.7}
                            metalness={0.2}
                        />
                    </mesh>
                }>
                    <Earth
                        targetPosition={targetLocation}
                        isZooming={isZooming}
                        onZoomComplete={onZoomComplete}
                        onGlobeClick={handleGlobeClick}
                    />
                </Suspense>

                <CameraController
                    targetPosition={targetLocation}
                    isZooming={isZooming}
                    onZoomComplete={onZoomComplete}
                    horizontalOffset={horizontalOffset}
                    verticalOffset={verticalOffset}
                />
            </Canvas>
        </div>
    );
};