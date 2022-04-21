import { React, useState } from "react";
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function HomeComponent() {
    const [values, setValues] = useState({
        cityName: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [weatherLoaded, setWeatherLoaded] = useState(false);
    const [forcastData, setForcastData] = useState([]);
    const [cityWeather, setCityWeather] = useState([]);
    const [sunRiseTime, setSunriseTime] = useState();
    const [sunSetTime, setSunSetTime] = useState();

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
        fetchForcast();
        fetchCurrentWeather();
        console.log(cityWeather, forcastData);
    };

    const fetchCurrentWeather = () => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${values.cityName}&appid=515fb9eb3863f83b7a54021b58d255ae&units=imperial`
            )
            .then((response) => {
                setCityWeather(response.data);
                setWeatherLoaded(true);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const fetchForcast = () => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${values.cityName}&appid=515fb9eb3863f83b7a54021b58d255ae&units=imperial`
            )
            .then((response) => {
                setForcastData(response.data);
                setSunriseTime(
                    new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }).format(response.data.city.sunrise)
                );
                setSunSetTime(
                    new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(response.data.city.sunset)
                );
                setLoaded(true);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const RenderData = () => {
        if (loaded && weatherLoaded) {
            return (
                <div>
                    <h1 className="text-center mt-5">{cityWeather.name}</h1>
                    <Image
                        fluid
                        className="mx-auto d-block weather-icon"
                        src={`http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@4x.png`}
                        alt={`http://openweathermap.org/img/wn/${cityWeather.weather[0].description}`}
                    />
                    <h2 className="text-center mb-5">
                        {cityWeather.weather[0].main}
                    </h2>
                    <h4>Feels Like: {cityWeather.main.feels_like} deg F</h4>
                    <h4>Humidity: {cityWeather.main.humidity}%</h4>
                    <h4>Pressure: {cityWeather.main.pressure}</h4>
                    <h4>Temperature: {cityWeather.main.temp}</h4>
                    <h4>Max: {cityWeather.main.temp_max}</h4>
                    <h4>Low: {cityWeather.main.temp_min}</h4>
                    <h4>Visibility: {cityWeather.visibility}</h4>
                    <h4>Sunrise: {sunRiseTime}</h4>
                    <h4>Sunset: {sunSetTime}</h4>
                    <h4>5 day Forcast</h4>
                    <Row>
                        <Col xs={2}>1</Col>
                        <Col xs={2}>2</Col>
                        <Col xs={2}>3</Col>
                        <Col xs={2}>4</Col>
                        <Col xs={2}>5</Col>
                    </Row>
                </div>
            );
        } else {
            return <div></div>;
        }
    };

    return (
        <div className="main-container">
            <Container fluid>
                <h1 className="text-center mb-3">Weather</h1>
                <Form>
                    <Row className="form-container">
                        <Col xs={9}>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                            >
                                <Form.Control
                                    className="form-field"
                                    type="text"
                                    placeholder="Enter city name"
                                    value={values.cityName}
                                    onChange={handleCityNameInputChange}
                                />
                                {submitted && !values.cityName && (
                                    <Form.Text id="city-name-error">
                                        Please enter a city name
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>
                        <Col xs={3}>
                            <Button
                                className="submit-button"
                                variant="success"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <RenderData />
            </Container>
        </div>
    );
}
