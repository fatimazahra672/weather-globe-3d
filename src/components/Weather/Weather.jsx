import styles from './Weather.module.scss'
import {Card} from "react-bootstrap";
import {useSelector} from "react-redux";
import Moment from "react-moment";
import Sunny from "../Svgs/Sunny";
import Cloudy from "../Svgs/Cloudy";
import Thunder from "../Svgs/Thunder";
import Rainy from "../Svgs/Rainy";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSun,
    faWind,
    faGauge,
    faDroplet,
    faTemperatureHigh,
    faLocationDot,
    faClock
} from '@fortawesome/free-solid-svg-icons';

export const Weather = () => {
    const weather = useSelector(({weather}) => weather)

    const getGreeting = () => {
        if (!weather.timezone) {
            return "Hello";
        }

        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utcTime + (weather.timezone * 1000));
        const hour = cityTime.getHours();

        console.log('🕐 Heure locale de la ville:', cityTime.toLocaleString(), 'Heure:', hour);

        if (hour >= 5 && hour < 12) {
            return "Good Morning";
        } else if (hour >= 12 && hour < 18) {
            return "Good Afternoon";
        } else if (hour >= 18 && hour < 22) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    };

    const displayIcon = () => {
        const defaultWidth = '120px';
        const defaultHeight = '120px';
        const number = weather.weather.icon.substring(0, 2)
        switch (number) {
            case '01':
                return <Sunny width={defaultWidth} height={defaultHeight}/>
            case '03':
            case '04':
                return <Cloudy width={defaultWidth} height={defaultHeight}/>
            case '10':
                return <Rainy width={defaultWidth} height={defaultHeight}/>
            case '11':
                return <Thunder width={defaultWidth} height={defaultHeight}/>
            default:
                return <img src={`https://openweathermap.org/img/wn/${weather.weather.icon}@2x.png`} alt="" style={{width: '120px', height: '120px'}}/>
        }
    }
    return (
        <>
            <Card className={styles.container}>
                {weather.isLoaded ?
                    <Card.Body>
                        <Card.Title>
                            {weather.name} , {weather.sys.country} <FontAwesomeIcon icon={faLocationDot} style={{color: 'rgba(255,255,255,0.7)'}} />
                            <div className={styles.date}>
                                <div>
                                    {/* Afficher l'heure de la ville en utilisant le timezone */}
                                    <Moment format={'llll'} add={{ seconds: weather.timezone }} utc /></div>
                                <div><FontAwesomeIcon icon={faClock} style={{width: '15px', height: '15px'}} /></div>
                            </div>
                        </Card.Title>
                        <Card.Text as={'div'} className={styles.weather_infos}>
                            <div>
                                {displayIcon()}
                            </div>
                            <div className={styles.temperature}>
                                <div>{weather.main.feels_like} C</div>
                                <div>
                                    <FontAwesomeIcon icon={faTemperatureHigh} style={{fontSize: '3rem', color: '#fff'}} />
                                </div>
                            </div>
                            <div>
                                {getGreeting()} {weather.name}
                                <div className={styles.separator}></div>
                            </div>
                            <div className={styles.infos}>
                                <div className={styles.border_right}>
                                    <div>
                                        <FontAwesomeIcon icon={faSun} style={{fontSize: '25px', color: '#fff'}} />
                                    </div>
                                    <div>Sunrise</div>
                                    <div>
                                        {/* Afficher le lever du soleil dans le fuseau horaire de la ville */}
                                        <Moment unix={true} format={'hh:mm'} add={{ seconds: weather.timezone }} utc>
                                            {weather.sys.sunrise}
                                        </Moment>
                                    </div>
                                </div>
                                <div className={styles.border_right}>
                                    <div><FontAwesomeIcon icon={faWind} style={{fontSize: '25px', color: '#fff'}} /></div>
                                    <div>Wind</div>
                                    <div>{weather.wind.speed} m/s</div>
                                </div>
                                <div className={styles.border_right}>
                                    <div><FontAwesomeIcon icon={faGauge} style={{fontSize: '25px', color: '#fff'}} /></div>
                                    <div>Pressure</div>
                                    <div>{weather.main.pressure} Pa</div>
                                </div>
                                <div className={styles.border_right}>
                                    <div><FontAwesomeIcon icon={faDroplet} style={{fontSize: '25px', color: '#fff'}} /></div>
                                    <div>Humidity</div>
                                    <div>{weather.main.humidity}%</div>
                                </div>
                                <div>
                                    <div><FontAwesomeIcon icon={faTemperatureHigh} style={{fontSize: '25px', color: '#fff'}} /></div>
                                    <div>Temp</div>
                                    <div>{weather.main.temp_max} C</div>
                                </div>
                            </div>

                        </Card.Text>
                    </Card.Body> :
                    <Card.Body>
                        <Card.Title>Please choose your city.</Card.Title>
                    </Card.Body>
                }
            </Card>
        </>
    )
}