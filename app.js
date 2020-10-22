const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const games = require('./playstore.js');

app.get('/apps', (req, res) => {
  const { search = '', sort, genres } = req.query;

  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be of genre or app title.');
    }
  }

  if (genres) {
    if (
      !['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  let results = games.filter((game) =>
    game.App.toLowerCase().includes(search.toLowerCase())
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  if (genres) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  if (genres) {
    results = results.filter((game) => game.Genres.includes(genres));
  }

  res.json(results);
});

module.exports = app;
