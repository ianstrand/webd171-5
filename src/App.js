import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import 'moment-timezone';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoaded: false,
      errorMessage: ''
    };
  }

  getWeatherData = () => {
    const API = 'https://mm214.com/demo.php/';

    fetch(API)
      .then(res => res.json())
      .then(
        (result) => {

            console.log(result);

            const { lon, lat } = result.coord;
            const { main, description, icon } = result.weather[0];
            const { temp, temp_min, temp_max, feels_like, humidity } = result.main;
            const { speed, deg } = result.wind;
            const { country, sunrise, sunset } = result.sys;
            const { name } = result;

            var geoTz = require('geo-tz');
            var timezone = JSON.stringify(geoTz(lat, lon));

            var moment = require('moment-timezone');
            moment.tz.setDefault(timezone);

            const date = moment().format('MMMM Do, YYYY');
            const time = moment().format('h:mm a');

            const WindDirection = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            const degreesDirection = (degrees) => {
              const value = Math.floor((degrees / 22.5) + 0.5);
              return WindDirection[value % 16];
            };

          this.setState({
            isLoaded: true,
            data: {
              name,
              country,
              sunrise: moment.unix(sunrise).format('h:mm a'),
              sunset: moment.unix(sunset).format('h:mm a'),
              speed: (speed / 1.609344).toFixed(0),
              deg,
              temp: (((temp - 273.15) * 1.8) + 32).toFixed(1),
              temp_min: (((temp_min - 273.15) * 1.8) + 32).toFixed(1),
              temp_max: (((temp_max - 273.15) * 1.8) + 32).toFixed(1),
              feels_like: (((feels_like - 273.15) * 1.8) + 32).toFixed(0),
              humidity,
              main,
              description,
              icon: 'https://openweathermap.org/img/wn/' + icon + '@2x.png',
              lon,
              lat,
              timezone,
              date,
              time,
              degreesDirection,
            }
          });

        },
        (error) => {
          this.setState({
            isLoaded: true,
            errorMessage: error.message
          });
        }
      );
  }

  componentDidMount() {
    this.getWeatherData();
  }

  render() {
    const { errorMessage, isLoaded, data } = this.state;

    if (errorMessage) {
      return (
        <div className='weatherApp'>
        <Helmet>
          <html lang='en' />
          <title>Weather Data App</title>
          <meta name='description' content='View the weather!'/>
        </Helmet>
        <Container className = 'p-5'>
          <Row>
            <Col className = 'pt-4'>
              <h1 className = 'error' > Error: { errorMessage } </h1>
            </Col>
          </Row>
        </Container>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div className='weatherApp'>
        <Helmet>
          <html lang='en' />
          <title>Weather Data App</title>
          <meta name='description' content='View the weather!'/>
        </Helmet>
        <Container className = 'p-5'>
          <Row>
            <Col className = 'pt-4'>
              <h1> Loading... </h1>
            </Col>
          </Row>
        </Container>
        </div>
      );
    } else {

       const { name, country, sunrise, sunset, speed, deg, temp, temp_min, temp_max, feels_like, humidity, main, description, icon, lon, lat, timezone, date, time, degreesDirection } = data;

       return (
          <div className='weatherApp'>
            <Helmet>
              <html lang='en' />
              <title>Weather Data App</title>
              <meta name='description' content='View the weather!' />
            </Helmet>
            <Row className = 'py-4'>
              <Col>
                <header>
                  <Container>
                    <h1>View the weather!</h1>
                  </Container>
                </header>
              </Col>
            </Row>
            <main>
              <Container className = 'weather-main pt-4 pb-5'>
                <Row className = 'd-flex justify-content-md-center'>
                  <Col md={4} className='pb-5'>
                    <div className = 'weather-date'>
                      <h3 className = 'h2 pb-4'>{ time }</h3>
                      <p>{ date }</p>
                      <p>Sunrise: { sunrise } <br /> Sunset: { sunset }</p>
                    </div>
                    <div className = 'weather-coord'>
                      <p>Coordinates: <br /> { lat }, { lon }</p>
                    </div>
                  </Col>
                  <Col md={4} className='pb-5'>
                    <h3 className = 'h2'>{ name }, { country }</h3>
                    <img src = { icon } alt = 'weather icon { description }' className = 'weather-icon' />
                    <h2 className = 'description'> { description } </h2>
                  </Col>
                  <Col md={4}>
                    <div className = 'temp-main'>
                      <h3 className = 'h2 temperature pb-4'> { temp }°F </h3>
                      <p> Feels like { feels_like }°F </p>
                      <p>H { temp_max }°F <br /> L { temp_min }°F</p>
                    </div>
                    <div className = 'weather-prop'>
                      <p> Wind: { degreesDirection(deg) }, { speed } mph
                      <br /> Humidity: { humidity }% </p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </main>
            <footer>
              <Container className = 'mt-3'>
                <Row>
                  <Col>
                    <p>You are viewing the weather in the following time zone: < /p>
                    <p>{ timezone }.< /p>
                  </Col>
                </Row>
              </Container>
            </footer>
          </div>
        );
    }
  }
}

export default App;