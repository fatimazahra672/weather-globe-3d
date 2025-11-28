import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export const SoundManager = () => {
    const { isLoaded, weather, main } = useSelector(({ weather }) => weather);
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const [currentSound, setCurrentSound] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [useSynthetic, setUseSynthetic] = useState(false);

    const sounds = {
        space: '/sounds/wind.mp3',
        rain: '/sounds/rain.mp3',
        thunder: '/sounds/thunder.mp3',
        wind: '/sounds/wind.mp3',
        nature: '/sounds/nature.mp3',
        clouds: '/sounds/clouds.mp3',
    };

    const getSoundForWeather = () => {
        if (!isLoaded || !weather || !main) {
            console.log('🎵 Pas de météo chargée → son space');
            return 'space';
        }

        const weatherMain = weather.main?.toLowerCase();
        const weatherDescription = weather.description?.toLowerCase();
        const temperature = main.temp;

        console.log('🎵 Météo actuelle:', weatherMain, weatherDescription, '| Temp:', temperature + '°C');

        if (weatherMain === 'rain' || weatherMain === 'drizzle' || weatherMain === 'thunderstorm' || weatherDescription?.includes('rain')) {
            console.log('🎵 → Son de pluie');
            return 'rain';
        }

        if (weatherMain === 'clouds' || weatherDescription?.includes('cloud') || weatherDescription?.includes('overcast')) {
            if (temperature <= 0) {
                console.log('🎵 → Son de nuages (température ≤ 0°C)');
                return 'clouds';
            } else {
                console.log('🎵 → Son de nature (nuages mais température > 0°C)');
                return 'nature';
            }
        }

        if (weatherMain === 'clear' || weatherDescription?.includes('clear') || weatherDescription?.includes('sunny')) {
            console.log('🎵 → Son de nature (ciel dégagé)');
            return 'nature';
        }

        console.log('🎵 → Son de vent (défaut)');
        return 'wind';
    };

    // Changer le son quand la météo change
    useEffect(() => {
        const newSound = getSoundForWeather();

        if (newSound !== currentSound) {
            console.log('🎵 Changement de son:', currentSound, '→', newSound);
            setCurrentSound(newSound);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, weather]);

    // Générer un son synthétique avec Web Audio API
    const playSyntheticSound = (type) => {
        // Arrêter le son précédent
        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop();
            } catch (e) {
                // Ignorer si deja arrete
            }
            oscillatorRef.current = null;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        // Reprendre le contexte audio s'il est suspendu
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (type === 'rain') {
            // Son de pluie - bruit blanc avec plusieurs oscillateurs
            const oscillators = [];
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.08;
            gainNode.connect(audioContext.destination);

            // Créer plusieurs oscillateurs pour simuler le bruit blanc
            for (let i = 0; i < 5; i++) {
                const osc = audioContext.createOscillator();
                const filter = audioContext.createBiquadFilter();

                osc.type = 'sawtooth';
                osc.frequency.value = 100 + (i * 200);

                filter.type = 'bandpass';
                filter.frequency.value = 800 + (i * 400);
                filter.Q.value = 0.3;

                osc.connect(filter);
                filter.connect(gainNode);
                osc.start();

                oscillators.push(osc);
            }

            oscillatorRef.current = { stop: () => oscillators.forEach(o => o.stop()) };
            gainNodeRef.current = gainNode;

            console.log('Son synthetique active: pluie');
        } else if (type === 'wind') {
            // Son de vent - ambiance douce et continue
            const oscillators = [];
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.10;
            gainNode.connect(audioContext.destination);

            // Oscillateur principal - vent grave
            const osc1 = audioContext.createOscillator();
            const filter1 = audioContext.createBiquadFilter();
            osc1.type = 'sawtooth';
            osc1.frequency.value = 120;
            filter1.type = 'lowpass';
            filter1.frequency.value = 300;
            filter1.Q.value = 0.5;
            osc1.connect(filter1);
            filter1.connect(gainNode);

            // Modulation pour simuler les rafales
            osc1.frequency.setValueAtTime(120, audioContext.currentTime);
            osc1.frequency.linearRampToValueAtTime(180, audioContext.currentTime + 3);
            osc1.frequency.linearRampToValueAtTime(120, audioContext.currentTime + 6);

            osc1.start();
            oscillators.push(osc1);

            // Oscillateur secondaire - texture
            const osc2 = audioContext.createOscillator();
            const filter2 = audioContext.createBiquadFilter();
            osc2.type = 'sawtooth';
            osc2.frequency.value = 200;
            filter2.type = 'bandpass';
            filter2.frequency.value = 400;
            filter2.Q.value = 0.3;
            osc2.connect(filter2);
            filter2.connect(gainNode);

            osc2.frequency.setValueAtTime(200, audioContext.currentTime);
            osc2.frequency.linearRampToValueAtTime(250, audioContext.currentTime + 4);
            osc2.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 8);

            osc2.start();
            oscillators.push(osc2);

            oscillatorRef.current = { stop: () => oscillators.forEach(o => o.stop()) };
            gainNodeRef.current = gainNode;

            console.log('Son synthetique active: vent');
        } else if (type === 'nature') {
            // Son de nature - oiseaux avec tons aigus
            const oscillators = [];
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.08;
            gainNode.connect(audioContext.destination);

            // Oscillateur 1 - oiseau 1
            const osc1 = audioContext.createOscillator();
            const filter1 = audioContext.createBiquadFilter();
            osc1.type = 'sine';
            osc1.frequency.value = 800;
            filter1.type = 'bandpass';
            filter1.frequency.value = 1000;
            filter1.Q.value = 2;
            osc1.connect(filter1);
            filter1.connect(gainNode);

            // Modulation pour simuler le chant
            osc1.frequency.setValueAtTime(800, audioContext.currentTime);
            osc1.frequency.linearRampToValueAtTime(1200, audioContext.currentTime + 0.5);
            osc1.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 1);

            osc1.start();
            oscillators.push(osc1);

            // Oscillateur 2 - oiseau 2 (harmonique)
            const osc2 = audioContext.createOscillator();
            const filter2 = audioContext.createBiquadFilter();
            osc2.type = 'triangle';
            osc2.frequency.value = 600;
            filter2.type = 'highpass';
            filter2.frequency.value = 500;
            osc2.connect(filter2);
            filter2.connect(gainNode);

            osc2.frequency.setValueAtTime(600, audioContext.currentTime);
            osc2.frequency.linearRampToValueAtTime(900, audioContext.currentTime + 0.7);
            osc2.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 1.4);

            osc2.start();
            oscillators.push(osc2);

            oscillatorRef.current = { stop: () => oscillators.forEach(o => o.stop()) };
            gainNodeRef.current = gainNode;

            console.log('Son synthetique active: nature (oiseaux)');
        }
    };

    useEffect(() => {
        if (!currentSound) return;

        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;

        console.log(`Chargement du son: ${currentSound}`);

        audio.src = sounds[currentSound];
        audio.volume = 1.0;
        audio.loop = true;
        audio.preload = 'auto';

        const handleError = () => {
            console.warn(`Fichier audio non trouve: ${sounds[currentSound]}`);
            console.log('Pas de son disponible - Telechargez les fichiers MP3');
        };

        const handleCanPlay = () => {
            console.log('Son charge avec succes');

            if (!isMuted) {
                audio.play().catch(error => {
                    console.log('Autoplay bloque:', error);
                });
            }
        };

        audio.addEventListener('error', handleError, { once: true });
        audio.addEventListener('canplaythrough', handleCanPlay, { once: true });

        audio.load();

        return () => {
            audio.pause();
        };
    }, [currentSound, isMuted]);

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (newMutedState) {
            console.log('Son desactive');

            if (audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            console.log('Activation du son...');

            if (audioRef.current && audioRef.current.readyState >= 2) {
                audioRef.current.play().catch(error => {
                    console.error('Erreur:', error);
                });
            }
        }
    };

    return (
        <>
            <audio ref={audioRef} />

            <button
                onClick={toggleMute}
                title={isMuted ? 'Activer le son' : 'Désactiver le son'}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isMuted
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(100, 255, 100, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = isMuted
                        ? 'rgba(255, 255, 255, 0.3)'
                        : 'rgba(100, 255, 100, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = isMuted
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(100, 255, 100, 0.3)';
                }}
            >
                <div>{isMuted ? '🔇' : '🔊'}</div>
                {useSynthetic && !isMuted && (
                    <div style={{ fontSize: '0.5rem', marginTop: '2px' }}>SYN</div>
                )}
            </button>
        </>
    );
};

