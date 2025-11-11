# Coffee Calc (Filter Coffee)

Small example: Node.js API + PHP frontend to calculate coffee and water amounts using a brew ratio (default 1:16).

Structure:
- api/server.js - Node.js Express API (POST /calc)
- api/package.json - Node dependencies
- index.php - PHP frontend page served by XAMPP/Apache
- public/script.js - frontend JavaScript
- public/style.css - frontend CSS

How to run
1. Start XAMPP/Apache so `index.php` is served from `http://localhost/coffee-calc/index.php` (or place this folder under your Apache htdocs root).

2. Start the Node API (requires Node.js and npm). In a terminal:

   cd C:\xampp\htdocs\coffee-calc\api
   npm install
   node server.js

The API listens on port 3000 by default. The PHP frontend will send requests to `http://localhost:3000/calc`.

Usage
- Open the PHP page in your browser, enter either coffee (g) or water (g) and the ratio, then click Calculate.

Notes
- This is intentionally minimal and educational. You can extend it to validate inputs, support grams-to-ml conversions, or make the API serve the frontend directly.
