document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');
  const resultText = document.getElementById('resultText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const value = Number(document.getElementById('value').value);
    const ratio = Number(document.getElementById('ratio').value);
    const pours = Number(document.getElementById('pours')?.value || 3);
    const bloomRatio = Number(document.getElementById('bloomRatio')?.value || 2);
    const pourInterval = Number(document.getElementById('pourInterval')?.value || 30);

    result.classList.add('hidden');
    resultText.textContent = 'Calculating...';

    try {
      const res = await fetch('http://localhost:3000/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, ratio, pours, bloomRatio, pourInterval })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }

      const data = await res.json();

      // Basic summary
      const summary = `Coffee: <strong>${data.coffee} g</strong><br>Water: <strong>${data.water} g</strong><br>Ratio: <strong>1 : ${data.ratio}</strong>`;
      resultText.innerHTML = summary;

      // Recipe list
      const recipeContainer = document.getElementById('recipeContainer');
      const recipeList = document.getElementById('recipeList');
      const timerControls = document.getElementById('timerControls');
      const timerDisplay = document.getElementById('timerDisplay');

      recipeList.innerHTML = '';
      if (data.recipe && Array.isArray(data.recipe)) {
        data.recipe.forEach((step) => {
          const li = document.createElement('li');
          li.dataset.step = step.step;
          li.dataset.start = (typeof step.startSec !== 'undefined') ? step.startSec : '';
          li.dataset.time = (typeof step.timeSec !== 'undefined') ? step.timeSec : '';
          li.innerHTML = `<strong>${step.name}</strong>: ${step.water} g <small>${step.note || ''}</small>`;
          recipeList.appendChild(li);
        });
        recipeContainer.classList.remove('hidden');
        timerControls.classList.remove('hidden');
        result.classList.remove('hidden');

        // Setup timer state
        setupTimer(data.recipe);
      } else {
        recipeContainer.classList.add('hidden');
        timerControls.classList.add('hidden');
        timerDisplay.textContent = '0s';
        result.classList.remove('hidden');
      }
    } catch (err) {
      resultText.textContent = 'Error: ' + err.message;
      result.classList.remove('hidden');
    }
  });
});

// Timer implementation
function setupTimer(recipe) {
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const timerDisplay = document.getElementById('timerDisplay');
  const recipeList = document.getElementById('recipeList');

  // Convert recipe to timeline (ensure startSec for bloom exists)
  const timeline = recipe.map(s => ({
    step: s.step,
    name: s.name,
    start: (typeof s.startSec !== 'undefined') ? Number(s.startSec) : 0,
    duration: (typeof s.timeSec !== 'undefined') ? Number(s.timeSec) : 0,
  }));

  // Compute total duration: last step's start + duration (or 0)
  const last = timeline[timeline.length - 1] || { start: 0, duration: 0 };
  const totalDuration = (last.start || 0) + (last.duration || 0);

  let currentSec = 0;
  let timerId = null;
  let running = false;

  function updateDisplay() {
    timerDisplay.textContent = `${Math.floor(currentSec)}s`;
    // highlight current step: last step whose start <= currentSec
    let activeIndex = -1;
    for (let i = 0; i < timeline.length; i++) {
      if (currentSec >= timeline[i].start) activeIndex = i;
      else break;
    }

    Array.from(recipeList.children).forEach((li, idx) => {
      if (idx === activeIndex) li.classList.add('active'); else li.classList.remove('active');
    });
  }

  function tick() {
    currentSec += 1;
    if (currentSec > totalDuration + 5) { // small buffer after end
      clearInterval(timerId);
      running = false;
    }
    updateDisplay();
  }

  startBtn.onclick = () => {
    if (running) return;
    running = true;
    timerId = setInterval(tick, 1000);
  };

  pauseBtn.onclick = () => {
    if (timerId) clearInterval(timerId);
    running = false;
  };

  resetBtn.onclick = () => {
    if (timerId) clearInterval(timerId);
    running = false;
    currentSec = 0;
    updateDisplay();
  };

  // initialize display
  currentSec = 0;
  updateDisplay();
}
