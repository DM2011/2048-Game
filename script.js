const board = document.getElementById("board");
const popSound = document.getElementById("popSound");
let boardArray = [];
let score = 0;

function initBoard() {
  boardArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  addNewTile();
  addNewTile();
  updateBoard();
}

function addNewTile() {
  let emptyTiles = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (boardArray[r][c] === 0) {
        emptyTiles.push({ r, c });
      }
    }
  }

  if (emptyTiles.length === 0) return;

  let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  boardArray[randomTile.r][randomTile.c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      let value = boardArray[r][c];
      if (value !== 0) {
        tile.classList.add("tile-" + value);
        tile.innerText = value;
      }
      board.appendChild(tile);
    }
  }
  document.getElementById("score").innerText = "Score: " + score;
}

function slide(row) {
  let arr = row.filter(val => val !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val !== 0);
  while (arr.length < 4) arr.push(0);
  return arr;
}

function rotateLeft(matrix) {
  let result = [];
  for (let c = 3; c >= 0; c--) {
    let row = [];
    for (let r = 0; r < 4; r++) {
      row.push(matrix[r][c]);
    }
    result.push(row);
  }
  return result;
}

function rotateRight(matrix) {
  let result = [];
  for (let c = 0; c < 4; c++) {
    let row = [];
    for (let r = 3; r >= 0; r--) {
      row.push(matrix[r][c]);
    }
    result.push(row);
  }
  return result;
}

function moveLeft() {
  for (let r = 0; r < 4; r++) {
    boardArray[r] = slide(boardArray[r]);
  }
}

function moveRight() {
  for (let r = 0; r < 4; r++) {
    boardArray[r] = slide(boardArray[r].reverse()).reverse();
  }
}

function moveUp() {
  boardArray = rotateLeft(boardArray);
  moveLeft();
  boardArray = rotateRight(boardArray);
}

function moveDown() {
  boardArray = rotateLeft(boardArray);
  moveRight();
  boardArray = rotateRight(boardArray);
}

function hasChanged(oldBoard, newBoard) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (oldBoard[r][c] !== newBoard[r][c]) {
        return true;
      }
    }
  }
  return false;
}

function isGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (boardArray[r][c] === 0) return false;
      if (c < 3 && boardArray[r][c] === boardArray[r][c + 1]) return false;
      if (r < 3 && boardArray[r][c] === boardArray[r + 1][c]) return false;
    }
  }
  return true;
}

document.addEventListener("keydown", (e) => {
  let oldBoard = boardArray.map(row => row.slice());

  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
  else if (e.key === "ArrowUp") moveUp();
  else if (e.key === "ArrowDown") moveDown();

  if (hasChanged(oldBoard, boardArray)) {
    addNewTile();
    updateBoard();
    popSound.currentTime = 0;
    popSound.play();
  }

  if (isGameOver()) {
    alert("Game Over!");
  }
});

initBoard();
