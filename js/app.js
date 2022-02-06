(function () {
  const gameRedirect = () => {
    let player = localStorage.name;
    if (typeof player === 'string') {
      window.open('game.html', '_self');
    }
  };
  const playerName = () => {
    let name = prompt('Please enter your name:');

    if (name == null || name == '') {
      const randomizedNumber = Math.round(Math.random() * 1000);
      localStorage.setItem('name', `Player_${randomizedNumber}`);
    } else {
      localStorage.setItem('name', name);
    }
    setTimeout(gameRedirect, 2000);
  };

  document.querySelector('.rps-img').addEventListener('click', (e) => {
    e.preventDefault();
    playerName();
  });
})();
