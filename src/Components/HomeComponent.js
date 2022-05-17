import { React, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Image,
    Form,
    Button,
    InputGroup,
    FormControl,
} from 'react-bootstrap';
import axios from 'axios';

export default function HomeComponent() {
    const [values, setValues] = useState({
        cityName: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [cityWeather, setCityWeather] = useState([]);
    const [cityWeatherLoaded, setCityWeatherLoaded] = useState(false);
    const [sevenDayWeather, setSevenDayWeather] = useState([]);
    const [sunRiseTime, setSunriseTime] = useState();
    const [sunSetTime, setSunSetTime] = useState();
    const [lat, setLat] = useState();
    const [lon, setLon] = useState();
    const apiKey = '515fb9eb3863f83b7a54021b58d255ae';

    const [valid, setValid] = useState(false);

    const handleCityNameInputChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            cityName: event.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        fetchCitytWeather();
    };

    const fetchCitytWeather = () => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${values.cityName}&appid=${apiKey}&units=imperial`
            )
            .then((response) => {
                setCityWeather(response.data);
                const format_unix_timestamp = (unix_data) => {
                    let unix_timestamp = unix_data;
                    var date = new Date(unix_timestamp * 1000);
                    var hours = date.getHours();
                    if (hours > 12) {
                        hours = hours - 12;
                    }
                    var minutes = '0' + date.getMinutes();
                    var seconds = '0' + date.getSeconds();
                    var formattedTime =
                        hours +
                        ':' +
                        minutes.substr(-2) +
                        ':' +
                        seconds.substr(-2);
                    return formattedTime;
                };
                setSunriseTime(
                    format_unix_timestamp(response.data.sys.sunrise)
                );
                setSunSetTime(format_unix_timestamp(response.data.sys.sunset));
                console.log(response.data);
                fetchSevenDay(response.data.coord.lat, response.data.coord.lon);
                setCityWeatherLoaded(true);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const fetchSevenDay = (latparam, lonparam) => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latparam}&lon=${lonparam}&exclude=minutely,hourly&appid=${apiKey}`
            )
            .then((response) => {
                setSevenDayWeather(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const RenderData = () => {
        if (cityWeatherLoaded) {
            return (
                <div>
                    <h1 className='text-center mt-5'>
                        {cityWeather.name}, {cityWeather.sys.country}
                    </h1>
                    <Image
                        fluid
                        className='mx-auto d-block weather-icon'
                        src={`http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@4x.png`}
                        alt={`http://openweathermap.org/img/wn/${cityWeather.weather[0].description}`}
                    />
                    <h2 className='text-center mb-5'>
                        {cityWeather.weather[0].main}
                    </h2>
                    <h4>Feels Like: {cityWeather.main.feels_like} deg F</h4>
                    <h4>Humidity: {cityWeather.main.humidity}%</h4>
                    <h4>Pressure: {cityWeather.main.pressure}</h4>
                    <h4>Temperature: {cityWeather.main.temp}</h4>
                    <h4>Max: {cityWeather.main.temp_max}</h4>
                    <h4>Low: {cityWeather.main.temp_min}</h4>
                    <h4>Visibility: {cityWeather.visibility}</h4>
                    <h4>Sunrise: {sunRiseTime}am</h4>
                    <h4>Sunset: {sunSetTime}pm</h4>
                    <h4>5 day Forcast</h4>
                    <Row>
                        <Col xs={2}>
                            <p>{sevenDayWeather.current.clouds}</p>
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return <div></div>;
        }
    };

    return (
        <div className='main-container'>
            <Container fluid>
                <h1 className='text-center mb-3'>Weather</h1>
                <Row className='form-container'>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className='mb-3'>
                                <FormControl
                                    className='form-field'
                                    type='text'
                                    placeholder='Enter city name'
                                    value={values.cityName}
                                    onChange={handleCityNameInputChange}
                                />
                                <Button
                                    variant='success'
                                    id='button-addon2'
                                    type='submit'
                                >
                                    Button
                                </Button>
                            </InputGroup>
                        </Form>
                        <RenderData />
                    </Col>
                    <Col xs={2} />
                </Row>
            </Container>
        </div>
    );
}
