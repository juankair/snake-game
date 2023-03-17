const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const blockSize = 20;
const snakeColor = "#4CAF50";
const foodColor = "#F44336";
const levelUpScore = 5;

let snake;
let food;
let score;
let level;
let isGameOver;
let gameInterval;


// function startGame() {
//     snake = createSnake();
//     food = createFood();
//     score = 0;
//     level = 1;
//     isGameOver = false;
//     gameInterval = setInterval(update, 100);
// }
function startGame() {
    document.getElementById("menu").style.display = "none";
    snake = createSnake();
    food = createFood();
    score = 0;
    level = 1;
    isGameOver = false;
    gameInterval = setInterval(update, 100);
}

// Add an event listener for the "Start Game" button
document.getElementById("startGame").addEventListener("click", startGame);


function update() {
    moveSnake();
    checkCollision();
    checkLevel();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = snakeColor;
    for (const block of snake) {
        ctx.beginPath();
        ctx.arc(block.x + blockSize / 2, block.y + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, blockSize, blockSize);

    // Draw score and level
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Level: " + level, 10, 40);
}

function createSnake() {
    const startPoint = Math.floor(canvas.width / (2 * blockSize)) * blockSize;
    const initialSnake = [
        { x: startPoint, y: startPoint },
        { x: startPoint - blockSize, y: startPoint },
        { x: startPoint - 2 * blockSize, y: startPoint },
    ];
    initialSnake.direction = "right";
    return initialSnake;
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (snake.direction) {
        case "up":
            head.y -= blockSize;
            if (head.y < 0) {
                head.y = canvas.height - blockSize;
            }
            break;
        case "down":
            head.y += blockSize;
            if (head.y >= canvas.height) {
                head.y = 0;
            }
            break;
        case "left":
            head.x -= blockSize;
            if (head.x < 0) {
                head.x = canvas.width - blockSize;
            }
            break;
        case "right":
            head.x += blockSize;
            if (head.x >= canvas.width) {
                head.x = 0;
            }
            break;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = createFood();
    } else {
        snake.pop();
    }
}

function createFood() {
    const position = {
        x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
        y: Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize,
    };

    for (const block of snake) {
        if (block.x === position.x && block.y === position.y) {
            return createFood(); // New position if food overlaps with snake
        }
    }
    return position;
}

function checkCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        gameOver();
    }
    

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function checkLevel() {
    level = Math.floor(score / levelUpScore) + 1;
    clearInterval(gameInterval);
    gameInterval = setInterval(update, 100 / level);
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText("Press Enter to restart", canvas.width / 2 - 95, canvas.height / 2 + 40);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && isGameOver) {
            startGame();
        }
    });
}
document.addEventListener("keydown", (e) => {
    const directions = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
    };

    const newDirection = directions[e.key];
    if (!newDirection) {
        return;
    }

    const { length } = snake;
    const { direction } = snake;
    const oppositeDirections = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
    };

    if (oppositeDirections[newDirection] !== direction) {
        snake.direction = newDirection;
    }
});


startGame();