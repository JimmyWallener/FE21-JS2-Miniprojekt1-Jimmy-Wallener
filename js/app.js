const body = document.querySelector("body");
const rpsImage = document.querySelector(".rps-img");

function gameRedirect() {
  let player = localStorage.name;
  if (typeof player === "string") {
    window.open("game.html", "_self");
  }
}
function playerName() {
  let name = prompt("Please enter your name:");

  if (name == null || name == "") {
    localStorage.setItem("name", "Player One");
  } else {
    localStorage.setItem("name", name);
  }
  setTimeout(gameRedirect, 2000);
}

rpsImage.addEventListener("click", (e) => {
  e.preventDefault();
  playerName();
});
