class Obstacle {
  constructor() {
    this.height = 30;
    this.width = this.randBetween(100, 200);
    this.y = 0;
    this.x = this.randBetween(75, 375 - this.width);

    this.moveIntervalId = setInterval(this.move, 50);
  }

  move = () => {
    this.y += 10;
  };

  stop = () => {
    clearInterval(this.moveIntervalId);
  };

  randBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  let gameRunning = false;

  let road;
  let car;
  let carWidth;
  let carHeight;
  let carX = 225;
  let carY = 500;

  let obstacles = [];
  let obstaclesIntervalId;

  let score = 0;

  function loadRoad() {
    road = new Image();
    road.onload = drawRoad;
    road.src = 'images/road.png';
  }

  function drawRoad() {
    ctx.drawImage(road, 0, 0, 500, 700);
  }

  function loadCar() {
    car = new Image();
    car.onload = () => {
      carWidth = 50;
      carHeight = (50 / car.width) * car.height;
      drawCar();
    };
    car.src = 'images/car.png';
  }

  function drawCar() {
    ctx.drawImage(car, carX, carY, 50, (50 / car.width) * car.height);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameRunning) return drawGameOver();

    checkCollision();
    drawRoad();
    drawCar();
    drawObstacles();
    drawScore();

    requestAnimationFrame(animate);
  }

  function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
      checkCollisionWithObstacle(obstacles[i]);
    }
  }

  function checkCollisionWithObstacle(obstacle) {
    if (
      !(
        carY + carHeight < obstacle.y ||
        carY > obstacle.y + obstacle.height ||
        carX > obstacle.x + obstacle.width ||
        carX + carWidth < obstacle.x
      )
    ) {
      gameOver();
    }
  }

  function gameOver() {
    gameRunning = false;

    clearInterval(obstaclesIntervalId);
    obstacles = [];
  }

  function createObstacle() {
    obstacles.push(new Obstacle());
  }

  function drawScore() {
    ctx.font = '40px Georgia';
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE: ' + score, 75, 75);
  }

  function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '50px Georgia';
    ctx.fillText('GAME OVER', 50, 250);
    ctx.fillStyle = 'blue';
    ctx.fillText('SCORE: ' + score, 50, 325);

    score = 0;
  }

  function drawObstacles() {
    ctx.fillStyle = 'red';

    for (let i = 0; i < obstacles.length; i++) {
      if (obstacles[i].y > carY + carHeight) {
        obstacles[i].stop();
        obstacles.splice(i, 1);
        score++;
        continue;
      }

      ctx.fillRect(
        obstacles[i].x,
        obstacles[i].y,
        obstacles[i].width,
        obstacles[i].height
      );
    }
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;

    loadRoad();
    loadCar();

    createObstacle();
    obstaclesIntervalId = setInterval(createObstacle, 2000);

    document.onkeydown = moveCar;
    animate();
  }

  function moveCar(e) {
    // left
    if (e.keyCode == '37' && carX >= 75) {
      carX -= 10;
    }
    // right
    else if (e.keyCode == '39' && carX <= 375) {
      carX += 10;
    }
  }
};
