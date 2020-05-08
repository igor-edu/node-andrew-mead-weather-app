const request = require("request");

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?limit=1&access_token=pk.eyJ1IjoiaWdvcmNvbCIsImEiOiJjazlzY3E0Y3kxMnlwM2hwbmpvc25raHBoIn0.C07xU-VzZpdFzHJCro2Qng`;

  request({ url: url, json: true }, (error, response) => {
    const features = response.body.features;

    if (error) {
      callback('unable to connect to location services', undefined);
    } else if (features.length === 0) {
      callback('unable to find location try another search', undefined);
    } else {
      callback(undefined, {
        lat: features[0].center[1],
        lon: features[0].center[0],
        location: features[0].place_name
      })
    }
  })
};

module.exports = geocode;

