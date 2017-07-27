const inventory = require('../../data/inventoryData.js');

const createItem = (knex, item) => {
  return knex('inventory').insert({
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    price: item.price,
  }, 'id');
};

exports.seed = (knex, Promise) => {
  return knex('inventory').del()
    .then(() => {
      const inventoryPromises = [];
      inventory.forEach((item) => {
        inventoryPromises.push(createItem(knex, item));
      });

      return Promise.all(inventoryPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};