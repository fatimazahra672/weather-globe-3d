import wallpaper from '../../assets/img/wallpaper.jpg'
import './Wallpaper.scss'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export const Wallpaper = () => {
    const { isLoaded } = useSelector(({weather}) => weather);
    const [stars, setStars] = useState([]);
    const [satellites, setSatellites] = useState([]);

    // Générer des étoiles aléatoires (une seule fois au montage)
    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            for (let i = 0; i < 200; i++) {
                newStars.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 3 + 1,
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2
                });
            }
            setStars(newStars);
        };

        // Générer des satellites
        const generateSatellites = () => {
            const newSatellites = [];
            for (let i = 0; i < 3; i++) {
                newSatellites.push({
                    id: i,
                    startX: Math.random() * 100,
                    startY: Math.random() * 100,
                    duration: Math.random() * 20 + 15,
                    delay: Math.random() * 5
                });
            }
            setSatellites(newSatellites);
        };

        // ✅ Générer une seule fois au montage du composant
        generateStars();
        generateSatellites();
    }, []);  // ✅ Tableau vide = exécution une seule fois

    return (
        <>
           <div className={'wallpaper-container position-fixed d-flex top-0 bottom-0 end-0 start-0'}>
               {/* ✅ Fond spatial avec étoiles et satellites - Toujours visible */}
               <div className="space-background">
                   {/* Étoiles scintillantes */}
                   {stars.map(star => (
                       <div
                           key={star.id}
                           className="star"
                           style={{
                               left: `${star.x}%`,
                               top: `${star.y}%`,
                               width: `${star.size}px`,
                               height: `${star.size}px`,
                               animationDuration: `${star.duration}s`,
                               animationDelay: `${star.delay}s`
                           }}
                       />
                   ))}

                   {/* Satellites en mouvement */}
                   {satellites.map(satellite => (
                       <div
                           key={satellite.id}
                           className="satellite"
                           style={{
                               left: `${satellite.startX}%`,
                               top: `${satellite.startY}%`,
                               animationDuration: `${satellite.duration}s`,
                               animationDelay: `${satellite.delay}s`
                           }}
                       >
                           🛰️
                       </div>
                   ))}
               </div>
           </div>
        </>
    )
}