import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: { // Add this physics configuration
        default: 'arcade',  // Use the Arcade physics engine
        arcade: {
            gravity: { y: 0 }, // Set gravity (you can adjust this)
            debug: false   // Set to true to see physics bodies
        }
    }
}

new Phaser.Game(config);