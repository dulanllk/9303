export class Bully extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bully');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityX(-100);
    }
}
