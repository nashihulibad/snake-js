const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;

const DIRECTION = {
  STOP: -1,
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
const MOVE_INTERVAL = 150;

var wallX = [];
var wallY = [];
var levelWall2 = [
  {
    x1: 8,
    x2: 22,
    y: 10,
  },
  {
    x1: 8,
    x2: 22,
    y: 5,
  },
];
var levelWall3 = [
  {
    x1: 8,
    x2: 22,
    y: 15,
  },
];
var levelWall4 = [
  {
    x1: 8,
    x2: 22,
    y: 20,
  },
];
var levelWall5 = [
  {
    x1: 8,
    x2: 22,
    y: 25,
  },
];
var level = 1;
var isWin = 0;
var isPlay = 0;
var upLevel = 0;
var overAudio = new Audio("assets/over.wav");
var levelAudio = new Audio("assets/level.wav");

let snake1 = {
  color: "orange",
  position: initPosition(),
  direction: initDirection(),
  score: 0,
  move: 200,
  health: 3,
  body: [{ x: 0, y: 0 }],
};

let apple1 = {
  color: "red",
  position: initPosition(),
};

let apple2 = {
  color: "red",
  position: initPosition(),
};

let appleHealth = {
  color: "green",
  position: {
    x: -1,
    y: -1,
  },
};

function getStarted() {
  snake1.score = 0;
  level = 1;
  wallX = [];
  wallY = [];
}

function initWall2() {
  for (let i = 0; i < levelWall2.length; i++) {
    for (let j = levelWall2[i].x1; j <= levelWall2[i].x2; j++) {
      wallX.push(j);
      wallY.push(levelWall2[i].y);
    }
  }
}

function initWall3() {
  for (let i = 0; i < levelWall3.length; i++) {
    for (let j = levelWall3[i].x1; j <= levelWall3[i].x2; j++) {
      wallX.push(j);
      wallY.push(levelWall3[i].y);
    }
  }
}

function initWall4() {
  for (let i = 0; i < levelWall4.length; i++) {
    for (let j = levelWall4[i].x1; j <= levelWall4[i].x2; j++) {
      wallX.push(j);
      wallY.push(levelWall4[i].y);
    }
  }
}

function initWall5() {
  for (let i = 0; i < levelWall5.length; i++) {
    for (let j = levelWall5[i].x1; j <= levelWall5[i].x2; j++) {
      wallX.push(j);
      wallY.push(levelWall5[i].y);
    }
  }
}

function createWall() {
  let wallCanvas = document.getElementById("snakeBoard");
  let ctx = wallCanvas.getContext("2d");
  for (let i = 0; i < wallX.length; i++) {
    drawCell(ctx, wallX[i], wallY[i], "#808080");
  }
}

function hitTheWall(snake) {
  for (let i = 0; i < wallX.length; i++) {
    if (
      snake.position.x === wallX[i] &&
      (snake.direction == 2 || snake.direction == 3)
    ) {
      if (
        snake.position.y - 1 === wallY[i] ||
        snake.position.y + 1 === wallY[i]
      ) {
        overAudio.play();
        if (snake.health === 0) {
          getStarted();
        } else {
          snake.health--;
        }
        stop(snake);
      }
    }

    if (
      snake.position.y === wallY[i] &&
      (snake.direction == 0 || snake.direction == 1)
    ) {
      if (
        snake.position.x - 1 === wallX[i] ||
        snake.position.x + 1 === wallX[i]
      ) {
        overAudio.play();
        if (snake.health === 0) {
          getStarted();
        } else {
          snake.health--;
        }
        stop(snake);
      }
    }
  }
}

function initPosition() {
  xTemp = Math.floor(Math.random() * WIDTH);
  yTemp = Math.floor(Math.random() * HEIGHT);
  if (level > 1) {
    if (yTemp % 5 == 0) {
      yTemp++;
    }
  }
  return {
    x: xTemp,
    y: yTemp,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas;
  scoreCanvas = document.getElementById("score1Board");
  let scoreCtx = scoreCanvas.getContext("2d");
  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "20px Poppins";
  scoreCtx.fillStyle = "#809bce";
  scoreCtx.fillText("SCORE : " + snake.score, 20, scoreCanvas.scrollHeight / 2);
}

function drawFast(snake) {
  let fastCanvas;
  fastCanvas = document.getElementById("fastBoard");
  let fastCtx = fastCanvas.getContext("2d");
  fastCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  fastCtx.font = "20px Poppins";
  fastCtx.fillStyle = "#8A2BE2";
  let fast = snake.move;
  fastCtx.fillText("FAST : " + fast, 10, fastCanvas.scrollHeight / 2);
}

function drawHealth(snake) {
  let healthCanvas;
  healthCanvas = document.getElementById("health");
  let healthCtx = healthCanvas.getContext("2d");
  healthCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  healthCtx.font = "20px Poppins";
  healthCtx.fillStyle = "#7CFC00";
  healthCtx.fillText(
    "LIFES : " + snake.health,
    25,
    healthCanvas.scrollHeight / 2
  );
}

function drawLevel() {
  let levelCanvas;
  levelCanvas = document.getElementById("levelBoard");
  let levelCtx = levelCanvas.getContext("2d");
  levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  levelCtx.font = "20px Poppins";
  levelCtx.fillStyle = "#20B2AA";
  levelCtx.fillText("LEVEL : " + level, 25, levelCanvas.scrollHeight / 2);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    let snake = document.getElementById("snake");
    ctx.drawImage(
      snake,
      snake1.position.x * CELL_SIZE,
      snake1.position.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    for (let i = 1; i < snake1.score; i++) {
      ctx.drawImage(
        snake,
        snake1.body[i].x * CELL_SIZE,
        snake1.body[i].y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    let apple = document.getElementById("apple");
    ctx.drawImage(
      apple,
      apple1.position.x * CELL_SIZE,
      apple1.position.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    ctx.drawImage(
      apple,
      apple2.position.x * CELL_SIZE,
      apple2.position.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    let health = document.getElementById("appleHealth");
    ctx.drawImage(
      health,
      appleHealth.position.x * CELL_SIZE,
      appleHealth.position.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    createWall();
    drawScore(snake1);
    drawHealth(snake1);
    drawFast(snake1);
    drawLevel();
    if (upLevel == 1) {
      upLevel = 0;
      if (level <= 5) {
        alert("level up to : " + level);
      }
    }
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.position.x < 0) {
    snake.position.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.position.x >= WIDTH) {
    snake.position.x = 0;
  }
  if (snake.position.y < 0) {
    snake.position.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.position.y >= HEIGHT) {
    snake.position.y = 0;
  }
}

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++)
    if (num % i === 0) return false;
  return num > 1;
}

function eat(snake) {
  if (
    snake.position.x == apple1.position.x &&
    snake.position.y == apple1.position.y
  ) {
    apple1.position = initPosition();
    snake.score++;
    snake.body.push({ x: snake.position.x, y: snake.position.y });

    if (snake.score === 25) {
      levelAudio.play();
      isWin = 1;
      stop(snake);
      return;
    }

    if (snake.score % 5 == 0 && snake.score != 0) {
      snake.move -= 20;
      levelAudio.play();
      nextLevel(snake);
    }

    if (isPrime(snake.score) === true) {
      appleHealth.position = initPosition();
    }
  }

  if (
    snake.position.x == apple2.position.x &&
    snake.position.y == apple2.position.y
  ) {
    apple2.position = initPosition();
    snake.score++;
    snake.body.push({ x: snake.position.x, y: snake.position.y });

    if (snake.score === 25) {
      levelAudio.play();
      isWin = 1;
      stop(snake);
      return;
    }

    if (snake.score % 5 == 0 && snake.score != 0) {
      snake.move -= 20;
      levelAudio.play();
      nextLevel(snake);
    }

    if (isPrime(snake.score) === true) {
      appleHealth.position = initPosition();
    }
  }

  if (
    snake.position.x == appleHealth.position.x &&
    snake.position.y == appleHealth.position.y
  ) {
    appleHealth.position.x = -1;
    appleHealth.position.y = -1;
    snake.health++;
    snake.score++;
    snake.body.push({ x: snake.position.x, y: snake.position.y });

    if (snake.score === 25) {
      levelAudio.play();
      isWin = 1;
      stop(snake);
      return;
    }

    if (snake.score % 5 == 0 && snake.score != 0) {
      snake.move -= 20;
      levelAudio.play();
      nextLevel(snake);
    }
    if (isPrime(snake.score) === true) {
      appleHealth.position = initPosition();
    }
  }
}

function nextLevel(snake) {
  level++;
  if (level == 2) {
    initWall2();
  } else if (level == 3) {
    initWall3();
  } else if (level == 4) {
    initWall4();
  } else if (level == 5) {
    initWall5();
  }
  snake.position = initPosition();
  snake.health += 3;
  stop(snake1);
  upLevel = 1;
}

function moveLeft(snake) {
  snake.position.x--;
  teleport(snake);
  eat(snake);
  hitTheWall(snake);
}

function moveRight(snake) {
  snake.position.x++;
  teleport(snake);
  eat(snake);
  hitTheWall(snake);
}

function moveDown(snake) {
  snake.position.y++;
  teleport(snake);
  eat(snake);
  hitTheWall(snake);
}

function moveUp(snake) {
  snake.position.y--;
  teleport(snake);
  eat(snake);
  hitTheWall(snake);
}

function stop(snake) {
  snake.direction = DIRECTION.STOP;
}

function move(snake) {
  if (isWin == 1) {
    alert("you win");
    return;
  }
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
    case DIRECTION.STOP:
      break;
  }
  moveBody(snake);
  setTimeout(function () {
    move(snake);
  }, snake.move);
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.position.x, y: snake.position.y });
  snake.body.pop();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    snake1.direction = DIRECTION.LEFT;
  } else if (event.key === "ArrowRight") {
    snake1.direction = DIRECTION.RIGHT;
  } else if (event.key === "ArrowUp") {
    snake1.direction = DIRECTION.UP;
  } else if (event.key === "ArrowDown") {
    snake1.direction = DIRECTION.DOWN;
  }
});

function play() {
  if (isPlay == 1) {
    return;
  }
  isPlay = 1;
  move(snake1);
}
