var express = require('express');
var app = express();
const session = require('express-session');
var bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));


require('./app/route/shop.route.js')(app);

// Create a Server
var server = app.listen(8000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
})