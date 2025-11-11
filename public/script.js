document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');
  const resultText = document.getElementById('resultText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const value = Number(document.getElementById('value').value);
    const ratio = Number(document.getElementById('ratio').value);

    result.classList.add('hidden');
    resultText.textContent = 'Calculating...';

    try {
      const res = await fetch('http://localhost:3000/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, ratio })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }

      const data = await res.json();
      resultText.innerHTML = `Coffee: <strong>${data.coffee} g</strong><br>Water: <strong>${data.water} g</strong><br>Ratio: <strong>1 : ${data.ratio}</strong>`;
      result.classList.remove('hidden');
    } catch (err) {
      resultText.textContent = 'Error: ' + err.message;
      result.classList.remove('hidden');
    }
  });
});
