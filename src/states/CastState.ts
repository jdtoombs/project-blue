import { ICustomPlayerSprite } from "../interfaces";

export default class CastState {
    player: ICustomPlayerSprite;
  
    constructor(player: ICustomPlayerSprite) {
      this.player = player;
    }
  
    enter() {
      this.player.setVelocity(0, 0);
      if (this.player.playerObjectState?.hasRod && !this.player.playerObjectState?.reeling) {
        this.player.anims.play({ key: 'cast', repeat: 0 });
      } 
    }
  }
  