const express = require('express');
const morgan = require('morgan');

const playApps = require('./playstore.js');

const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like

app.get('/apps', (req, res) => {
  const { search = '', sort, genre = '' } = req.query;

  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be Rating or App');
    }
  }

  if (genre) {
    if (
      !['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(
        genre
      )
    ) {
      return res
        .status(400)
        .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  let results = playApps.filter(
    (playApp) =>
      playApp.App.toLowerCase().includes(search.toLowerCase()) &&
      playApp.Genres.toLowerCase().includes(genre.toLowerCase())
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(results);
});

module.exports = app;
