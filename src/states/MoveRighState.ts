export default class MoveRightState {
  player: Phaser.Physics.Arcade.Sprite;

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  enter() {
    // TODO: Add walk right animation
    const speed = 100;
    this.player.scaleX = 1;
    this.player.setVelocityX(speed);
  }
}
