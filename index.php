<?php
// Simple PHP frontend for coffee calculator
$default_ratio = 16;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Filter Coffee Calculator</title>
  <link rel="stylesheet" href="public/style.css">
</head>
<body>
  <main>
    <h1>Filter Coffee Calculator</h1>

    <form id="calcForm">
      <div class="row">
        <label>Input type</label>
        <select id="type" name="type">
          <option value="coffee">Coffee (g)</option>
          <option value="water">Water (g)</option>
        </select>
      </div>

      <div class="row">
        <label for="value">Value</label>
        <input id="value" name="value" type="number" step="any" value="15" required>
      </div>

      <div class="row">
        <label for="ratio">Ratio (coffee : water)</label>
          <input id="ratio" name="ratio" type="number" step="any" value="<?php echo $default_ratio; ?>" required>
      </div>

      <div class="row">
        <label for="pours">Pours (including bloom)</label>
        <input id="pours" name="pours" type="number" min="2" max="6" value="3">
      </div>

      <div class="row">
        <label for="bloomRatio">Bloom multiplier</label>
        <input id="bloomRatio" name="bloomRatio" type="number" step="any" value="2">
      </div>
    
      <div class="row">
        <label for="pourInterval">Pour interval (sec)</label>
        <input id="pourInterval" name="pourInterval" type="number" step="any" value="30">
      </div>

      <div class="row">
        <button type="submit">Calculate</button>
      </div>
    </form>

    <section id="result" class="hidden">
      <h2>Result</h2>
      <div id="resultText"></div>

      <div id="recipeContainer" class="hidden">
        <h3>Recipe</h3>
        <ol id="recipeList" class="recipe-list"></ol>
      </div>

      <div id="timerControls" class="hidden controls">
        <button id="startBtn">Start</button>
        <button id="pauseBtn">Pause</button>
        <button id="resetBtn">Reset</button>
        <span id="timerDisplay">0s</span>
      </div>
    </section>

    <p class="note">This page uses a small Node.js API at <code>http://localhost:3000/calc</code>. Start that server first.</p>
  </main>

  <script src="public/script.js"></script>
</body>
</html>
