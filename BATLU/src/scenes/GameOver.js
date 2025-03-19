export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.text(400, 300, 'Game Over!', { fontSize: '32px', fill: '#fff' });
        this.add.text(450, 400, 'Press SPACE to Restart', { fontSize: '24px', fill: '#fff' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Play');
        });
    }
}
