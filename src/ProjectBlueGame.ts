import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

import InitialScene from './scenes/InitialScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 500,
    height: 250,
    zoom: 2,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [InitialScene, GameScene],
};

export default new Phaser.Game(config);
