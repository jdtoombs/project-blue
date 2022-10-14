import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

import BootScene from './scenes/BootScene';

export const phaser = {
  initialize: true,
  game: {
    type: Phaser.AUTO,
    // TODO: Create better site layout and Game component to render the canvas in
    parent: 'phaser-container',
    width: 1000,
    height: 650,
    backgroundColor: '#10101e',
    scale: {
      mode: Phaser.Scale.ScaleModes.NONE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom: 1.25,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
        // debug: true,
      },
    },
    scene: [BootScene, GameScene],
  },
};
