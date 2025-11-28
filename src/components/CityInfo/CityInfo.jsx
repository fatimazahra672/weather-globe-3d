import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import styles from './CityInfo.module.scss';

export const cityDatabase = {
    'Paris': {
        description: '✨ La Ville Lumière, capitale de la France, célèbre pour la Tour Eiffel, le Louvre et ses cafés romantiques',
        facts: [
            { icon: '🗼', title: 'Monument emblématique', text: 'Tour Eiffel - 330 mètres de hauteur' },
            { icon: '🎨', title: 'Culture', text: 'Plus de 130 musées dont le Louvre' },
            { icon: '🥐', title: 'Gastronomie', text: 'Capitale mondiale de la gastronomie' }
        ]
    },
    'London': {
        description: '🇬🇧 Capitale du Royaume-Uni, mélange parfait entre tradition royale et modernité cosmopolite',
        facts: [
            { icon: '👑', title: 'Royauté', text: 'Buckingham Palace et la famille royale' },
            { icon: '🌉', title: 'Architecture', text: 'Tower Bridge et Big Ben' },
            { icon: '🎭', title: 'Culture', text: 'West End - théâtres de renommée mondiale' }
        ]
    },
    'New York': {
        description: '🗽 La ville qui ne dort jamais, centre financier et culturel mondial',
        facts: [
            { icon: '🗽', title: 'Symbole', text: 'Statue de la Liberté' },
            { icon: '🏙️', title: 'Skyline', text: 'Empire State Building et Times Square' },
            { icon: '🎬', title: 'Divertissement', text: 'Broadway et Hollywood East' }
        ]
    },
    'Tokyo': {
        description: '🇯🇵 Métropole futuriste où tradition japonaise et technologie se rencontrent',
        facts: [
            { icon: '🏯', title: 'Tradition', text: 'Temples anciens et jardins zen' },
            { icon: '🤖', title: 'Technologie', text: 'Capitale mondiale de la robotique' },
            { icon: '🍣', title: 'Cuisine', text: 'Plus de restaurants étoilés au monde' }
        ]
    },
    'Dubai': {
        description: '🏜️ Oasis moderne du désert, symbole de luxe et d\'innovation architecturale',
        facts: [
            { icon: '🏗️', title: 'Architecture', text: 'Burj Khalifa - plus haute tour du monde' },
            { icon: '🛍️', title: 'Shopping', text: 'Dubai Mall - centre commercial géant' },
            { icon: '🏖️', title: 'Luxe', text: 'Hôtels et plages de luxe' }
        ]
    },
    'Al Hoceima': {
        description: '🏖️ Perle de la Méditerranée, ville côtière marocaine célèbre pour ses plages paradisiaques',
        facts: [
            { icon: '🌊', title: 'Plages', text: 'Plage Quemado et Cala Bonita' },
            { icon: '🏔️', title: 'Nature', text: 'Parc National d\'Al Hoceima' },
            { icon: '🐟', title: 'Gastronomie', text: 'Poissons frais et fruits de mer' }
        ]
    },
    'Rome': {
        description: '🏛️ La Ville Éternelle, berceau de la civilisation occidentale',
        facts: [
            { icon: '🏛️', title: 'Histoire', text: 'Colisée et Forum Romain' },
            { icon: '⛪', title: 'Religion', text: 'Vatican et Basilique Saint-Pierre' },
            { icon: '🍝', title: 'Cuisine', text: 'Pasta, pizza et gelato authentiques' }
        ]
    },
    'Barcelona': {
        description: '🎨 Capitale catalane, célèbre pour l\'architecture de Gaudí et sa vie nocturne',
        facts: [
            { icon: '🏰', title: 'Architecture', text: 'Sagrada Familia de Gaudí' },
            { icon: '🏖️', title: 'Plages', text: 'Plages urbaines méditerranéennes' },
            { icon: '⚽', title: 'Sport', text: 'FC Barcelona et Camp Nou' }
        ]
    },
    'Casablanca': {
        description: '🇲🇦 Capitale économique du Maroc, ville moderne et dynamique',
        facts: [
            { icon: '🕌', title: 'Monument', text: 'Mosquée Hassan II - 3ème plus grande au monde' },
            { icon: '🏢', title: 'Économie', text: 'Centre financier du Maghreb' },
            { icon: '🌊', title: 'Corniche', text: 'Front de mer animé et restaurants' }
        ]
    },
    'Marrakech': {
        description: '🇲🇦 La Ville Rouge, perle du sud marocain, mélange de tradition et modernité',
        facts: [
            { icon: '🕌', title: 'Médina', text: 'Place Jemaa el-Fna - cœur battant de la ville' },
            { icon: '🏰', title: 'Palais', text: 'Palais de la Bahia et jardins Majorelle' },
            { icon: '🏔️', title: 'Nature', text: 'Porte de l\'Atlas et du désert' }
        ]
    },
    'Rabat': {
        description: '🇲🇦 Capitale du Maroc, ville impériale au charme authentique',
        facts: [
            { icon: '👑', title: 'Capitale', text: 'Siège du gouvernement et de la famille royale' },
            { icon: '🏛️', title: 'Histoire', text: 'Tour Hassan et Kasbah des Oudayas' },
            { icon: '🌊', title: 'Océan', text: 'Ville côtière sur l\'Atlantique' }
        ]
    },
    'Fes': {
        description: '🇲🇦 Capitale spirituelle du Maroc, ville millénaire et authentique',
        facts: [
            { icon: '📚', title: 'Culture', text: 'Université Al Quaraouiyine - plus ancienne au monde' },
            { icon: '🏺', title: 'Artisanat', text: 'Tanneries et souks traditionnels' },
            { icon: '🕌', title: 'Médina', text: 'Plus grande médina médiévale au monde' }
        ],
        coordinates: { lat: 34.0331, lon: -5.0003 }
    },
    'Nador': {
        description: '🇲🇦 Ville portuaire du nord-est marocain, porte de la Méditerranée',
        facts: [
            { icon: '⚓', title: 'Port', text: 'Important port commercial et de pêche' },
            { icon: '🏖️', title: 'Plages', text: 'Lagune de Marchica et plages magnifiques' },
            { icon: '🌊', title: 'Méditerranée', text: 'Climat méditerranéen doux toute l\'année' }
        ],
        coordinates: { lat: 35.1681, lon: -2.9333 }
    },
    'Tanger': {
        description: '🇲🇦 Porte de l\'Afrique, ville mythique entre deux mers et deux continents',
        facts: [
            { icon: '🌊', title: 'Détroit', text: 'Vue sur le détroit de Gibraltar et l\'Espagne' },
            { icon: '🎨', title: 'Culture', text: 'Ville d\'artistes et d\'écrivains célèbres' },
            { icon: '⚓', title: 'Port', text: 'Plus grand port d\'Afrique - Tanger Med' }
        ]
    },
    'Tangier': {
        description: '🇲🇦 Porte de l\'Afrique, ville mythique entre deux mers et deux continents',
        facts: [
            { icon: '🌊', title: 'Détroit', text: 'Vue sur le détroit de Gibraltar et l\'Espagne' },
            { icon: '🎨', title: 'Culture', text: 'Ville d\'artistes et d\'écrivains célèbres' },
            { icon: '⚓', title: 'Port', text: 'Plus grand port d\'Afrique - Tanger Med' }
        ]
    },
    'Agadir': {
        description: '🇲🇦 Station balnéaire moderne sur l\'Atlantique, paradis du surf',
        facts: [
            { icon: '🏄', title: 'Surf', text: 'Spots de surf réputés mondialement' },
            { icon: '☀️', title: 'Climat', text: '300 jours de soleil par an' },
            { icon: '🏖️', title: 'Plage', text: '10 km de plage de sable fin' }
        ]
    },
    'Marseille': {
        description: '🇫🇷 Plus vieille ville de France, porte de la Méditerranée',
        facts: [
            { icon: '⛵', title: 'Port', text: 'Vieux-Port et Calanques' },
            { icon: '🥘', title: 'Gastronomie', text: 'Bouillabaisse et pastis' },
            { icon: '⚽', title: 'Sport', text: 'Olympique de Marseille - Stade Vélodrome' }
        ]
    },
    'Lyon': {
        description: '🇫🇷 Capitale de la gastronomie française, ville des lumières',
        facts: [
            { icon: '🍽️', title: 'Gastronomie', text: 'Bouchons lyonnais et Paul Bocuse' },
            { icon: '🎭', title: 'Culture', text: 'Fête des Lumières en décembre' },
            { icon: '🏛️', title: 'Histoire', text: 'Vieux Lyon - patrimoine UNESCO' }
        ]
    },
    'Nice': {
        description: '🇫🇷 Perle de la Côte d\'Azur, entre mer et montagnes',
        facts: [
            { icon: '🏖️', title: 'Promenade', text: 'Promenade des Anglais' },
            { icon: '🎨', title: 'Art', text: 'Musées Matisse et Chagall' },
            { icon: '☀️', title: 'Climat', text: '300 jours de soleil par an' }
        ]
    }
};

