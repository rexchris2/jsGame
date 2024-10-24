var gamePiece;
var bullets = [];
var enemies = [];
var enemySpeed = 1;
var enemiesKilled = 0;
var myScore;
var canFire = true;
var fireRate = 500;
var lastFireTime = 0;
var  bgMusic = new gameSound("dkmusic.mp3");
var startScreen;
var explosion = new gameSound("explosion2.mp3");
var gameoverSound = new gameSound("sonic_gameover.mp3");
var soundEffect = new gameSound("shoot.mp3");




function startGame() {
//Remove the start button when game start also restart aswell
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
//Background 
    background = new component(500, 500, "spaceBackground.jpg", 0, 0, "image");
    gamePiece = new component(30, 30, "ship6.png", 235, 425, "image");
    //When start game is pressed it resets the values used for Restart button
    bullets = [];
    enemies = [];
    enemySpeed = 1;
    enemiesKilled = 0;


    bgMusic.play();
    gameoverSound.stop();
    gameArea.start();
    setInterval(spawnEnemy, 3000);
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function (e) {
            gameArea.key = e.key;
            if (e.key === " ") {
                this.shootPressed = true;
            }
        })
        window.addEventListener('keyup', function (e) {
            gameArea.key = false;
            if (e.key === " ") {
                this.shootPressed = false;
            }
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
    },
    stop: function () {
        clearInterval(this.interval);
    }
}


//Game sounds func
function gameSound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = gameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
           if(type == "background")
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        //logic for canvas border
        if (this.x + this.width + this.speedX > gameArea.canvas.width || this.x + this.speedX < 0) {
            this.speedX = 0;
        }
        if (this.y + this.height + this.speedY > gameArea.canvas.height || this.y + this.speedY < 0) {
            this.speedY = 0;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.type == "background") {
            this.y += this.speedY;
            if (this.y >= this.height) {
              this.y = 0;
            }
          }
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

}


function spawnEnemy() {
    var randomXPos = Math.random() * (gameArea.canvas.width - 30);
    var enemy = new component(30, 30, "enemy.png", randomXPos, 0, "image");
    enemy.speedY = enemySpeed;
    enemies.push(enemy);

}


function shoot() {
    var bullet = new component(5, 10, "yellow", gamePiece.x + gamePiece.width / 2 - 2.5, gamePiece.y);
    bullet.speedY = -5;
    bullets.push(bullet);
    console.log("fired");
}

function handleShot() {
    let currentTime = new Date().getTime();

    if (currentTime - lastFireTime >= fireRate) {
        shoot();
        soundEffect.play();
        lastFireTime = currentTime;
    }
}
//Display enemies killed
function displayScore() {
    let ctx = gameArea.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white"
    ctx.fillText("Enemies Killed: " + enemiesKilled, 5, 20);

}

//When player dies display game over screen
function gameOverDisplay() {
    let over = gameArea.context;
    let score = gameArea.context;
    score.font = "20px Arial";
    score.fillStyle = "white";
    score.fillText("Enemies Killed: " + enemiesKilled, 180, 300);
    over.font = "90px Arial";
    over.fillStyle = "white";
    over.fillText("Game over!", 20, 220);
    document.getElementById('gameOver').style.display = 'block';
    gameoverSound.play();
}



function updateGameArea() {

    gameArea.clear();
    background.speedY = -3;
    background.newPos();
    background.update();
    gamePiece.newPos();
    gamePiece.update();


    gamePiece.speedX = 0;
    gamePiece.speedY = 0;


    if (gameArea.key && gameArea.key == "ArrowLeft") {
        gamePiece.speedX = -5;
    }
    if (gameArea.key && gameArea.key == "ArrowRight") {
        gamePiece.speedX = 5;
    }
    if (gameArea.key && gameArea.key == "ArrowUp") {
        gamePiece.speedY = -5;
    }
    if (gameArea.key && gameArea.key == "ArrowDown") {
        gamePiece.speedY = 5;
    }
    if (gameArea.key && gameArea.key == " ") {

        handleShot();
    }


    //Bullets
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].y += bullets[i].speedY;
        bullets[i].update();
        //Bullet collision
        for (var j = 0; j < enemies.length; j++) {
            if (bullets[i].crashWith(enemies[j])) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                enemiesKilled++;
                if (Math.floor(enemiesKilled) % 10 === 0) {
                    enemySpeed++;
                    console.log("Speed Increase");

                }
                    explosion.play();
                console.log("Killed: " + enemiesKilled);
                break;
            }
        }
    }
//Player colliosn
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speedY;
        enemies[i].update();
        if (gamePiece.crashWith(enemies[i])) {
                    explosion.play();
            console.log("Game Over");
            gameOverDisplay();
            bgMusic.stop();
            gameArea.stop();
            
            return;
        }

    }

    displayScore();


}
