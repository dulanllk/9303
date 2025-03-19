export class Girl extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'girl');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(200);
        } else {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-400);
        }
    }
}
