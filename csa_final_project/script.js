const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const gameOverMessage = document.getElementById("game-over-message");

const TILE_SIZE = 75;
const GAP = 5;
const BOARD_SIZE = 4;

let score = 0;
let tiles = [];

function positionToPixels(pos) {
  return pos * (TILE_SIZE + GAP) + GAP;
}

function createTile(row, col, value) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.style.top = positionToPixels(row) + "px";
  tile.style.left = positionToPixels(col) + "px";
  tile.setAttribute("data-value", value);
  tile.innerText = value;
  gridContainer.appendChild(tile);
  return { el: tile, row, col, value };
}

function createBoard() {
  tiles.forEach(t => gridContainer.removeChild(t.el));
  tiles = [];
  score = 0;
  scoreDisplay.innerText = "Score: 0";

  addRandomTile();
  addRandomTile();
  renderTiles();
}

function addRandomTile() {
  const emptyPositions = [];
  for(let r=0; r<BOARD_SIZE; r++) {
    for(let c=0; c<BOARD_SIZE; c++) {
      if (!tiles.find(t => t.row === r && t.col === c)) {
        emptyPositions.push({r, c});
      }
    }
  }
  if(emptyPositions.length === 0) return;

  const {r, c} = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() > 0.5 ? 4 : 2;
  tiles.push(createTile(r, c, value));
}

function renderTiles() {
  tiles.forEach(t => {
    t.el.style.top = positionToPixels(t.row) + "px";
    t.el.style.left = positionToPixels(t.col) + "px";
    t.el.setAttribute("data-value", t.value);
    t.el.innerText = t.value;
  });
}

function move(direction) {
  let hasMoved = false;

  function getTile(row, col) {
    return tiles.find(t => t.row === row && t.col === col);
  }

  const range = [...Array(BOARD_SIZE).keys()];
  let rows = range, cols = range;
  if(direction === "down") rows = range.slice().reverse();
  if(direction === "right") cols = range.slice().reverse();

  const mergedPositions = new Set();

  for (let r of rows) {
    for (let c of cols) {
      const tile = getTile(r, c);
      if (!tile) continue;

      let newRow = r;
      let newCol = c;

      while(true) {
        let nextRow = newRow + (direction === "down" ? 1 : direction === "up" ? -1 : 0);
        let nextCol = newCol + (direction === "right" ? 1 : direction === "left" ? -1 : 0);

        if(nextRow < 0 || nextRow >= BOARD_SIZE || nextCol < 0 || nextCol >= BOARD_SIZE) break;

        let nextTile = getTile(nextRow, nextCol);

        if(!nextTile) {
          newRow = nextRow;
          newCol = nextCol;
          hasMoved = true;
        }
        else if(nextTile.value === tile.value && !mergedPositions.has(nextRow + "," + nextCol)) {
          newRow = nextRow;
          newCol = nextCol;
          mergedPositions.add(newRow + "," + newCol);
          hasMoved = true;
          break;
        }
        else break;
      }

      if(newRow !== r || newCol !== c) {
        let targetTile = getTile(newRow, newCol);
        if(targetTile) {
          targetTile.value *= 2;
          score += targetTile.value;
          scoreDisplay.innerText = "Score: " + score;

          gridContainer.removeChild(tile.el);
          tiles = tiles.filter(t => t !== tile);
        } else {
          tile.row = newRow;
          tile.col = newCol;
        }
      }
    }
  }

  if(hasMoved) {
    addRandomTile();
    renderTiles();
    checkWin();
    checkGameOver();
  }
}

function checkWin() {
  if (tiles.some(t => t.value === 2048)) {
    alert("🎉 You Win! 🎉");
  }
}

function checkGameOver() {
  let hasEmpty = tiles.some(tile => tile.innerText === "");
  if (hasEmpty) return false;

  const getIndex = (r, c) => r * 4 + c;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const i = getIndex(r, c);
      const value = tiles[i].innerText;

      const right = c < 3 ? tiles[getIndex(r, c + 1)].innerText : null;
      const down = r < 3 ? tiles[getIndex(r + 1, c)].innerText : null;

      if (value === right || value === down) {
        return false;
      }
    }
  }

  gameOverMessage.classList.add("show");
  return true;
}


document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": e.preventDefault(); move("up"); break;
    case "ArrowDown": e.preventDefault(); move("down"); break;
    case "ArrowLeft": e.preventDefault(); move("left"); break;
    case "ArrowRight": e.preventDefault(); move("right"); break;
  }
});

restartBtn.addEventListener("click", () => {
  score = 0;
  scoreDisplay.innerText = "Score: 0";
  winMessage.classList.remove("show");
  gameOverMessage.classList.remove("show");
  createBoard();
});

createBoard();
