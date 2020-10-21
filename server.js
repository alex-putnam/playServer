const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const apps = require('./playstore.js');

app.get('/app', (req, res) => {
  const { sort, genres = '' } = req.query;

  if (genres) {
    if (
      !['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(
        genres
      )
    ) {
      return res
        .status(400)
        .send(
          'Genres must be Action, Puzzle, Strategy, Casual, Arcade, or Card'
        );
    }
  }

  if (sort) {
    if (!['rating', 'app'].includes(sort)) {
      return res.status(400).send('Sort must be rating or app');
    }
  }

  let results = apps.filter((app) =>
    app.Genres.toLowerCase().includes(genres.toLowerCase())
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});
