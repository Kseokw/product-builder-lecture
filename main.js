document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-button');
  const lotteryNumbersDiv = document.getElementById('lottery-numbers');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  generateButton.addEventListener('click', generateLotteryNumbers);
  themeToggle.addEventListener('click', toggleTheme);

  // Initialize theme from localStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    // Removed themeToggle.textContent for icon
  } else {
    // Removed themeToggle.textContent for icon
  }

  function generateLotteryNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1; // Numbers between 1 and 45
      numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    displayNumbers(sortedNumbers);
  }

  function displayNumbers(numbers) {
    const numberCircles = lotteryNumbersDiv.querySelectorAll('.number-circle');
    numberCircles.forEach((circle, index) => {
      if (numbers[index]) {
        circle.textContent = numbers[index];
        // Optional: Change color based on number range
        let color;
        if (numbers[index] <= 10) {
          color = '#fbc400'; // Yellow
        } else if (numbers[index] <= 20) {
          color = '#69c8f2'; // Blue
        } else if (numbers[index] <= 30) {
          color = '#ff7272'; // Red
        } else if (numbers[index] <= 40) {
          color = '#aaaaaa'; // Gray
        } else {
          color = '#b0d840'; // Green
        }
        // Apply color dynamically, but respect dark mode if active
        if (body.classList.contains('dark-mode')) {
            circle.style.backgroundColor = color;
            circle.style.borderColor = color;
            circle.style.color = '#333'; // Ensure number is visible in dark mode
        } else {
            circle.style.backgroundColor = color;
            circle.style.borderColor = color;
            circle.style.color = '#fff';
        }

      } else {
        circle.textContent = '?';
        // Reset to default colors
        if (body.classList.contains('dark-mode')) {
            circle.style.backgroundColor = '#555';
            circle.style.borderColor = '#666';
            circle.style.color = '#eee';
        } else {
            circle.style.backgroundColor = '#6a0572';
            circle.style.borderColor = '#56045d';
            circle.style.color = '#fff';
        }
      }
    });
  }

  function toggleTheme() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      // Removed themeToggle.textContent for icon
    } else {
      localStorage.setItem('theme', 'light');
      // Removed themeToggle.textContent for icon
    }
    // Re-display numbers to apply correct text color if needed
    const currentNumbers = Array.from(lotteryNumbersDiv.querySelectorAll('.number-circle')).map(circle => circle.textContent === '?' ? undefined : parseInt(circle.textContent));
    displayNumbers(currentNumbers.filter(n => n !== undefined)); // Filter out undefined to not try to display '?'
  }


  // Generate numbers on initial load as well
  generateLotteryNumbers();
});