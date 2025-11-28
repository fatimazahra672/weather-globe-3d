import './App.module.scss';
import React from 'react';
import {SearchBar} from "./components/SearchBar/SearchBar";
import {Wallpaper} from "./components/Wallpaper/Wallpaper";
import {Weather} from "./components/Weather/Weather";
import {Globe3D} from "./components/Globe3D/Globe3D";
import {CityInfo} from "./components/CityInfo/CityInfo";
import {SoundManager} from "./components/SoundManager/SoundManager";
import {Provider, useSelector, useDispatch} from "react-redux";
import {store} from "./app/store";
import {motion} from "framer-motion";
import {zoomComplete, resetData} from "./features/weather/WeatherSlice";

function AppContent() {
    const dispatch = useDispatch();
    const { showGlobe, isZooming, targetLocation, isLoaded } = useSelector(({weather}) => weather);

    const handleZoomComplete = () => {
        dispatch(zoomComplete());
    };

    const handleBackgroundClick = () => {
        console.log('🚫 Clic sur le fond - Fermeture de l\'affichage météo');
        dispatch(resetData());
    };

    const isCitySelected = isLoaded;

    return (
        <div className="App">
            <Globe3D
                show={showGlobe}
                isZooming={isZooming}
                targetLocation={targetLocation}
                onZoomComplete={handleZoomComplete}
            />

            <Wallpaper/>

            <SoundManager/>

            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    height: '100vh',
                    pointerEvents: 'none'
                }}
            >
                <div style={{ pointerEvents: 'auto' }}>
                    <SearchBar/>
                </div>

                {isCitySelected && (
                    <>
                        <div
                            onClick={handleBackgroundClick}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                zIndex: 1,
                                pointerEvents: 'auto',
                                cursor: 'pointer'
                            }}
                        />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '2rem',
                            height: 'calc(100vh - 150px)',
                            alignItems: 'flex-start',
                            pointerEvents: 'none',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <div style={{ pointerEvents: 'auto' }}>
                                <CityInfo />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                style={{
                                    width: '380px',
                                    marginRight: '2rem',
                                    pointerEvents: 'auto'
                                }}
                            >
                                <Weather/>
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;