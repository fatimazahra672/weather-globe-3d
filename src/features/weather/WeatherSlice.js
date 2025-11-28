import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    clouds: undefined,
    main: {
        feels_like: undefined
    },
    name: undefined,
    sys: {
        country: undefined
    },
    weather: undefined,
    wind: {
        speed: undefined
    },
    timezone: undefined,
    isLoaded: false,
    showGlobe: true,
    isZooming: false,
    targetLocation: null,
}

export const WeatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setData: (state, action) => {
            const {clouds, main, name, sys, weather, wind, lat, lon, timezone} = action.payload
            state.clouds = clouds
            state.main = main
            state.name = name
            state.sys = sys
            state.weather = weather[0]
            state.wind = wind
            state.timezone = timezone
            state.isLoaded = true
            state.targetLocation = { lat, lon }
            state.isZooming = true
        },
        setDataWithoutMarker: (state, action) => {
            const {clouds, main, name, sys, weather, wind, timezone} = action.payload
            state.clouds = clouds
            state.main = main
            state.name = name
            state.sys = sys
            state.weather = weather[0]
            state.wind = wind
            state.timezone = timezone
            state.isLoaded = true
        },
        resetData: (state) => {
            state.isLoaded = false
            state.showGlobe = true
            state.isZooming = false
            state.targetLocation = null
        },
        zoomComplete: (state) => {
            state.isZooming = false
        },
        toggleGlobe: (state) => {
            state.showGlobe = !state.showGlobe
        }
    }
})

export const {setData, setDataWithoutMarker, resetData, zoomComplete, toggleGlobe} = WeatherSlice.actions
export default WeatherSlice.reducer