import { Scene } from 'phaser';

export default class GameScene extends Scene {
  constructor() {
    super({ key: 'Game' });
  }
  create() {
    const blu = this.add.sprite(100, 100, 'blu');
    blu.play({ key: 'idle', repeat: -1 });
  }
}
