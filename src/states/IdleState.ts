export default class IdleState {
  player: Phaser.Physics.Arcade.Sprite;
  hasRod: boolean;

  constructor(player: Phaser.Physics.Arcade.Sprite, hasRod: boolean) {
    this.player = player;
    this.hasRod = hasRod;
  }

  enter() {
    this.player.setVelocity(0, 0);
    if (this.hasRod) {
      this.player.anims.play({ key: 'idle-rod-1', repeat: -1 });
    } else {
      this.player.anims.play({ key: 'idle', repeat: -1 });
    }
  }
}
