const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const game = res.body[0];
        expect(game).to.include.all.keys('App', 'Genres', 'Rating');
      });
  });

  it('should return 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Price' })
      .expect(400, 'Sort must be of genre or app title.');
  });

  it('should sort by "App" title', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const gameAtI = res.body[i];
          const gameAtIPlus1 = res.body[i + 1];
          if (gameAtIPlus1.App < gameAtI.title) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});
