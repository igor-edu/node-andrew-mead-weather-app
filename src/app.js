const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// express is just a function that we call and returns an object whose methods we will use
const app = express();

// setup a path to the public directory that will be served from the root route request as a static files directory
const publicDirectoryPath = path.join(__dirname, '../public');
// first lookup in the public folder for a match
app.use(express.static(publicDirectoryPath));

// setup a path for the templating engine folder
const viewsPath = path.join(__dirname, '../templates/views');
app.set('views', viewsPath);

// setup partials folder
const partialsPath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialsPath);

// setup a templating engine
app.set('view engine', 'hbs');

app.get('', (req, res) => {
  res.render('index', {
    title: 'Main Page: Weather',
    name: 'Andrew Mead'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About page from the rendering hbs file and title variable',
    name: 'Andrew Mead'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'This is a help title from the rendering engine',
    helpText: 'This is the value of the help variable',
    name: 'Andrew Mead'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    res.send({ error: 'The address must be provided' });
    return;
  }

  const address = req.query.address;

  geocode(address, (error, { lat, lon, location } = {}) => {
    if (error) {
      return res.send({ error: error });
    }

    forecast(lat, lon, (error, forecastData) => {
      if (error) {
        return res.send({ error: error });
      }

      res.send({
        forecast: forecastData,
        location: location,
        address: req.query.address
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    res.send({
      error: 'You must provide a search term'
    });
    return;
  }
  console.log(req.query);
  res.send({
    products: []
  })
});

app.get('/help/*', (req, res) => {
  // res.send('Help article not found');
  res.render('errorPage', {
    error: 'Help article not found',
    name: 'Andrew Mead',
    title: 'Help Article'
  })
});

app.get('*', (req, res) => {
  // res.send('My 404 page');
  res.render('errorPage', {
    error: 'Page not found',
    name: 'Andrew Mead',
    title: 'Non Existant Page'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000...');
});