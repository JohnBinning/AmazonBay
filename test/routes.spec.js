process.env.NODE_ENV = 'test';

const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const app = express();
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);


describe('top level befores', () => {

  before(done => {
    database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done();
        });
    });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => {
        done();
      });
  });

  describe('sad path', () => {

    it('/api/v1/sadthings should not work', (done) => {
      chai.request(server)
      .get('/api/v1/sadthings')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('home route', () => {
    it('should send the homepage', (done) => {
      chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.be.html;
        response.should.have.status(200);
        done();
      });
    });
  });

  describe('inventory routes', () => {

    it('should get the inventory', (done) => {
      chai.request(server)
      .get('/api/v1/inventory')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(3);
        done();
      });
    });
  });

  describe('orders routes', () => {

    it('should get the orders', (done) => {
      chai.request(server)
      .get('/api/v1/orders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.be.a('object');
        response.body.length.should.equal(2);
        done();
      });
    });

    it('should post an order', (done) => {
      const price = 1701
      chai.request(server)
      .post(`/api/v1/orders/${price}`)
      .send()
      .end((err, response) => {
        response.should.have.status(201);
        done();
      });
    });

    it('should post an empty order', (done) => {
      const price = null;
      chai.request(server)
      .post(`/api/v1/orders/${price}`)
      .send()
      .end((err, response) => {
        response.should.have.status(500);
        done();
      });
    });
  });

});