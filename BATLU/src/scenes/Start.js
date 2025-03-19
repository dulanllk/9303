export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        this.add.text(400, 300, 'BATLU - Protect the Innocent Girl', { fontSize: '32px', fill: '#fff' });
        this.add.text(450, 400, 'Press SPACE to Start', { fontSize: '24px', fill: '#fff' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Play');
        });
    }
}