export const findCityInfo = (cityName) => {
    if (!cityName) return null;

    const normalize = (str) => str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[,\-]/g, ' ')
        .trim();

    const normalizedCityName = normalize(cityName);
    const firstWord = normalizedCityName.split(' ')[0];

    console.log('🔎 Recherche pour:', cityName, '| Normalisé:', normalizedCityName, '| Premier mot:', firstWord);

    if (cityDatabase[cityName]) {
        console.log('✅ Trouvé par recherche exacte');
        return cityDatabase[cityName];
    }

    for (const [key, value] of Object.entries(cityDatabase)) {
        if (normalize(key) === normalizedCityName) {
            console.log('✅ Trouvé par normalisation:', key);
            return value;
        }
    }

    for (const [key, value] of Object.entries(cityDatabase)) {
        const normalizedKey = normalize(key);
        if (normalizedKey === firstWord || firstWord === normalizedKey.split(' ')[0]) {
            console.log('✅ Trouvé par premier mot:', key);
            return value;
        }
    }

    for (const [key, value] of Object.entries(cityDatabase)) {
        const normalizedKey = normalize(key);
        if (normalizedCityName.includes(normalizedKey) || normalizedKey.includes(normalizedCityName)) {
            console.log('✅ Trouvé par recherche partielle:', key);
            return value;
        }
    }

    console.log('❌ Aucune correspondance trouvée');
    return null;
};

