// Define weaponsArray
var weaponsArray = ['rock', 'paper', 'scissors'];

// Initialize score

class Score {

  constructor() {
    this._computerScore = 0;
    this._playerScore = 0;
  }

  get computerScore() {
    return this._computerScore;
  }

  get playerScore() {
    return this._playerScore;
  }

  incrementCompScore() {
    this._computerScore++;
  }

  incrementPlayScore() {
    this._playerScore++;
  }

  totalRounds() {
    return this.playerScore + this.computerScore;
  }

  scoreMessage() {
    return `COMPUTER : ${this.computerScore} - ${this.playerScore} : YOU`
  }
  
  generateHTMLScoreBoard() {
    const HTMLScoreBoard = document.createElement('div');
    HTMLScoreBoard.className = 'row';
    HTMLScoreBoard.id = 'mid';
    const scoreMessage = document.createElement('p');
    scoreMessage.id = 'score';
    scoreMessage.style = 'font-size: 50px;'
    scoreMessage.textContent = this.scoreMessage();
    HTMLScoreBoard.appendChild(scoreMessage);
    return HTMLScoreBoard;
  }

  updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = this.scoreMessage();
  }
}

let mainScoreBoard;
let rounds;
let hold = 0;

// We will start a new game of rock, paper, scissors

function startGame() {
  // Clean the board
  removeChildren();
  mainScoreBoard  = new Score();

  // Prompt the user for name and number of rounds he would like to play
  let playerName = window.prompt('What\'s your name?').toLowerCase().replace(/[ _\/\*\+]/g, "-");
  playerName = playerName[0].toUpperCase() + playerName.slice(1);

  do {
    rounds = window.prompt('How many rounds would you like to play?');
  }
  while(!rounds.match(/^\d+$/g))
  
  // Initialize the board
  const computerMove = createPlayArea('Computer');
  const scoreBoard = mainScoreBoard.generateHTMLScoreBoard();
  const playerMove = createPlayArea(playerName);

  // Append element of the board to parent node
  board = document.getElementById("board");
  [computerMove, scoreBoard, playerMove].forEach(elem => board.appendChild(elem));
}

function removeChildren() {
  container = document.getElementById('board');
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function createPlayArea(name) {
  const playArea = document.createElement('div');
  playArea.className = 'row';

  const playerMessage = document.createElement('p');
  playerMessage.textContent = (name == 'Computer') ? name : `Make your move, ${name}!`
  playArea.appendChild(playerMessage);

  const weapons = document.createElement('ul');
  weaponsArray.forEach(weapon => weapons.appendChild(createWeapon(weapon, name)));

  playArea.appendChild(weapons);
  return playArea;
}

function createWeapon(weapon, name) {
  const div_weapon = document.createElement('div');
  div_weapon.className = 'weapon';
  const img_weapon = document.createElement('img');
  img_weapon.src = `img/${weapon}.png`;
  img_weapon.id = weapon;
  div_weapon.appendChild(img_weapon);
  if (name != 'Computer') {
    img_weapon.className = 'player';
    img_weapon.setAttribute('onclick', `newRound('${weapon}')`)
  }
  else {
    img_weapon.className = 'computer';
  }
  return div_weapon;
}

function computerMove() {
  const index = Math.floor(Math.random() * 3);
  return weaponsArray[index];
}

function newRound(playerWeapon) {
  if (hold) return false;
  
  const computerWeapon = computerMove();
  if (playerWeapon == computerWeapon) {
    colorPlayer();
  }
  else if (
    playerWeapon == 'rock' && computerWeapon == 'scissors'
    || playerWeapon == 'paper' && computerWeapon == 'rock'
    || playerWeapon == 'scissors' && computerWeapon == 'paper'
    ) {
      mainScoreBoard.incrementPlayScore();
      colorPlayer('won', playerWeapon, computerWeapon);
  }
  else {
    mainScoreBoard.incrementCompScore();
    colorPlayer('lost', playerWeapon, computerWeapon);
  }
  mainScoreBoard.updateScore();
}

function colorPlayer(result='draw', playerWeapon, computerWeapon) {
  if (result == 'draw') {
    document.getElementsByClassName('player').namedItem(playerWeapon).style = 'background-color: rgb(231, 181, 86); border-radius: 10px; border-style: transparent; ';
    document.getElementsByClassName('computer').namedItem(computerWeapon).style = 'background-color: rgb(231, 181, 86); border-radius: 10px; border-style: transparent; ';
  }
  else if (result == 'won') {
    document.getElementsByClassName('player').namedItem(playerWeapon).style = 'background-color: rgb(129, 196, 98); border-radius: 10px; border-style: transparent; ';
    document.getElementsByClassName('computer').namedItem(computerWeapon).style = 'background-color: rgb(196, 98, 98); border-radius: 10px; border-style: transparent; ';
  }
  else {
    document.getElementsByClassName('player').namedItem(playerWeapon).style = 'background-color: rgb(196, 98, 98); border-radius: 10px; border-style: transparent; ';
    document.getElementsByClassName('computer').namedItem(computerWeapon).style = 'background-color: rgb(129, 196, 98); border-radius: 10px; border-style: transparent; ';
  }

  hold = 1;

  setTimeout(function() {
    document.getElementsByClassName('player').namedItem(playerWeapon).removeAttribute('style');
    document.getElementsByClassName('computer').namedItem(computerWeapon).removeAttribute('style');
    hold = 0;
    if (mainScoreBoard.totalRounds() == rounds) endGame();
  }, 1000);
}

function endGame() {
  removeChildren();
  
  endGameMessage = document.createElement('h2');
  if (mainScoreBoard.computerScore == mainScoreBoard.playerScore) endGameMessage.textContent = 'It\'s a draw!'
  else if (mainScoreBoard.computerScore < mainScoreBoard.playerScore) endGameMessage.textContent = 'Congrats! You won!'
  else if (mainScoreBoard.computerScore > mainScoreBoard.playerScore) endGameMessage.textContent = 'Boooh! You loser'
  
  endGameMessage.style = 'font-family: Cabin Sketch, sans-serif; font-size: 120px; color: #4452f9; text-align: center;'

  document.getElementById("board").appendChild(endGameMessage);
  
  endGameSubMessageButton = document.createElement('button');
  endGameSubMessageButton.className = 'play-game';
  endGameSubMessageButton.style = 'position: absolute; left: 35%;';
  endGameSubMessageButton.textContent = 'Wanna play again?';
  endGameSubMessageButton.addEventListener('click', startGame);

  document.getElementById("board").appendChild(endGameSubMessageButton);
}