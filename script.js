const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    STOP: 4,
}
let MOVE_INTERVAL = 120;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{ x: head.x, y: head.y }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake() {
    return {
        ...initHeadAndBody(),
        direction: initDirection(),
    }
}

function initSnakesnakeProperty() {
    return {
        life: 3,
        level: 1,
        score: 0,
        counter: 0,
    }
}

let snake = initSnake();
let snakeProp = initSnakesnakeProperty();
let apples = [{
        position: initPosition(),
    },
    {
        position: initPosition(),
    }
]
let extraLife = {
    position: initPosition(),
    visible: true,
    visibleCount: 0,
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawHead(ctx, x, y) {
    let img = document.getElementById('head');
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawBody(ctx, x, y) {
    let img = document.getElementById('body');
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore() {
    let scoreCanvas;
    scoreCanvas = document.getElementById("infoScore");
    scoreCanvas.innerHTML = snakeProp.score
}

// draw extra life
function drawExtraLife(ctx) {
    while (extraLife.position.y == 0 || wallCollision(extraLife.position.x, extraLife.position.y)) {
        extraLife.position = initPosition();
    }
    if (extraLife.visible) {
        var img = document.getElementById("life");
        ctx.drawImage(img, extraLife.position.x * CELL_SIZE, extraLife.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        extraLife.visibleCount++;
        if (extraLife.visibleCount == 10) {
            extraLife.visible = false;
        }
    } else {
        drawCell(ctx, extraLife.position.x, extraLife.position.y, "rgb(255,255,255,0)")
        extraLife.visibleCount--;
        if (extraLife.visibleCount == 0) {
            extraLife.visible = true;
        }
    }
}

// check prime number
function checkPrime() {
    let isPrime = true;
    if (snakeProp.score > 1) {
        for (let i = 2; i < snakeProp.score; i++) {
            if (snakeProp.score % i == 0) {
                isPrime = false;
                break;
            }
        }
        return isPrime;
    }
}

function drawBG() {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    for (var j = 0; j < HEIGHT; j -= -1) {
        for (var i = 0; i < WIDTH; i -= -1) {
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    ctx.fillStyle = "#";
                } else { ctx.fillStyle = "#" }
            } else if (i % 2 == 1) {
                if (j % 2 == 1) {
                    ctx.fillStyle = "#";
                } else { ctx.fillStyle = "#FFF9E3" }
            }
            ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = "brown";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1 * CELL_SIZE, y1 * CELL_SIZE);
    ctx.lineTo(x2 * CELL_SIZE, y2 * CELL_SIZE);
    ctx.stroke();
}

let walls = []

//sound effect lvl-up
function soundlvl() {
    var lvlup = new Audio('assets/lvl-up.mp3');
    lvlup.play();
}

function display() {
    document.getElementById("infoLevel").innerHTML = snakeProp.level;
    document.getElementById("infoSpeed").innerHTML = MOVE_INTERVAL;
}

// add level
function levelUp() {
    if (snakeProp.score == 0 && snakeProp.counter == 0) {
        display();
        snakeProp.counter++;
    } else if (snakeProp.score == 5 && snakeProp.counter == 1) {
        alert("Level 1 Complete");
        soundlvl();
        snakeProp.level = 2;
        MOVE_INTERVAL = 100;
        display();
        walls[0] = { x1: 15, y1: 5, x2: 15, y2: 25 };
        snakeProp.counter++;
    } else if (snakeProp.score == 10 && snakeProp.counter == 2) {
        alert("Level 2 Complete");
        soundlvl();
        snakeProp.level = 3;
        MOVE_INTERVAL = 80;
        display();
        walls[0] = { x1: 5, y1: 10, x2: 25, y2: 10 };
        walls[1] = { x1: 5, y1: 20, x2: 25, y2: 20 };
        snakeProp.counter++;
    } else if (snakeProp.score == 15 && snakeProp.counter == 3) {
        alert("Level 3 Complete");
        soundlvl();
        snakeProp.level = 4;
        MOVE_INTERVAL = 65;
        display();
        walls[0] = { x1: 5, y1: 5, x2: 25, y2: 5 };
        walls[1] = { x1: 5, y1: 15, x2: 25, y2: 15 };
        walls[2] = { x1: 5, y1: 25, x2: 25, y2: 25 };
        snakeProp.counter++;
    } else if (snakeProp.score == 20 && snakeProp.counter == 4) {
        alert("Level 4 Complete");
        soundlvl();
        snakeProp.level = 5;
        MOVE_INTERVAL = 50;
        display();
        walls[0] = { x1: 10, y1: 5, x2: 20, y2: 5 };
        walls[1] = { x1: 5, y1: 10, x2: 5, y2: 20 };
        walls[2] = { x1: 10, y1: 25, x2: 20, y2: 25 };
        walls[3] = { x1: 25, y1: 10, x2: 25, y2: 20 };
        snakeProp.counter++;
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawBG();
        drawHead(ctx, snake.head.x, snake.head.y);
        for (let i = 1; i < snake.body.length; i++) {
            drawBody(ctx, snake.body[i].x, snake.body[i].y);
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            while (apple.position.y == 0 || wallCollision(apple.position.x, apple.position.y)) {
                apple.position = initPosition();
            }
            // Soal no 3: DrawImage apple dan gunakan image id:
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        // display life
        for (let i = 0; i < snakeProp.life; i++) {
            var img = document.getElementById("life");
            ctx.drawImage(img, i * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
        }

        // display extra life
        if (checkPrime()) {
            drawExtraLife(ctx);
        }

        // display walls
        if (snakeProp.level > 1) {
            for (i = 0; i < snakeProp.level - 1; i++) {
                drawLine(ctx, walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
            }
        }

        levelUp();
        drawScore();
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            var audio = new Audio('assets/eating.mp3');
            audio.play();
            apple.position = initPosition();
            snakeProp.score++;
            snake.body.push({ x: snake.head.x, y: snake.head.y });
        }
    }
    eatExtraLife();
}


// eat extra life
function eatExtraLife() {
    if (snake.head.x == extraLife.position.x && snake.head.y == extraLife.position.y) {
        extraLife.position = initPosition();
        snakeProp.life++;
        snakeProp.score++;
        var ExtraLife = new Audio('assets/extra-life.mp3');
        ExtraLife.play();
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
}

// check wall collision
function wallCollision(x, y) {
    let isCollide = false;

    if (snakeProp.level > 1) {
        for (let i = 0; i < snakeProp.level - 1; i++) {
            if (x == walls[i].x1 && y >= walls[i].y1 && y < walls[i].y2 || y == walls[i].y1 && x >= walls[i].x1 && x < walls[i].x2) {
                isCollide = true;
            }
        }
    }
    return isCollide;
}

// check body collision
function selfCollision(snakes) {
    let isCollide = false;

    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (wallCollision(snake.head.x, snake.head.y)) {
        isCollide = true;
        var hitwall = new Audio('assets/hit-wall.mp3');
        hitwall.play();
    }
    if (isCollide) {
        var audio = new Audio('assets/game-over.mp3');
        audio.play();
        snake = initSnake("purple");
        snakeProp.life--;
        if (snakeProp.life == 0) {
            alert("Game Over");
            snake = initSnake();
            snakeProp = initSnakesnakeProperty();
            MOVE_INTERVAL = 120;
        }
    }
    return isCollide;
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            moveBody(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            moveBody(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            moveBody(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            moveBody(snake);
            break;
    }
    if (!selfCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

let storeDir;

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        turn(snake, DIRECTION.LEFT);
        document.getElementById("buttonLeft").classList.add("active");
    } else if (event.key === "ArrowRight" || event.key === "d") {
        turn(snake, DIRECTION.RIGHT);
        document.getElementById("buttonRight").classList.add("active");
    } else if (event.key === "ArrowUp" || event.key === "w") {
        turn(snake, DIRECTION.UP);
        document.getElementById("buttonUp").classList.add("active");
    } else if (event.key === "ArrowDown" || event.key === "s") {
        turn(snake, DIRECTION.DOWN);
        document.getElementById("buttonDown").classList.add("active");
    } else if (event.key === ' ') {
        document.getElementById("buttonPause").classList.add("active");
        if (snake.direction !== DIRECTION.STOP) {
            storeDir = snake.direction;
            snake.direction = DIRECTION.STOP;
        } else {
            snake.direction = storeDir;
        }
    }
})

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        document.getElementById("buttonLeft").classList.remove("active");
    } else if (event.key === "ArrowRight" || event.key === "d") {
        document.getElementById("buttonRight").classList.remove("active");
    } else if (event.key === "ArrowUp" || event.key === "w") {
        document.getElementById("buttonUp").classList.remove("active");
    } else if (event.key === "ArrowDown" || event.key === "s") {
        document.getElementById("buttonDown").classList.remove("active");
    } else if (event.key === ' ') {
        document.getElementById("buttonPause").classList.remove("active");
    }
})

document.addEventListener("mousedown", function(event) {
    if (event.path[0].id === "buttonLeft") {
        turn(snake, DIRECTION.LEFT);
        document.getElementById("buttonLeft").classList.add("active");
    } else if (event.path[0].id === "buttonRight") {
        turn(snake, DIRECTION.RIGHT);
        document.getElementById("buttonRight").classList.add("active");
    } else if (event.path[0].id === "buttonUp") {
        turn(snake, DIRECTION.UP);
        document.getElementById("buttonUp").classList.add("active");
    } else if (event.path[0].id === "buttonDown") {
        turn(snake, DIRECTION.DOWN);
        document.getElementById("buttonDown").classList.add("active");
    } else if (event.path[0].id === "buttonPause") {
        document.getElementById("buttonPause").classList.add("active");
        if (snake.direction !== DIRECTION.STOP) {
            storeDir = snake.direction;
            snake.direction = DIRECTION.STOP;
        } else {
            snake.direction = storeDir;
        }
    }
})

document.addEventListener("mouseup", function(event) {
    if (event.path[0].id === "buttonLeft") {
        turn(snake, DIRECTION.LEFT);
        document.getElementById("buttonLeft").classList.remove("active");
    } else if (event.path[0].id === "buttonRight") {
        turn(snake, DIRECTION.RIGHT);
        document.getElementById("buttonRight").classList.remove("active");
    } else if (event.path[0].id === "buttonUp") {
        turn(snake, DIRECTION.UP);
        document.getElementById("buttonUp").classList.remove("active");
    } else if (event.path[0].id === "buttonDown") {
        turn(snake, DIRECTION.DOWN);
        document.getElementById("buttonDown").classList.remove("active");
    } else if (event.path[0].id === "buttonPause") {
        document.getElementById("buttonPause").classList.remove("active");
    }
})

function initGame() {
    move(snake);
}

initGame();