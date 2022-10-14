import { ICustomPlayerSprite } from "../interfaces";

export default class IdleState {
  player: ICustomPlayerSprite;

  constructor(player: ICustomPlayerSprite) {
    this.player = player;
  }

  enter() {
    let noFish = this.player.playerObjectState?.fishCaught === false;
    this.player.setVelocity(0, 0);
    if (!!this.player.playerObjectState) {
      if (this.player.playerObjectState.hasRod && noFish) {
        this.player.anims.play({ key: 'idle-rod-1', repeat: -1 });
      } else if (this.player.playerObjectState.fishCaught) {
        this.player.anims.play({ key: 'idle-fish', repeat: -1 });
      } else {
        this.player.anims.play({ key: 'idle', repeat: -1 });
      }
    }
  }
}
