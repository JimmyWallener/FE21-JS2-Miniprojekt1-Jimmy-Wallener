(function () {
  const getURL = (endpoint) =>
    `https://exercise-js2-default-rtdb.europe-west1.firebasedatabase.app/${endpoint}/.json`;

  const generateRandomNumber = (cards) => {
    return Math.floor(Math.random() * cards.length);
  };

  const setScoreBoard = (score) => {
    const playerScore = document.querySelector('.player-one');
    const h2 = document.createElement('h1');
    while (playerScore.firstChild) {
      playerScore.removeChild(playerScore.lastChild);
    }
    playerScore.appendChild(h2);

    const name = localStorage.name;
    h2.innerText = `${name}:  ${score}`;
  };

  const clickCard = (card, index) => {
    card.addEventListener('click', () => {
      checkWinner(index, computerChoice());
    });
  };

  (function () {
    const cards = ['rock', 'paper', 'scissors'];
    const playerCards = document.querySelectorAll('.player');
    playerCards.forEach((card, index) => {
      const img = document.createElement('img');
      card.appendChild(img);
      img.setAttribute('src', `./img/${cards[index]}.png`);
      img.setAttribute('alt', `${cards[index]}`);
      img.classList.add('card');
      clickCard(card, index);
    });
  })();

  const computerChoice = () => {
    const cards = ['rock', 'paper', 'scissors'];
    let randomNumber = generateRandomNumber(cards);
    const cpuChoice = document.querySelector('.computer-choice');
    let img = document.createElement('img');

    while (cpuChoice.firstChild) {
      cpuChoice.removeChild(cpuChoice.lastChild);
    }
    cpuChoice.appendChild(img);
    img.setAttribute('src', `./img/${cards[randomNumber]}.png`);
    img.setAttribute('alt', `${cards[randomNumber]}`);
    img.setAttribute('class', 'card cpu-card');
    return randomNumber;
  };

  // Game logic for checking win/loss/tie
  const gameLogic = (player, computer) => {
    const versus = document.querySelector('.versus');
    const h4 = document.createElement('h1');
    while (versus.firstChild) {
      versus.removeChild(versus.lastChild);
    }
    versus.appendChild(h4);
    h4.setAttribute('class', 'result-text');
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

  const checkWinner = (player, computer) => {
    const name = localStorage.name;
    let checkScore = score();
    if (gameLogic(player, computer)) {
      checkScore.increaseScore();
      setScoreBoard(checkScore.result());
    } else if (gameLogic(player, computer) === null) {
    } else {
      compareHighscore(player, name);
      checkScore.resetScore();
      setScoreBoard(checkScore.result());
    }
  };

  // Updating, Resetting & Getting score with Closure

  function score() {
    let score = 0;

    function keepScore(val) {
      score += val;
    }

    return {
      increaseScore: function () {
        keepScore(1);
      },
      resetScore: function () {
        score = 0;
      },
      result: function () {
        return score;
      },
    };
  }

  // GET method for injecting player score and database object to sort/compare function
  const compareHighscore = async (userScore, playerName) => {
    const connect = getURL('highscore');

    await fetch(connect)
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
      // Only if user has a higher score, will sorting and adding to highscore accure
      if (userScore > score) {
        // creating a new element to existing object, if userscore is higher
        let addUserScore = Object.assign(object, {
          5: {
            name: userName,
            score: userScore,
          },
        });
        // sorting the object based on score
        let sorted = Object.entries(addUserScore).sort(
          (a, b) => b[1].score - a[1].score
        );
        // creating a new object body for PATCH method
        for (let i = 0; i < sorted.length - 1; i++) {
          newObject[i] = { name: sorted[i][1].name, score: sorted[i][1].score };
        }
        // if scores are equal, stop checking and break loop
      } else if (userScore === score) {
        break;
      }
    }

    updateHighscore(newObject);
  };

  // Function sends PATCH to database with new score and name, updates scoreboard afterwards.
  const updateHighscore = async (object) => {
    const upDatedatabase = getURL('highscore');

    await fetch(upDatedatabase, {
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
    const connect = getURL('highscore');
    const ol = document.querySelector('.scores');

    while (ol.firstChild) {
      ol.removeChild(ol.lastChild);
    }

    await fetch(connect)
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
  setScoreBoard(0);
})();
