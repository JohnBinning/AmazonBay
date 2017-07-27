exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.integer('price');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('orders'),
  ]);
};