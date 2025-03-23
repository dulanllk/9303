export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
        this.obstacleSpeed = 1;
        this.obstacleSpawnRate = 1500;
        this.obstacleTimer = null;
        this.obstacles = null;
        this.ship = null;
        this.winPoint = null;
        this.score = 0;
        this.scoreText = null;
        this.gameOver = false;
        this.playerName = ''; // Store player name
        this.gameStarted = false; // Track if the game has started
    }

    preload() {
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        this.load.image('obstacle', 'assets/obstacle.png', { frameWidth: 50, frameHeight: 50 });
        this.load.image('winPoint', 'assets/flag.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        const logo = this.add.image(640, 200, 'logo');

        this.ship = this.physics.add.sprite(150, 360, 'ship');
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

        //  Overlap wasn't precise enough, switch to collider
        this.physics.add.collider(this.ship, this.obstacles, this.hitObstacle, null, this);

        this.winPoint = this.physics.add.image(1200, Phaser.Math.Between(100, 600), 'winPoint');
        this.winPoint.setImmovable(true);
        this.winPoint.setScale(0.5);

        this.physics.add.overlap(this.ship, this.winPoint, this.winGame, null, this);

        // Display score text, initially with empty name
        this.scoreText = this.add.text(10, 10, `Name: ${this.playerName}  Score: 0`, { fontSize: '32px', fill: '#fff' });

        // Prompt for player name at the start of the game
        this.playerName = prompt("Please enter your name:");
        if (this.playerName && this.playerName.trim() !== "") {
            this.gameStarted = true;
            this.scoreText.setText(`Name: ${this.playerName}  Score: 0`);
            this.startGame(); // Start the game after getting the name
        } else {
            //handle the scenario where the player doesn't enter a name
            this.gameOver = true;
            this.add.text(640, 360, 'Game Over: Name not entered!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        }
    }

    startGame() {
        // Start the obstacle timer
        this.obstacleTimer = this.time.addEvent({
            delay: this.obstacleSpawnRate,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true,
        });
    }

    update() {
        if (!this.gameStarted) return; // Only update if the game has started

        if (this.gameOver) return;

        this.background.tilePositionX += 2;

        this.obstacles.getChildren().forEach((obstacle) => {
            obstacle.x -= this.obstacleSpeed;
            if (obstacle.x < -50) {
                obstacle.destroy();
                this.score += 1;
                this.scoreText.setText(`Name: ${this.playerName}  Score: ${this.score}`); // Include name in score display
            }
        });

        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.up.isDown) {
            this.ship.setVelocityY(-200);
        } else if (cursors.down.isDown) {
            this.ship.setVelocityY(200);
        } else {
            this.ship.setVelocityY(0);
        }
    }

    spawnObstacle() {
        if (this.gameOver) return;

        const obstacleY = Phaser.Math.Between(50, 850);
        const obstacle = this.obstacles.create(1300, obstacleY, 'obstacle');
        obstacle.setVelocityX(-this.obstacleSpeed * 60);
        obstacle.setImmovable(true);
        obstacle.setScale(0.5);
    }

    hitObstacle(ship, obstacle) {
        this.gameOver = true;
        this.physics.pause();
        ship.setTint(0xff0000);

        this.add.text(640, 360, 'Game Over!', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5);
        this.obstacleTimer.remove();
    }

    winGame(ship, winPoint) {
        this.gameOver = true;
        this.physics.pause();

        this.add.text(640, 360, 'You Win!', { fontSize: '64px', fill: '#0f0' }).setOrigin(0.5);
        this.obstacleTimer.remove();
    }
}
