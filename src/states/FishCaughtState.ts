import { ICustomPlayerSprite } from "../interfaces";

export default class FishCaughtState {
  player: ICustomPlayerSprite;

  constructor(player: ICustomPlayerSprite) {
    this.player = player;
  }

  enter() {
      this.player.setVelocity(0, 0);
      if (this.player.playerObjectState?.fishCaught) {
          this.player.anims.play({ key: 'idle-fish', repeat: -1 });
        }
  }
}
