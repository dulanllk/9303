import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    scene: [Start],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    }
};

new Phaser.Game(config);
