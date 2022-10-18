import { ICustomPlayerSprite } from "../interfaces";

export default class MoveLeftState {
  player: ICustomPlayerSprite;

  constructor(player: ICustomPlayerSprite) {
    this.player = player;
  }

  enter() {
    // TODO:  add walking animation here
    const speed = 100;
    this.player.anims.play({ key: this.player.playerObjectState?.hasRod ? 'walk-with-rod' : 'walk', repeat: -1 });
    this.player.scaleX = -1;
    this.player.setOffset(23,10);
    this.player.setVelocityX(-speed);
  }
}