export const CityInfo = () => {
    const { name, targetLocation, sys } = useSelector(({ weather }) => weather);
    const [cityInfo, setCityInfo] = useState(null);

    useEffect(() => {
        if (name && targetLocation) {
            console.log('🔍 Recherche d\'infos pour la ville:', name);
            console.log('📍 Coordonnées utilisées:', targetLocation);

            let info = findCityInfo(name);

            if (info) {
                console.log('✅ Infos trouvées pour:', name);
            } else {
                console.log('❌ Pas d\'infos dans la base pour:', name, '- Utilisation d\'infos génériques');
            }

            if (!info) {
                info = {
                    description: `🌍 ${name} - Une destination unique à découvrir`,
                    facts: [
                        { icon: '📍', title: 'Localisation', text: `Lat: ${targetLocation.lat.toFixed(2)}°, Lon: ${targetLocation.lon.toFixed(2)}°` },
                        { icon: '🌍', title: 'Exploration', text: 'Utilisez la molette pour zoomer sur le globe' },
                        { icon: '☁️', title: 'Météo', text: 'Consultez les détails météo à droite' }
                    ]
                };
            }

            setCityInfo(info);
        } else {
            setCityInfo(null);
        }
    }, [name, targetLocation]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.hideScrollbar}
            style={{
                width: '380px',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '2rem',
                color: 'white',
                marginLeft: '2rem',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
                {targetLocation ? `🌍 ${name}` : '🌍 Explorez le monde'}
            </h2>
            
            {targetLocation && cityInfo ? (
                <div>
                    {/* Description de la ville */}
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                        {cityInfo.description}
                    </p>

                    {/* Cartes d'informations sur la ville */}
                    <div style={{
                        display: 'grid',
                        gap: '1rem',
                        marginTop: '1.5rem'
                    }}>
                        {cityInfo.facts.map((fact, index) => {
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (index * 0.1) }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{fact.icon}</div>
                                    <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>{fact.title}</h3>
                                    <p style={{ margin: 0, opacity: 0.9 }}>
                                        {fact.text}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                        ✨ Recherchez une ville pour découvrir sa météo et explorer sa localisation sur le globe terrestre.
                    </p>
                    <div style={{ marginTop: '2rem', fontSize: '3rem', textAlign: 'center' }}>
                        🔍
                    </div>
                </div>
            )}
        </motion.div>
    );
};

