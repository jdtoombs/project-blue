import { ICustomPlayerSprite } from "../interfaces";

export default class MoveRightState {
  player: ICustomPlayerSprite;

  constructor(player: ICustomPlayerSprite) {
    this.player = player;
  }

  enter() {
    // TODO: Add walk right animation
    const speed = 100;
    this.player.anims.play({ key: this.player.playerObjectState?.hasRod ? 'walk-with-rod' : 'walk', repeat: -1 });
    this.player.scaleX = 1;
    this.player.setOffset(10);
    this.player.setVelocityX(speed);
  }
}
