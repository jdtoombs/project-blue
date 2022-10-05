export default class CastState {
    player: Phaser.Physics.Arcade.Sprite;
    hasRod: boolean;
  
    constructor(player: Phaser.Physics.Arcade.Sprite, hasRod: boolean) {
      this.player = player;
      this.hasRod = hasRod;
    }
  
    enter(hasRod?: boolean) {
      this.player.setVelocity(0, 0);
      if (this.hasRod) {
        this.player.anims.play({ key: 'cast', repeat: 0 });
      } 
    }
  }
  