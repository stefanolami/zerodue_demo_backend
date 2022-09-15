'use strict'

const express = require('express');
const cors = require('cors');
const http = require("http");
const routes = require('./routes');
const db = require('./database').db;

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to ZeroDue REST API!',
    });
});

app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({
      message: 'Route Not Found',
    });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

setInterval(function() {
  http.get("https://zerodue-demo-backend.herokuapp.com/");
}, 300000); // every 5 minutes (300000)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(`the application is running on port ${PORT} at ${time}`)
});