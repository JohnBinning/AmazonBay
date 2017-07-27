const orders = require('../../data/ordersData.js');

const createOrder = (knex, order) => {
  return knex('orders').insert({
    id: order.id,
    price: order.price,

  }, 'id');
};

exports.seed = (knex, Promise) => {
  return knex('orders').del()
    .then(() => {
      const ordersPromises = [];
      orders.forEach((order) => {
        ordersPromises.push(createOrder(knex, order));
      });

      return Promise.all(ordersPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};