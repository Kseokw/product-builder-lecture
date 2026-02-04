document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-button');
  const lotteryNumbersDiv = document.getElementById('lottery-numbers');

  generateButton.addEventListener('click', generateLotteryNumbers);

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
        circle.style.backgroundColor = color;
        circle.style.borderColor = color;
      } else {
        circle.textContent = '?';
        circle.style.backgroundColor = '#6a0572';
        circle.style.borderColor = '#56045d';
      }
    });
  }

  // Generate numbers on initial load as well
  generateLotteryNumbers();
});
