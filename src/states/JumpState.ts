export default class JumpState {
  player: Phaser.Physics.Arcade.Sprite;

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  enter() {
    // TODO: Add jump animation
    const jumpSpeed = 50;
    this.player.setVelocityY(-jumpSpeed);
  }
}
