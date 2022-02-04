const playRound = document.querySelector(".round");
const playerCards = document.querySelectorAll(".player");
const playerOneScore = document.querySelector(".player-one");
const computerScore = document.querySelector(".computer");
const computerChoice = document.querySelector(".computer-choice");
const versus = document.querySelector(".versus");

const h1 = document.createElement("h1");
playRound.appendChild(h1);

const h2 = document.createElement("h1");
playerOneScore.appendChild(h2);

const h3 = document.createElement("h1");
computerScore.appendChild(h3);

const h4 = document.createElement("h1");
versus.appendChild(h4);
h4.setAttribute("class", "result-text");

const game = {
  playerName: localStorage.name,
  player: 0,
  cpu: 0,
  round: 0,
  playCards: ["rock", "paper", "scissors"],
  winner: function () {
    if (this.player === 3 || this.cpu === 3) {
      const win = this.player === 3 ? "You win the game" : "CPU wins the game";
      alert(win);
      const vs = document.querySelector(".result-text");
      vs.innerText = "";
      return true;
    }
    return false;
  },
  scoreBoard: function () {
    h2.innerText = `${this.playerName}:  ${this.player}`;
    h1.innerText = `Round ${this.round}`;
    h3.innerText = `Computer: ${this.cpu}`;
  },
  resetGame: function () {
    const vs = document.querySelector(".result-text");
    this.round = 0;
    this.player = 0;
    this.cpu = 0;
    vs.innerText = "";
    this.scoreBoard();
  },
  randomNumber: function () {
    return Math.floor(Math.random() * this.playCards.length);
  },
};
/*
 Lets append <img> to each <div>, with clicklisteners on each element
 for picking up users choice, getting index for reference to game logic.
*/

playerCards.forEach((card, index) => {
  const img = document.createElement("img");
  card.appendChild(img);
  img.setAttribute("src", `./img/${game.playCards[index]}.png`);
  img.setAttribute("alt", `${game.playCards[index]}`);
  img.classList.add("card");
  game.scoreBoard();
  clickCard(card, index);
});

function clickCard(card, index) {
  card.addEventListener("click", () => {
    game.scoreBoard();
    if (!game.winner()) {
      game.round++;
      gameLogic(index, computerLogic());
    }
  });
}

// Create random number and use that to create <img> based on cpu choice
function computerLogic() {
  let randomNumber = game.randomNumber();
  let img = document.createElement("img");

  while (computerChoice.firstChild) {
    computerChoice.removeChild(computerChoice.lastChild);
  }
  computerChoice.appendChild(img);
  img.setAttribute("src", `./img/${game.playCards[randomNumber]}.png`);
  img.setAttribute("alt", `${game.playCards[randomNumber]}`);
  img.setAttribute("class", "card cpu-card");
  return randomNumber;
}

// Game logic for checking win/loss/tie

function gameLogic(player, computer) {
  if (player === computer) {
    h4.innerText = "Tie";
  } else if (player === 0 && computer === 2) {
    game.player++;
    h4.innerText = "You Win";
  } else if (player === 1 && computer === 0) {
    game.player++;
    h4.innerText = "You Win";
  } else if (player === 2 && computer === 1) {
    game.player++;
    h4.innerText = "You Win";
  } else {
    game.cpu++;
    h4.innerText = "You loose";
  }
}

// Reset Button
const resetBtn = document.querySelector("#reset-btn");

resetBtn.addEventListener("click", () => {
  game.resetGame();
});
