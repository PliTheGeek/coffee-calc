const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// POST /calc
// body: { type: 'coffee' | 'water', value: number, ratio?: number }
// ratio default: 16 (coffee : water)
app.post('/calc', (req, res) => {
  const { type, value, ratio } = req.body || {};
  const r = Number(ratio) || 16;
  const v = Number(value) || 0;

  if (!type || isNaN(v)) {
    return res.status(400).json({ error: 'Invalid input. Provide type and numeric value.' });
  }

  let coffeeGrams = 0;
  let waterGrams = 0;

  if (type === 'coffee') {
    coffeeGrams = v;
    waterGrams = coffeeGrams * r;
  } else if (type === 'water') {
    waterGrams = v;
    coffeeGrams = waterGrams / r;
  } else {
    return res.status(400).json({ error: "type must be 'coffee' or 'water'" });
  }

  // Round to 2 decimals
  const round = (n) => Math.round(n * 100) / 100;

  res.json({ coffee: round(coffeeGrams), water: round(waterGrams), ratio: r });
});

// Support GET /calc for quick browser testing using query params
// Example: /calc?type=coffee&value=15&ratio=16
app.get('/calc', (req, res) => {
  const { type, value, ratio } = req.query || {};
  const r = Number(ratio) || 16;
  const v = Number(value) || 0;

  if (!type || isNaN(v)) {
    return res.status(400).json({ error: 'Invalid input. Provide type and numeric value as query params.' });
  }

  let coffeeGrams = 0;
  let waterGrams = 0;

  if (type === 'coffee') {
    coffeeGrams = v;
    waterGrams = coffeeGrams * r;
  } else if (type === 'water') {
    waterGrams = v;
    coffeeGrams = waterGrams / r;
  } else {
    return res.status(400).json({ error: "type must be 'coffee' or 'water'" });
  }

  const round = (n) => Math.round(n * 100) / 100;

  res.json({ coffee: round(coffeeGrams), water: round(waterGrams), ratio: r });
});

app.get('/', (req, res) => res.send('Coffee Calculator API (POST /calc)'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Coffee API listening on port ${port}`));
