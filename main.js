document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-button');
  const lotteryNumbersDiv = document.getElementById('lottery-numbers');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Teachable Machine elements
  const imageUpload = document.getElementById('image-upload');
  const imagePreview = document.getElementById('image-preview');
  const predictButton = document.getElementById('predict-button');
  const predictionResultsDiv = document.getElementById('prediction-results');

  // Category Navigation elements
  const categoryNav = document.getElementById('category-nav');
  const categoryButtons = document.querySelectorAll('.category-button');
  const lotterySection = document.getElementById('lottery-section');
  const animalTestSection = document.getElementById('animal-test-section');

  // Teachable Machine model variables
  const URL = "https://teachablemachine.withgoogle.com/models/vfB9qcKLR/";
  let model, webcam, labelContainer, maxPredictions;

  // Event Listeners
  generateButton.addEventListener('click', generateLotteryNumbers);
  themeToggle.addEventListener('click', toggleTheme);
  imageUpload.addEventListener('change', handleImageUpload);
  predictButton.addEventListener('click', predictImage);

  categoryNav.addEventListener('click', (event) => {
    if (event.target.classList.contains('category-button')) {
      const targetSectionId = event.target.dataset.target;
      showSection(targetSectionId);
    }
  });


  // Initialize theme from localStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  // Category Switching Logic
  function showSection(sectionId) {
    // Hide all sections
    lotterySection.style.display = 'none';
    animalTestSection.style.display = 'none';

    // Remove active class from all buttons
    categoryButtons.forEach(button => button.classList.remove('active'));

    // Show the target section and set active button
    if (sectionId === 'lottery-section') {
      lotterySection.style.display = 'block';
      document.querySelector('.category-button[data-target="lottery-section"]').classList.add('active');
    } else if (sectionId === 'animal-test-section') {
      animalTestSection.style.display = 'block';
      document.querySelector('.category-button[data-target="animal-test-section"]').classList.add('active');
    }
  }


  // Lottery Number Generator Functions
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
        let color;
        if (numbers[index] <= 10) {
          color = '#fbc400';
        } else if (numbers[index] <= 20) {
          color = '#69c8f2';
        } else if (numbers[index] <= 30) {
          color = '#ff7272';
        } else if (numbers[index] <= 40) {
          color = '#aaaaaa';
        } else {
          color = '#b0d840';
        }
        if (body.classList.contains('dark-mode')) {
            circle.style.backgroundColor = color;
            circle.style.borderColor = color;
            circle.style.color = '#333';
        } else {
            circle.style.backgroundColor = color;
            circle.style.borderColor = color;
            circle.style.color = '#fff';
        }

      } else {
        circle.textContent = '?';
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

  // Theme Toggle Function
  function toggleTheme() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    const currentNumbers = Array.from(lotteryNumbersDiv.querySelectorAll('.number-circle')).map(circle => circle.textContent === '?' ? undefined : parseInt(circle.textContent));
    displayNumbers(currentNumbers.filter(n => n !== undefined));
  }


  // Teachable Machine Functions
  async function initTeachableMachine() {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
      console.log("Teachable Machine Model Loaded!");
      predictionResultsDiv.innerHTML = '모델 로딩 완료. 이미지를 업로드해주세요.';
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        predictButton.disabled = false;
        predictionResultsDiv.innerHTML = '';
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.style.display = 'none';
      imagePreview.src = '#';
      predictButton.disabled = true;
      predictionResultsDiv.innerHTML = '';
    }
  }

  async function predictImage() {
      if (!model || !imagePreview.src || imagePreview.style.display === 'none') {
          predictionResultsDiv.innerHTML = '이미지를 업로드해주세요.';
          return;
      }
      predictionResultsDiv.innerHTML = '분석 중...';
      const prediction = await model.predict(imagePreview);
      displayPredictionResults(prediction);
  }

  function displayPredictionResults(prediction) {
      predictionResultsDiv.innerHTML = '';
      const sortedPrediction = prediction.sort((a, b) => b.probability - a.probability);

      sortedPrediction.forEach(classPrediction => {
          const classLabel = classPrediction.className;
          const probability = (classPrediction.probability * 100).toFixed(2);
          
          const resultItem = document.createElement('div');
          resultItem.classList.add('result-item');
          
          const labelSpan = document.createElement('span');
          labelSpan.classList.add('label');
          labelSpan.textContent = classLabel;
          
          const confidenceSpan = document.createElement('span');
          confidenceSpan.classList.add('confidence');
          confidenceSpan.textContent = `${probability}%`;
          
          resultItem.appendChild(labelSpan);
          resultItem.appendChild(confidenceSpan);
          predictionResultsDiv.appendChild(resultItem);
      });
  }


  // Initial calls
  generateLotteryNumbers();
  initTeachableMachine();
  // Show lottery section by default
  showSection('lottery-section');
});