exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('inventory', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.string('image_url');
      table.integer('price');
      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('inventory'),
  ]);
};