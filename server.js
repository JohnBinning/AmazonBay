const environment = process.env.NODE_ENV || 'development';
const express = require('express');
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');
const config = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

const port = (process.env.PORT || 3000);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});

app.set('secretKey', process.env.CLIENT_SECRET);


app.get('/', (request, response) => {
  response.sendFile('index.html');
  response.sendFile('/styles/main.css');
  response.sendFile('/lib/index.js');
});

app.post('/login', (request, response) => {
  const user = request.body;

  if (user.username !== process.env.USERNAME || user.password !== process.env.PASSWORD) {
    response.status(403).send({
      success: false,
      message: 'Invalid Credentials'
    });
  } else {
    const token = jwt.sign(user, app.get('secretKey'), {
      expiresIn: 1209600
    });

    response.json({
      success: true,
      username: user.username,
      token
    });
  }
});

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.param('token') ||
                request.headers.authorization;

  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'Invalid authorization token.'
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
};


app.listen(port, () => {
  console.log(`AmazonBay server listening on port ${port}!`);
});

module.exports = app;
