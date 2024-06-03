const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basketWidth = 100;
const basketHeight = 20;
const basketSpeed = 7;
const objectRadius = 15;
const gravity = 3;
const maxMissedBalls = 5;

let basket = {
    x: canvas.width / 2 - basketWidth / 2,
    y: canvas.height - basketHeight - 10,
    width: basketWidth,
    height: basketHeight,
    dx: 0
};

let objects = [];
let score = 0;
let gameOver = false;
let missedBalls = 0;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    if (e.key === 'ArrowRight') {
        basket.dx = basketSpeed;
    } else if (e.key === 'ArrowLeft') {
        basket.dx = -basketSpeed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        basket.dx = 0;
    }
}

function createObject() {
    const x = Math.random() * (canvas.width - objectRadius * 2) + objectRadius;
    const isDangerous = Math.random() < 0.2;
    objects.push({ x: x, y: 0, radius: objectRadius, dangerous: isDangerous });
}

function drawBasket() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawObjects() {
    objects.forEach(object => {
        ctx.beginPath();
        ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
        ctx.fillStyle = object.dangerous ? 'red' : 'green';
        ctx.fill();
        ctx.closePath();
    });
}

function moveBasket() {
    basket.x += basket.dx;

    if (basket.x < 0) {
        basket.x = 0;
    }

    if (basket.x + basket.width > canvas.width) {
        basket.x = canvas.width - basket.width;
    }
}

function moveObjects() {
    objects.forEach(object => {
        object.y += gravity;
    });
}

function checkCollision() {
    objects = objects.filter(object => {
        if (
            object.y + object.radius > basket.y &&
            object.x > basket.x &&
            object.x < basket.x + basket.width
        ) {
            if (object.dangerous) {
                gameOver = true;
            } else {
                score++;
            }
            return false;
        }

        if (object.y - object.radius > canvas.height) {
            if (!object.dangerous) {
                missedBalls++;
                if (missedBalls >= maxMissedBalls) {
                    gameOver = true;
                }
            }
            return false;
        }

        return true;
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Missed Balls: ${missedBalls}/${maxMissedBalls}`, 10, 40);
}

function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    moveBasket();
    moveObjects();
    checkCollision();
    drawBasket();
    drawObjects();
    drawScore();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

function restartGame() {
    basket = {
        x: canvas.width / 2 - basketWidth / 2,
        y: canvas.height - basketHeight - 10,
        width: basketWidth,
        height: basketHeight,
        dx: 0
    };
    objects = [];
    score = 0;
    gameOver = false;
    missedBalls = 0;
    requestAnimationFrame(gameLoop);
}

// Create falling objects at intervals
setInterval(createObject, 1000);

requestAnimationFrame(gameLoop);
