const environment = process.env.NODE_ENV || 'development';
const express = require('express');
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');
const config = require('dotenv').config().parsed;

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

app.get('/', (request, response) => {
  response.sendFile('index.html');
  response.sendFile('/styles/main.css');
  response.sendFile('/lib/index.js');
});

app.get('/api/v1/inventory', (request, response) => {
  database('inventory').select()
    .then((inventory) => {
      if (inventory.length) {
        response.status(200).json(inventory);
      } else {
        response.status(404).json({
          error: 'No inventory found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/orders', (request, response) => {
  database('orders').select()
    .then((orders) => {
      if (orders.length) {
        response.status(200).json(orders);
      } else {
        response.status(404).json({
          error: 'No orders found'
        });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.post('/api/v1/orders/:price', (request, response) => {
  const order = {price: request.params.price}
  console.log(order, 'order');
  database('orders').insert(order, 'id')
  .then((order_id) => {
    response.status(201).json({ id: order_id[0] });
  })
  .catch((error) => {
    console.log(error, 'error')
    response.status(500).json({ error });
  });
})


app.listen(port, () => {
  console.log(`AmazonBay server listening on port ${port}!`);
});

module.exports = app;
