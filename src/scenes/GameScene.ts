import { Scene, Physics } from 'phaser';
// TODO: Move this
let hasRod: boolean = false;

export default class GameScene extends Scene {
  player?: Physics.Arcade.Sprite;
  rod?: Physics.Arcade.Sprite;

  constructor() {
    super({ key: 'Game' });
  }
  create() {
    this.rod = this.physics.add.sprite(200, 200, 'rod-1');
    this.rod.setCollideWorldBounds(true);

    this.player = this.physics.add.sprite(100, 100, 'blu');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.play({ key: 'idle', repeat: -1 });

    this.physics.add.overlap(this.player, this.rod, this.collectRod);
  }

  // TODO: Set up animations for running left/right/jump, player can currently jump infinitely
  update() {
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    /** Controls */
    if (keyA.isDown) {
      this.player!.scaleX = -1;
      this.player!.setVelocityX(-100);
    } else if (keyD.isDown) {
      this.player!.scaleX = 1;
      this.player!.setVelocityX(100);
    } else if (keyW.isDown) {
      this.player!.setVelocityY(-50);
    } else {
      this.player!.setVelocityX(0);
    }

    /** Item Tracking */
    // TODO: Why does the animation only play when run in create at the moment
    if (hasRod) {
      this.player!.play('idle-rod-1');
    }
  }
  // figure out typings later
  collectRod(player: any, rod: any) {
    rod.disableBody(true, true);
    hasRod = true;
  }
}
