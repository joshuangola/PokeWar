const playerNameForm = document.getElementById("player-name-form");
const playerNameInput = document.getElementById("player-name-input");
const playAgainButton = document.getElementById("play-again");
const nextRoundButton = document.getElementById("next-round");
const exitButton = document.getElementById("exit");
const gameBoard = document.getElementById("game-board");
const gameOver = document.getElementById("game-over");
const gameResult = document.getElementById("game-result");

const playerNameElement = document.getElementById("player-name");
const playerScoreElement = document.getElementById("player-score");
const playerCard = document.getElementById("player-card");
const playerCardCover = document.getElementById("player-card-cover");

const computerNameElement = document.getElementById("computer-name");
const computerScoreElement = document.getElementById("computer-score");
const computerCard = document.getElementById("computer-card");
const computerCardCover = document.getElementById("computer-card-cover");

const baseUrl = "http://localhost:4004";

let playerName = "";
let playerDeck = [];
let computerDeck = [];
let playerScore = 0;
let computerScore = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

playerNameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  playerName = playerNameInput.value;

  if (playerName) {
    startGame();
  } else {
    alert("Please enter a name");
  }
});

playAgainButton.addEventListener("click", () => {
  startGame();
});

exitButton.addEventListener("click", () => {
  window.location.reload();
});

function handleNextRoundButtonClick() {
  if (nextRoundButton.textContent === "Reveal Cards") {
    revealCards();
  } else if (nextRoundButton.textContent === "Next Round") {
    playRound();
  }
}

nextRoundButton.addEventListener("click", handleNextRoundButtonClick);

async function startGame() {
  try {
    const response = await axios.get(`${baseUrl}/api/pokemon`);
    const cards = response.data;

    shuffleArray(cards);

    playerDeck = cards.slice(0, 26);
    computerDeck = cards.slice(26);

    playerScore = 0;
    computerScore = 0;

    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;

    playerNameElement.textContent = playerName;
    computerNameElement.textContent = "Ashe";

    gameOver.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    playAgainButton.classList.add("hidden");
    exitButton.classList.add("hidden");

    nextRoundButton.textContent = "Reveal Cards";
    nextRoundButton.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    alert("Error fetching cards");
  }
}

function revealCards() {
  if (playerDeck.length === 0) {
    // console.log("Player deck is empty");
    endGame();
    return;
  }

  const playerTopCard = playerDeck[0];
  const computerTopCard = computerDeck[0];

  playerCard.style.backgroundImage = `url(${playerTopCard.image})`;
  computerCard.style.backgroundImage = `url(${computerTopCard.image})`;

  if (playerTopCard.value > computerTopCard.value) {
    playerScore++;
    playerScoreElement.textContent = playerScore;
  } else {
    computerScore++;
    computerScoreElement.textContent = computerScore;
  }

  playerCardCover.classList.add("hidden");
  computerCardCover.classList.add("hidden");

  nextRoundButton.textContent = "Next Round";
}

function playRound() {
  playerDeck.shift();
  computerDeck.shift();

  if (playerDeck.length > 0) {
    nextRoundButton.textContent = "Reveal Cards";
  }

  if (playerDeck.length === 0 || computerDeck.length === 0) {
    nextRoundButton.classList.add("hidden");
    endGame();
  }

  playerCardCover.classList.remove("hidden");
  computerCardCover.classList.remove("hidden");
}

function endGame() {
  gameOver.classList.remove("hidden");
  gameBoard.classList.add("hidden");
  gameResult.textContent =
    playerScore > computerScore ? "You Win!" : "You Lose!";
  playAgainButton.classList.remove("hidden");
  exitButton.classList.remove("hidden");
  nextRoundButton.classList.add("hidden");
}
