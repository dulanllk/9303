import { Girl } from '../objects/Girl.js';
import { Bully } from '../objects/Bully.js';
import { Rain } from '../objects/Rain.js';

export class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    preload() {
        this.load.image('town', 'assets/images/town.png');
        this.load.image('girl', 'assets/images/girl.png');
        this.load.image('bully', 'assets/images/bully.png');
        this.load.image('raindrop', 'assets/images/raindrop.png');
    }

    create() {
        this.add.image(640, 360, 'town');

        this.girl = new Girl(this, 640, 500);
        this.bullies = this.physics.add.group();
        this.rain = new Rain(this);

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                let bully = new Bully(this, 1280, 500);
                this.bullies.add(bully);
            },
            loop: true
        });

        this.physics.add.collider(this.girl, this.bullies, () => {
            this.scene.start('GameOver');
        });

        this.physics.add.collider(this.girl, this.rain, () => {
            this.scene.start('GameOver');
        });
    }

    update() {
        this.girl.update();
    }
}
