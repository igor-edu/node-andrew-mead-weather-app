const request = require('request');

const forecast = (lat, lon, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=216298a5cfdfab856de78d07fd44f990&query=${lat},${lon}&units=f`;

  request({ url, json: true }, (error, response) => {
    const body = response.body;

    if (error) {
      callback('unable to connect to weather service');
    } else if (body.error) {
      callback('unable to find location, pls try another search');
    } else {
      const data = body.current;
      callback(undefined, `${data.weather_descriptions[0]}. It is currently ${data.temperature} degrees out. It feels like ${data.feelslike} degrees out.
       The following is an added information: wind speed is ${data.wind_speed}km/h and humidity is ${data.humidity}%.`);
    }
  });
};

module.exports = forecast;