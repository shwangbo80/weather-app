import {React, useState} from "react";
import {
    Container,
    Row,
    Col,
    Image,
    Form,
    Button,
    InputGroup,
    FormControl,
} from "react-bootstrap";
import axios from "axios";

export default function HomeComponent() {
    const [values, setValues] = useState({
        cityName: "",
    });
    const [fetching, setFetching] = useState(false);
    const [cityWeather, setCityWeather] = useState([]);
    const [cityWeatherLoaded, setCityWeatherLoaded] = useState(false);
    const [hourlyWeather, setHourlyWeather] = useState([]);
    const [hourlyWeatherLoaded, setHourlyWeatherLoaded] = useState(false);
    const [dailyWeather, setDailyWeather] = useState([]);
    const [dailyLoaded, setDailyLoaded] = useState(false);
    const [sunRiseTime, setSunriseTime] = useState();
    const [sunSetTime, setSunSetTime] = useState();
    const [validated, setValidated] = useState(false);
    const apiKey = "515fb9eb3863f83b7a54021b58d255ae";

    const handleCityNameInputChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            cityName: event.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
        fetchCitytWeather();
        fetchDailyWeather();
        fetchHourlyWeather();
    };

    const format_unix_timestamp = (unix_data) => {
        let unix_timestamp = unix_data;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        if (hours > 12) {
            hours = hours - 12;
        }
        var minutes = "0" + date.getMinutes();
        var formattedTime = hours + ":" + minutes.substr(-2);
        return formattedTime;
    };

    const format_unix_hour = (unix_data) => {
        let unix_timestamp = unix_data;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var ampm = hours >= 12 ? "pm" : "am";
        if (hours > 12) {
            hours = hours - 12;
        }
        var formattedTime = hours + ampm;
        return formattedTime;
    };

    const format_unix_date = (unix_data) => {
        let unix_timestamp = unix_data;
        var date = new Date(unix_timestamp * 1000).getDay();
        var weekdays = new Array(7);
        weekdays[0] = "Sunday".substring(0, 3);
        weekdays[1] = "Monday".substring(0, 3);
        weekdays[2] = "Tuesday".substring(0, 3);
        weekdays[3] = "Wednesday".substring(0, 3);
        weekdays[4] = "Thursday".substring(0, 3);
        weekdays[5] = "Friday".substring(0, 3);
        weekdays[6] = "Saturday".substring(0, 3);
        var dateName = weekdays[date];
        return dateName;
    };

    const RenderLoader = () => {
        return (
            <div className="loader-img text-center">
                <Image
                    className="loader-img"
                    src="https://i.pinimg.com/originals/8e/e2/12/8ee212dac057d412972e0c8cc164deee.gif"></Image>
            </div>
        );
    };

    const fetchCitytWeather = () => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${values.cityName}&appid=${apiKey}&units=imperial`
            )
            .then((response) => {
                setCityWeather(response.data);
                setCityWeatherLoaded(false);
                // setHourlyWeatherLoaded(false);
                // setDailyLoaded(false);
                setFetching(true);
                setSunriseTime(
                    format_unix_timestamp(response.data.sys.sunrise)
                );
                setSunSetTime(format_unix_timestamp(response.data.sys.sunset));
                const lat = response.data.coord.lat;
                const lon = response.data.coord.lon;
                setTimeout(() => {
                    fetchDailyWeather(lat, lon);
                    fetchHourlyWeather(lat, lon);
                    setCityWeatherLoaded(true);
                    setFetching(false);
                }, 3000);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const fetchHourlyWeather = (latparam, lonparam) => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latparam}&lon=${lonparam}&appid=${apiKey}&units=imperial`
            )
            .then((response) => {
                setHourlyWeatherLoaded(false);
                setHourlyWeather(response.data);
                setHourlyWeatherLoaded(true);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const fetchDailyWeather = (latparam, lonparam) => {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latparam}&lon=${lonparam}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
            )
            .then((response) => {
                setDailyLoaded(false);
                setDailyWeather(response.data);
                setDailyLoaded(true);
                console.log(response.data.daily);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    const RenderWeather = () => {
        if (fetching) {
            return <RenderLoader />;
        } else if (cityWeatherLoaded) {
            return (
                <div className="text-center">
                    <h1 className="text-center">
                        {cityWeather.name}, {cityWeather.sys.country}
                    </h1>
                    <Image
                        fluid
                        className="mx-auto d-block weather-icon"
                        src={`http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@4x.png`}
                        alt={`http://openweathermap.org/img/wn/${cityWeather.weather[0].description}`}
                    />
                    <h2 className="mb-5">{cityWeather.weather[0].main}</h2>
                    <h1 className="mb-5 display-1">{cityWeather.main.temp}</h1>
                    <h4>Feels Like: {cityWeather.main.feels_like} deg</h4>
                    <h4>Humidity: {cityWeather.main.humidity}%</h4>
                    <h4>Temperature: {cityWeather.main.temp}</h4>
                    <h4>Max: {cityWeather.main.temp_max}</h4>
                    <h4>Low: {cityWeather.main.temp_min}</h4>
                    <h4>Sunrise: {sunRiseTime}am</h4>
                    <h4>Sunset: {sunSetTime}pm</h4>
                </div>
            );
        } else {
            return <div></div>;
        }
    };

    const RenderHourlyHeader = () => {
        if (hourlyWeatherLoaded) {
            return (
                <div>
                    <hr></hr>
                    <h1 className=" mt-5 display-5 text-center">3 Hour</h1>
                </div>
            );
        } else {
            return <div></div>;
        }
    };

    const RenderHourly = () => {
        if (hourlyWeatherLoaded) {
            const data = hourlyWeather.list.slice(0, 12).map((item, key) => {
                return (
                    <Col xs={2} className="text-center" key={key}>
                        <Image
                            fluid
                            className="mx-auto d-block"
                            src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`}
                            alt={`http://openweathermap.org/img/wn/${item.weather[0].description}`}
                        />
                        <h6>{format_unix_hour(item.dt)}</h6>
                        <h6>{item.main.temp.toString().substring(0, 2)}</h6>
                    </Col>
                );
            });
            return data;
        } else {
            return <div></div>;
        }
    };

    const RenderDailyHeader = () => {
        if (dailyLoaded) {
            return (
                <div>
                    <hr></hr>
                    <h1 className=" mt-5 display-5 text-center">Daily</h1>
                </div>
            );
        } else {
            return <div></div>;
        }
    };

    const RenderDaily = () => {
        if (dailyLoaded) {
            const forcataData = dailyWeather.daily.slice(1).map((item, key) => {
                return (
                    <div className="d-flex align-items-center ps-4" key={key}>
                        <Col xs={3}>
                            <Image
                                fluid
                                className="mx-auto d-block forcast-icon"
                                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`}
                                alt={`http://openweathermap.org/img/wn/${item.weather[0].description}`}
                            />
                        </Col>
                        <Col xs={9} className="d-flex">
                            <h3 className="fw-bold">
                                {format_unix_date(item.dt)}
                            </h3>
                            <h5 className="ms-3">
                                High: {item.temp.max.toString().substring(0, 2)}
                            </h5>
                            <h5 className="ms-3">
                                Low: {item.temp.min.toString().substring(0, 2)}
                            </h5>
                        </Col>
                    </div>
                );
            });
            return forcataData;
        } else {
            return <div />;
        }
    };

    return (
        <div className="main-container">
            <Container fluid>
                <div className="text-center mb-5">
                    <Image
                        className="weather-logo"
                        src="https://cdn.iconscout.com/icon/free/png-256/cloudy-weather-11-1147979.png"
                    />
                </div>
                <Row className="form-container d-flex justify-content-center">
                    <Row>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    validated={validated}>
                                    <InputGroup
                                        hasValidation
                                        className="mb-3 input-group-lg"
                                        id="inputGroupPrepend">
                                        <FormControl
                                            className="form-field"
                                            type="text"
                                            placeholder="Enter city name"
                                            aria-describedby="inputGroupPrepend"
                                            required
                                            value={values.cityName}
                                            onChange={handleCityNameInputChange}
                                        />
                                        <Button
                                            variant="primary"
                                            id="button-addon2"
                                            type="submit">
                                            Button
                                        </Button>
                                        <Form.Control.Feedback type="invalid">
                                            Please choose city.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form>
                            </Form.Group>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Container className="mt-5">
                        <Row className="sub-container">
                            <Col md={4}></Col>
                            <Col md={4}>
                                <Row>
                                    <Col md={12} className="weather-container">
                                        <div className="mb-5">
                                            <RenderWeather />
                                        </div>
                                    </Col>
                                    <Col md={12} className="">
                                        <div>
                                            <RenderHourlyHeader />
                                            <Row className="mb-5">
                                                <RenderHourly />
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <RenderDailyHeader />
                                        <RenderDaily />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={4}></Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </div>
    );
}
