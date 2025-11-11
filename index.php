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
        <button type="submit">Calculate</button>
      </div>
    </form>

    <section id="result" class="hidden">
      <h2>Result</h2>
      <p id="resultText"></p>
    </section>

    <p class="note">This page uses a small Node.js API at <code>http://localhost:3000/calc</code>. Start that server first.</p>
  </main>

  <script src="public/script.js"></script>
</body>
</html>
