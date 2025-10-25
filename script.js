let score = 0;
let timeLeft = 30;
let countdown;
let dropInterval;
let bucketX = 200;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const bucket = document.getElementById('bucket');

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// Keyboard movement
document.addEventListener('keydown', moveBucket);
gameContainer.addEventListener('mousemove', moveBucketMouse);

function moveBucket(e) {
  const gameWidth = gameContainer.clientWidth;
  const bucketWidth = bucket.offsetWidth;
  if (e.key === 'ArrowLeft') {
    bucketX = Math.max(0, bucketX - 20);
  } else if (e.key === 'ArrowRight') {
    bucketX = Math.min(gameWidth - bucketWidth, bucketX + 20);
  }
  bucket.style.left = `${bucketX}px`;
}

function moveBucketMouse(e) {
  const rect = gameContainer.getBoundingClientRect();
  bucketX = e.clientX - rect.left - bucket.offsetWidth / 2;
  bucketX = Math.max(0, Math.min(bucketX, gameContainer.clientWidth - bucket.offsetWidth));
  bucket.style.left = `${bucketX}px`;
}

function startGame() {
  startBtn.classList.add('hidden');
  resetBtn.classList.add('hidden');
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = "";

  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);

  dropInterval = setInterval(createDrop, 700);
}

function createDrop() {
  const drop = document.createElement('div');
  drop.classList.add('water-drop');

  if (Math.random() < 0.2) {
    drop.classList.add('bad');
  } else {
    drop.classList.add('clean');
  }

  drop.style.left = Math.random() * 90 + "%";
  drop.style.width = drop.style.height = Math.floor(Math.random() * 25 + 20) + "px";
  gameContainer.appendChild(drop);

  let dropY = 0;
  const fallSpeed = 4;

  const fall = setInterval(() => {
    dropY += fallSpeed;
    drop.style.top = dropY + "px";

    // Collision detection with bucket
    const dropRect = drop.getBoundingClientRect();
    const bucketRect = bucket.getBoundingClientRect();

    if (
      dropRect.bottom >= bucketRect.top &&
      dropRect.left < bucketRect.right &&
      dropRect.right > bucketRect.left
    ) {
      if (drop.classList.contains('bad')) {
        score--;
      } else {
        score++;
      }
      scoreDisplay.textContent = score;
      drop.remove();
      clearInterval(fall);
    }

    // Remove drop if it falls past game area
    if (dropY > 500) {
      drop.remove();
      clearInterval(fall);
    }
  }, 30);
}

function endGame() {
  clearInterval(countdown);
  clearInterval(dropInterval);
  document.querySelectorAll('.water-drop').forEach(drop => drop.remove());

  const winMessages = [
    "You’re a true Water Hero!",
    "Clean water victory!",
    "Amazing job! You made a splash!",
    "Every drop counts!"
  ];

  const loseMessages = [
    "Almost there! Try again!",
    "Keep practicing — clean water needs you!",
    "Close one! Play again!",
    "Don’t give up!"
  ];

  const message = score >= 20
    ? winMessages[Math.floor(Math.random() * winMessages.length)]
    : loseMessages[Math.floor(Math.random() * loseMessages.length)];

  messageDisplay.textContent = message;
  resetBtn.classList.remove('hidden');
}

function resetGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = "";
  startBtn.classList.remove('hidden');
  resetBtn.classList.add('hidden');
}
