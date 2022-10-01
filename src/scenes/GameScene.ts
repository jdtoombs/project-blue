import { Scene, Physics } from 'phaser';

let player: Physics.Arcade.Sprite;
let jumpCount: number = 0;
export default class GameScene extends Scene {
  constructor() {
    super({ key: 'Game' });
  }
  create() {
    player = this.physics.add.sprite(100, 100, 'blu');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.play({ key: 'idle', repeat: -1 });
  }

  // TODO: Set up animations for running left/right/jump, player can currently jump infinitely
  update() {
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (keyA.isDown) {
      player.scaleX = -1;
      player.setVelocityX(-100);
    } else if (keyD.isDown) {
      player.scaleX = 1;
      player.setVelocityX(100);
    } else if (keyW.isDown && jumpCount === 0) {
      player.setVelocityY(-50);
    } else {
      player.setVelocityX(0);
    }
  }
}
