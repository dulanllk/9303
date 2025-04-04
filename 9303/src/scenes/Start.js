// /Project_Folder/src/scenes/Start.js
export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
        this.playerName = '';
        this.gameStarted = false;
        this.gameOver = false;
        this.obstacleSpeed = 5;
        this.obstacleSpawnRate = 1500;
        this.obstacleTimer = null;
        this.obstacles = null;
        this.ship = null;
        this.winPoint = null;
        this.score = 0;
        this.scoreText = null;
        this.gameDuration = 0;
        this.elapsedTime = 0;
        this.timerText = null;
        this.randomNumberText = null;
        this.cursors = null;
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('winPoint', 'assets/flag.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background').setVisible(false);
        const logo = this.add.image(640, 200, 'logo');

        this.ship = this.physics.add.sprite(150, 360, 'ship').setVisible(false);
        this.ship.setCollideWorldBounds(true);
        this.ship.setOrigin(0, 0.5);
        this.ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1,
        });
        this.ship.play('fly');

        this.obstacles = this.physics.add.group();
        this.winPoint = this.physics.add.image(1200, Phaser.Math.Between(100, 600), 'winPoint').setVisible(false);
        this.winPoint.setImmovable(true);
        this.winPoint.setScale(0.5);

        this.physics.add.overlap(this.ship, this.winPoint, this.winGame, null, this);
        this.physics.add.overlap(this.ship, this.obstacles, this.hitObstacle, null, this);

        this.scoreText = this.add.text(10, 10, `Name: ${this.playerName} Score: 0`, { fontSize: '32px', fill: '#fff' }).setVisible(false);
        this.timerText = this.add.text(10, 50, `Time: ${this.elapsedTime}s`, { fontSize: '32px', fill: '#fff' }).setVisible(false);
        this.randomNumberText = this.add.text(10, 90, `Game Duration: `, { fontSize: '32px', fill: '#fff' }).setVisible(false);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.loginButton = this.add.text(100, 600, 'Login', { fontSize: '32px', fill: '#fff' }).setInteractive();
        this.registerButton = this.add.text(250, 600, 'Register', { fontSize: '32px', fill: '#fff' }).setInteractive();

        this.loginButton.on('pointerdown', () => this.showLogin());
        this.registerButton.on('pointerdown', () => this.showRegister());

        this.token = localStorage.getItem('token');
        this.playerName = localStorage.getItem('playerName');

        if (this.token && this.playerName) {
            this.gameStarted = true;
            this.startGame();
        }
    }

    update() {
        if (this.gameOver || !this.gameStarted) return;
        this.background.tilePositionX += 2;
        this.obstacles.getChildren().forEach((obstacle) => {
            obstacle.x -= this.obstacleSpeed;
            if (obstacle.x < -50) {
                obstacle.destroy();
                this.score += 1;
                this.scoreText.setText(`Name: ${this.playerName} Score: ${this.score}`);
            }
        });

        if (this.cursors.up.isDown) {
            this.ship.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.ship.setVelocityY(200);
        } else {
            this.ship.setVelocityY(0);
        }

        if (this.cursors.left.isDown) {
            this.ship.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.ship.setVelocityX(200);
        } else {
            this.ship.setVelocityX(0);
        }
    }

    getGameDuration() {
        const bananaApiUrl = 'https://marcconrad.com/uob/banana/api.php';
        fetch(bananaApiUrl)
            .then(response => response.text())
            .then(text => {
                console.log("Banana API Data:", text);
                const randomNumber = parseInt(text.match(/\d+/));
                if (!isNaN(randomNumber) && randomNumber >= 5 && randomNumber <= 9) {
                    this.gameDuration = randomNumber * 4;
                    this.randomNumberText.setText(`Game Duration: ${this.gameDuration}`);
                    this.startGameLogic();
                } else {
                    this.getGameDuration();
                }
            })
            .catch(error => {
                this.gameOver = true;
                this.add.text(640, 360, `Error fetching data: ${error}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            });
    }

    startGame() {
        this.loginButton.setVisible(false);
        this.registerButton.setVisible(false);
        this.background.setVisible(true);
        this.ship.setVisible(true);
        this.winPoint.setVisible(true);
        this.scoreText.setVisible(true);
        this.timerText.setVisible(true);
        this.randomNumberText.setVisible(true);
        this.getGameDuration();
    }

    startGameLogic() {
        this.obstacleTimer = this.time.addEvent({
            delay: this.obstacleSpawnRate,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true,
        });

        this.intervalId = setInterval(() => {
            this.elapsedTime++;
            this.timerText.setText(`Time: ${this.elapsedTime}s`);
            if (this.elapsedTime >= this.gameDuration) {
                this.handleGameOver();
            }
        }, 1000);
    }

    handleGameOver() {
        this.gameOver = true;
        this.physics.pause();
        this.add.text(640, 360, 'Game Over!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        clearInterval(this.intervalId);
        this.obstacleTimer.remove();
    }

    spawnObstacle() {
        if (this.gameOver) return;
        const obstacleY = Phaser.Math.Between(50, 600);
        const obstacle = this.obstacles.create(1300, obstacleY, 'obstacle');
        obstacle.setVelocityX(-this.obstacleSpeed);
        obstacle.setImmovable(true);
        obstacle.setScale(0.5);
    }

    hitObstacle() {
        this.gameOver = true;
        this.physics.pause();
        this.ship.setTint(0xff0000);
        this.add.text(640, 360, 'Game Over! You hit an obstacle!', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5);
        clearInterval(this.intervalId);
        this.obstacleTimer.remove();
    }

    winGame() {
        this.gameOver = true;
        this.physics.pause();
        this.add.text(640, 360, 'You Win!', { fontSize: '64px', fill: '#0f0' }).setOrigin(0.5);
        clearInterval(this.intervalId);
        this.obstacleTimer.remove();
    }

    showLogin() {
        const name = prompt('Enter your name:');
        const password = prompt('Enter your password:');
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.auth) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('playerName', name);
                this.playerName = name; // set the playerName
                this.gameStarted = true;
                this.startGame();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            alert('An error occurred during login. Please try again.');
        });
    }

    showRegister() {
        const name = prompt('Enter your name:');
        const password = prompt('Enter your password:');
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if(data.message === "User registered successfully."){
                this.showLogin();
            }
        });
    }
}