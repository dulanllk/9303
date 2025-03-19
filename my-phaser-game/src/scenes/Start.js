export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('player', 'assets/player.png', { framewidth: 176, frameHeight: 96});
    }

    create() {
        this.add.image(400, 300, 'background');

        // Fetch a random player name from an API (Interoperability)
        const playerName = await this.getRandomName();
        this.add.text(10, 10, `Player: ${playerName}`, { fontSize: '20px', fill: '#fff' });

        // Player sprite (Virtual Identity)
        this.player = this.physics.add.sprite(400, 500, 'player').setCollideWorldBounds(true);

        // Event-Driven Programming: Listen for keyboard events
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }
    }

    async getRandomName() {
        try {
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            return data.results[0].name.first;
        } catch (error) {
            return 'Player1';
        }
    }
}
