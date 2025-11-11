const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// POST /calc
// body: { type: 'coffee' | 'water', value: number, ratio?: number }
// ratio default: 16 (coffee : water)
function computeCoffeeWater(type, value, ratio) {
  const r = Number(ratio) || 16;
  const v = Number(value) || 0;

  if (!type || isNaN(v)) {
    throw new Error('Invalid input. Provide type and numeric value.');
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
    throw new Error("type must be 'coffee' or 'water'");
  }

  // Round to 2 decimals
  const round = (n) => Math.round(n * 100) / 100;

  return { coffee: round(coffeeGrams), water: round(waterGrams), ratio: r };
}

function makeRecipe(coffee, totalWater, options = {}) {
  // options: pours (total steps including bloom), bloomRatio (water relative to coffee), bloomTime (seconds)
  const pours = Number(options.pours) || 3; // default 3 (bloom + 2 pours)
  const bloomRatio = Number(options.bloomRatio) || 2; // bloom water = coffee * 2
  const bloomTime = Number(options.bloomTime) || 30; // seconds
  const pourInterval = Number(options.pourInterval) || 30; // seconds between pours

  const bloomWater = Math.round((coffee * bloomRatio) * 100) / 100;
  const remainingWater = Math.max(0, totalWater - bloomWater);

  // remaining pours after bloom
  const remainingPours = Math.max(1, pours - 1);
  const perPour = Math.round((remainingWater / remainingPours) * 100) / 100;

  const recipe = [];
  // Bloom step
  recipe.push({
    step: 0,
    name: 'Bloom',
    water: bloomWater,
    cumulative: Math.round(bloomWater * 100) / 100,
    timeSec: bloomTime,
    startSec: 0,
    note: `Bloom: pour ${bloomWater} g and wait ${bloomTime} sec`
  });

  let cumulative = bloomWater;
  for (let i = 1; i <= remainingPours; i++) {
    const pourWater = (i === remainingPours) ? Math.round((remainingWater - perPour * (remainingPours - 1)) * 100) / 100 : perPour;
    cumulative = Math.round((cumulative + pourWater) * 100) / 100;
    // start time for pour i: immediately after bloom for i=1, then +pourInterval for each subsequent pour
    const startSec = Math.round((bloomTime + (i - 1) * pourInterval) * 100) / 100;
    recipe.push({
      step: i,
      name: `Pour ${i}`,
      water: pourWater,
      cumulative,
      timeSec: pourInterval,
      startSec,
      note: `Pour ${pourWater} g (starts at ${startSec}s), interval ${pourInterval}s`,
    });
  }

  return recipe;
}

app.post('/calc', (req, res) => {
  try {
    const { type, value, ratio, pours, bloomRatio, bloomTime } = req.body || {};
    const base = computeCoffeeWater(type, value, ratio);

    const recipe = makeRecipe(base.coffee, base.water, { pours, bloomRatio, bloomTime });

    res.json({ ...base, recipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Support GET /calc for quick browser testing using query params
// Example: /calc?type=coffee&value=15&ratio=16
app.get('/calc', (req, res) => {
  try {
    const { type, value, ratio, pours, bloomRatio, bloomTime } = req.query || {};
    const base = computeCoffeeWater(type, value, ratio);
    const recipe = makeRecipe(base.coffee, base.water, { pours, bloomRatio, bloomTime });
    res.json({ ...base, recipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('Coffee Calculator API (POST /calc)'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Coffee API listening on port ${port}`));
