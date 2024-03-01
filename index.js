let currentQuestionIndex = 0;
let questions = [];
let correctCount = 0;
let points = 0;

// Fetch questions from API
const fetchQuestions = async () => {
  const res = await fetch(
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium"
  );
  const data = await res.json();
  questions = data.results;
  showQuestion();
};

const decodeHTMLEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

// Display questions
const showQuestion = () => {
  const currentQuestion = questions[currentQuestionIndex];
  const numberElement = document.getElementById("number");
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const pointsElement = document.getElementById("points");

  numberElement.innerText = `${currentQuestionIndex + 1}/${questions.length} `;
  questionElement.innerText = decodeHTMLEntities(currentQuestion.question);
  answersElement.innerHTML = ""; // Clear previous answers
  pointsElement.innerText = `${points} points`;

  // Combine incorrect and correct answers
  const allAnswers = currentQuestion.incorrect_answers.concat(
    currentQuestion.correct_answer
  );

  // Shuffle the answers
  const shuffledAnswers = shuffleArray(allAnswers);

  // Buttons for answers
  shuffledAnswers.forEach((answer, index) => {
    const answerHolder = document.createElement("div");
    answerHolder.classList.add("answer-holder", "btn", `btn-color${index + 1}`); // Dodavanje klasa za stilizaciju
    answerHolder.innerHTML = `
      <button class="answer-btn" value="${answer}">${answer}</button>
    `;
    answerHolder.addEventListener("click", () => {
      handleAnswerSelection(answer);
    });
    answersElement.appendChild(answerHolder);
  });
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const handleAnswerSelection = (selectedAnswer) => {
  const correctAnswer = questions[currentQuestionIndex].correct_answer;
  const userAnswer = selectedAnswer;
  const isCorrect = userAnswer === correctAnswer;
  const score = document.getElementById("score");

  if (sound.checked) {
    buttonEffect.volume = 0.01;
    buttonEffect.play();
  }

  if (isCorrect) {
    correctCount++;
    points = points + 10;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    overlay.classList.remove("disabled-overlay");
    overlay.classList.add("active-overlay");
    score.innerText = points;
    finalScore.classList.remove("final-score-disabled");
    finalScore.classList.add("final-score-active");
  }
};

fetchQuestions();

const menu = document.getElementById("menu");
const close = document.getElementById("close");
const leave = document.getElementById("leave");
const aside = document.getElementById("side-menu");
const overlay = document.getElementById("overlay");
const restart = document.getElementById("restart");
const finalScore = document.getElementById("final-score");
const music = document.getElementById("music");
const sound = document.getElementById("sound");
const backgroundMusic = document.getElementById("background-music");
const buttonEffect = document.getElementById("button-effect");

menu.addEventListener("click", () => {
  overlay.classList.remove("disabled-overlay");
  overlay.classList.add("active-overlay");
  aside.classList.remove("disabled-side-menu");
  aside.classList.add("active-side-menu");
});

leave.addEventListener("click", () => {
  overlay.classList.remove("active-overlay");
  overlay.classList.add("disabled-overlay");
  aside.classList.remove("active-side-menu");
  aside.classList.add("disabled-side-menu");
});

close.addEventListener("click", () => {
  overlay.classList.remove("active-overlay");
  overlay.classList.add("disabled-overlay");
  aside.classList.remove("active-side-menu");
  aside.classList.add("disabled-side-menu");
});

restart.addEventListener("click", () => {
  overlay.classList.remove("active-overlay");
  overlay.classList.add("disabled-overlay");
  finalScore.classList.remove("final-score-active");
  finalScore.classList.add("final-score-disabled");
  currentQuestionIndex = 0;
  correctCount = 0;
  points = 0;
  fetchQuestions();
});

music.addEventListener("click", () => {
  if (music.checked) {
    backgroundMusic.volume = 0.01;
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});

sound.addEventListener("click", () => {
  if (sound.checked) {
    buttonEffect.volume = 0.01;
    buttonEffect.play();
  } else {
    buttonEffect.pause();
  }
});
