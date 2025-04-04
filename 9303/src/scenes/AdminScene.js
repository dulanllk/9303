// /Project_Folder/src/scenes/AdminScene.js
export class AdminScene extends Phaser.Scene {
    constructor() {
        super('AdminScene');
        this.scores = [];
    }

    preload() {
        this.load.image('background', 'assets/space.png');
    }

    create() {
        this.add.tileSprite(640, 360, 1280, 720, 'background');

        this.add.text(100, 50, 'Admin Dashboard', { fontSize: '32px', fill: '#fff' });

        this.logoutButton = this.add.text(1000, 50, 'Logout', { fontSize: '24px', fill: '#fff' }).setInteractive();
        this.logoutButton.on('pointerdown', () => this.logout());

        this.fetchTopScores();
    }

    fetchTopScores() {
        fetch('http://localhost:3000/topScores')
            .then(response => response.json())
            .then(scores => {
                this.scores = scores;
                this.displayScores();
            })
            .catch(error => console.error('Error fetching top scores:', error));
    }

    displayScores() {
        const x = 100;
        let y = 150;

        const headerStyle = { fontSize: '24px', fill: '#fff', fontWeight: 'bold' };
        this.add.text(x, y, 'Player', headerStyle);
        this.add.text(x + 200, y, 'Score', headerStyle);
        y += 30;

        this.scores.forEach(score => {
            this.add.text(x, y, score.user, { fontSize: '18px', fill: '#fff' });
            this.add.text(x + 200, y, score.score, { fontSize: '18px', fill: '#fff' });
            y += 20;
        });
    }

    logout() {
        this.scene.start('Start');
    }
}