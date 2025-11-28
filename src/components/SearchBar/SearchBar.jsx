import styles from './SearchBar.module.scss'
import {Autocomplete, Button, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {resetData, setData} from "../../features/weather/WeatherSlice";
import PositionSvg from "../Svgs/PositionSvg";
import {findCityInfo} from "../CityInfo/CityInfo";

export const SearchBar = () => {
    const GEO_API_KEY = process.env.REACT_APP_GEO_API_KEY
    const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API
    const dispatch = useDispatch()
    const [cities, setCities] = useState([])
    const [unity] = useState('metric')
    const [geoLocation, setGeoLocation] = useState(undefined)
    const [isCurrentLocation, setIsCurrentLocation] = useState(false)
    const getGeoLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setIsCurrentLocation(true)
            setGeoLocation({
                lon: position.coords.longitude,
                lat: position.coords.latitude,
            })
        })
    }
    useEffect(() => {
        getGeoLocation()
    }, []);
    useEffect(() => {
        getData()
    }, [geoLocation]);

    const handleInputChange = (e) => {
        const {value} = e.currentTarget

        if (!value || value.length < 2) {
            setCities([]);
            return;
        }

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${WEATHER_API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                if (json && json.length > 0) {
                    setCities(json.map((data, index) => {
                        const {lat, lon, name, country, state} = data;
                        const formatted = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
                        const uniqueId = `${lat.toFixed(6)}_${lon.toFixed(6)}_${index}`;
                        return {
                            id: uniqueId,
                            lat,
                            lon,
                            city: name,
                            country,
                            state,
                            formatted
                        };
                    }));
                } else {
                    setCities([]);
                }
            })
            .catch(error => {
                console.error('❌ Erreur de recherche de ville:', error);
                setCities([]);
            });
    }
    const getData = () => {
        if (geoLocation) {
            console.log('🌍 Récupération météo pour:', geoLocation);

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoLocation.lat}&lon=${geoLocation.lon}&units=${unity}&appid=${WEATHER_API_KEY}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(json => {
                    console.log('✅ Données météo reçues:', json);

                    if (json.cod && json.cod !== 200) {
                        console.error('❌ Erreur API météo:', json.message);
                        return;
                    }

                    const {clouds, main, name, sys, weather, wind, timezone} = json;

                    console.log('🔍 Recherche de coordonnées corrigées pour:', name);
                    const cityInfo = findCityInfo(name);
                    let finalLat = geoLocation.lat;
                    let finalLon = geoLocation.lon;

                    console.log('📍 Coordonnées de l\'API:', { lat: finalLat, lon: finalLon });

                    if (cityInfo && cityInfo.coordinates) {
                        console.log('✅ Coordonnées corrigées trouvées!');
                        console.log('🔧 Avant correction:', { lat: finalLat, lon: finalLon });
                        finalLat = cityInfo.coordinates.lat;
                        finalLon = cityInfo.coordinates.lon;
                        console.log('🔧 Après correction:', { lat: finalLat, lon: finalLon });
                    } else {
                        console.log('⚠️ Pas de coordonnées corrigées pour cette ville');
                    }

                    console.log('📤 Envoi à Redux:', { lat: finalLat, lon: finalLon, timezone });

                    dispatch(setData({
                        clouds,
                        main,
                        name,
                        sys,
                        weather,
                        wind,
                        timezone,
                        lat: finalLat,
                        lon: finalLon
                    }));
                })
                .catch(error => {
                    console.error('❌ Erreur lors de la récupération des données météo:', error);
                });
        }
    }
    const handleAutocompleteSelect = (e, value) => {
        if (value !== null) {
            console.log('🎯 Ville sélectionnée:', value);
            let {lon, lat, city} = value;

            if (!lat || !lon) {
                console.error('❌ Coordonnées manquantes:', value);
                return;
            }

            console.log('🔍 Recherche de coordonnées corrigées pour:', city);
            const cityInfo = findCityInfo(city);

            console.log('📍 Coordonnées de l\'API:', { lat, lon });

            if (cityInfo && cityInfo.coordinates) {
                console.log('✅ Coordonnées corrigées trouvées!');
                console.log('🔧 Avant correction:', { lat, lon });
                lat = cityInfo.coordinates.lat;
                lon = cityInfo.coordinates.lon;
                console.log('🔧 Après correction:', { lat, lon });
            } else {
                console.log('⚠️ Pas de coordonnées corrigées pour cette ville');
            }

            setIsCurrentLocation(false);
            setGeoLocation({
                lon,
                lat,
            });

        } else {
            console.log('🔄 Réinitialisation');
            dispatch(resetData());
        }

    }
    return (
        <>
            <div
                className={styles.searchContainer}>
                <Autocomplete className={styles.searchInput}
                              clearOnBlur={false}
                              onChange={handleAutocompleteSelect}
                              getOptionLabel={(option) => option.formatted}
                              getOptionKey={(option) => option.id}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              renderInput={(params) =>
                                  <TextField onChange={handleInputChange} {...params}
                                             label={'Enter your city ...'}/>}
                              options={cities || []}/>

                <Button
                    disabled={geoLocation === undefined || isCurrentLocation === true}
                    variant="contained"
                    onClick={() => getGeoLocation()}
                    sx={{
                        minWidth: '50px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                            transform: 'scale(1.05)',
                        },
                        '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            opacity: 0.5,
                        }
                    }}
                >
                    <PositionSvg color={'#fff'}/>
                </Button>
            </div>
        </>
    )
}