const assert = require('assert');
const { computeCoffeeWater, makeRecipe } = require('./server');

// Test computeCoffeeWater with coffee input
const res1 = computeCoffeeWater('coffee', 15, 16);
assert.strictEqual(res1.coffee, 15);
assert.strictEqual(res1.water, 240);

// Test computeCoffeeWater with water input
const res2 = computeCoffeeWater('water', 320, 16);
assert.strictEqual(Math.round(res2.coffee * 100) / 100, 20);

// Test recipe generation with pourInterval
const recipe = makeRecipe(15, 240, { pours: 3, bloomRatio: 2, bloomTime: 30, pourInterval: 10 });
// bloom
assert.strictEqual(recipe[0].step, 0);
assert.strictEqual(recipe[0].water, 30);
// first pour starts at bloomTime
assert.strictEqual(recipe[1].startSec, 30);
// second pour should start at bloomTime + pourInterval
assert.strictEqual(recipe[2].startSec, 40);

console.log('All tests passed');
process.exit(0);
