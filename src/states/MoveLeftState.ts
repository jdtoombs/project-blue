export default class MoveLeftState {
  player: Phaser.Physics.Arcade.Sprite;

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  enter() {
    // TODO:  add walking animation here
    const speed = 100;
    this.player.scaleX = -1;
    this.player.setVelocityX(-speed);
  }
}
