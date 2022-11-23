const express = require('express');

module.exports = function(app) {
    app.use('/bin', express.static('../python/dist'))
};