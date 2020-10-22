const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const appThing = res.body[0];
        expect(appThing).to.include.all.keys(
          'Android Ver',
          'App',
          'Category',
          'Content Rating',
          'Current Ver',
          'Genres',
          'Installs',
          'Last Updated',
          'Price',
          'Rating',
          'Reviews',
          'Size',
          'Type'
        );
      });
  });

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be Rating or App');
  });

  it('should be 400 if genre is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'MISTAKE' })
      .expect(
        400,
        'Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card'
      );
  });

  it('should sort by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const bookAtIPlus1 = res.body[i + 1];

          if (bookAtIPlus1.title < bookAtIPlus1.title) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});
