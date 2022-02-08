(function () {
  const playerCards = document.querySelectorAll('.player');
  const playerScore = document.querySelector('.player-one');
  const cpuChoice = document.querySelector('.computer-choice');
  const versus = document.querySelector('.versus');

  const h2 = document.createElement('h1');
  playerScore.appendChild(h2);

  const h4 = document.createElement('h1');
  versus.appendChild(h4);
  h4.setAttribute('class', 'result-text');

  // Instance class for creating database urls depending on requested data
  class Database {
    constructor(endpoint) {
      this.url =
        'https://exercise-js2-default-rtdb.europe-west1.firebasedatabase.app';
      this.endpoint = endpoint;
    }
    getUri() {
      return `${this.url}/${this.endpoint}/.json`;
    }
  }

  const game = {
    _name: localStorage.name,
    _playerScore: 0,
    cards: ['rock', 'paper', 'scissors'],
    // If player wins, add to score, if tie do nothing. If CPU wins, check highscore and update if needed.
    winner: function (player, computer) {
      if (gameLogic(player, computer)) {
        this._playerScore++;
        this.scoreBoard();
      } else if (gameLogic(player, computer) === null) {
        this.scoreBoard();
      } else {
        compareHighscore(this._playerScore, this._name);
        this._playerScore = 0;
        this.scoreBoard();
      }
    },
    scoreBoard: function () {
      h2.innerText = `${this._name}:  ${this._playerScore}`;
    },
    randomNumber: function () {
      return Math.floor(Math.random() * this.cards.length);
    },
  };

  const clickCard = (card, index) => {
    card.addEventListener('click', () => {
      game.winner(index, computerChoice());
    });
  };

  /*
 Lets append <img> to each <div>, with clicklisteners on each element
 for picking up users choice, getting index for reference to game logic.
*/
  playerCards.forEach((card, index) => {
    const img = document.createElement('img');
    card.appendChild(img);
    img.setAttribute('src', `./img/${game.cards[index]}.png`);
    img.setAttribute('alt', `${game.cards[index]}`);
    img.classList.add('card');
    game.scoreBoard();
    clickCard(card, index);
  });

  // Create random number and use that to create <img> based on cpu choice
  const computerChoice = () => {
    let randomNumber = game.randomNumber();
    let img = document.createElement('img');

    while (cpuChoice.firstChild) {
      cpuChoice.removeChild(cpuChoice.lastChild);
    }
    cpuChoice.appendChild(img);
    img.setAttribute('src', `./img/${game.cards[randomNumber]}.png`);
    img.setAttribute('alt', `${game.cards[randomNumber]}`);
    img.setAttribute('class', 'card cpu-card');
    return randomNumber;
  };

  // Game logic for checking win/loss/tie
  const gameLogic = (player, computer) => {
    let winner = '';
    if (player === computer) {
      h4.innerText = 'Tie';
      winner = null;
    } else if (player === 0 && computer === 2) {
      h4.innerText = 'You Win';
      winner = true;
    } else if (player === 1 && computer === 0) {
      h4.innerText = 'You Win';
      winner = true;
    } else if (player === 2 && computer === 1) {
      h4.innerText = 'You Win';
      winner = true;
    } else {
      h4.innerText = 'You loose';
      winner = false;
    }
    return winner;
  };

  // GET method for injecting player score and database object to sort/compare function
  const compareHighscore = async (userScore, playerName) => {
    const connect = new Database('highscore', '');

    await fetch(connect.getUri())
      .then((res) => res.json())
      .then((results) => {
        sortHighscore(userScore, playerName, results);
      })
      .catch((error) => console.log('Compare Highscore:', error));
  };

  const sortHighscore = (userScore, userName, object) => {
    let newObject = {};
    for (const key in object) {
      const { score } = object[key];
      if (userScore > score) {
        // creating a new element to existing object, if userscore is higher
        let addUserScore = Object.assign(object, {
          5: {
            name: userName,
            score: userScore,
          },
        });

        let sorted = Object.entries(addUserScore).sort(
          (a, b) => b[1].score - a[1].score
        );

        for (let i = 0; i < sorted.length - 1; i++) {
          newObject[i] = { name: sorted[i][1].name, score: sorted[i][1].score };
        }
      } else if (userScore === score) {
        break;
      }
    }

    updateHighscore(newObject);
  };

  // Function sends PATCH to database with new score and name, updates scoreboard afterwards.
  const updateHighscore = async (object) => {
    const upDatedatabase = new Database('highscore');

    await fetch(upDatedatabase.getUri(), {
      method: 'PATCH',
      body: JSON.stringify(object),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        getHighscoreBoard();
      })
      .catch((error) => console.log('Update Highscore:', error));
  };

  // Removes any existing children from DOM-Element, then populates it with new data-lists
  const getHighscoreBoard = async () => {
    const connect = new Database('highscore', '');
    const ol = document.querySelector('.scores');

    while (ol.firstChild) {
      ol.removeChild(ol.lastChild);
    }

    await fetch(connect.getUri())
      .then((res) => res.json())
      .then((users) => {
        for (const index in users) {
          const li = document.createElement('li');
          const { name, score } = users[index];
          li.innerText = `${name} with ${score} rounds`;
          ol.appendChild(li);
        }
      })
      .catch((error) => console.log('Get Highscore:', error));
  };
  getHighscoreBoard();
})();
