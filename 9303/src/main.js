import { Start } from './scenes/Start.js';
import { AdminScene } from './scenes/AdminScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [Start, AdminScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: { 
        default: 'arcade',  
        arcade: {
            gravity: { y: 0 },
            debug: false   
        }
    }
}

new Phaser.Game(config);