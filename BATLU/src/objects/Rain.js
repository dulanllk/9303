export class Rain extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        scene.time.addEvent({
            delay: 1000,
            callback: () => {
                let rainDrop = this.create(
                    Phaser.Math.Between(0, scene.scale.width),
                    0,
                    'raindrop'
                );
                rainDrop.setVelocityY(300);
            },
            loop: true
        });
    }
}
