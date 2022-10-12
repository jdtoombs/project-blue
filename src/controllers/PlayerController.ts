import CastState from '../states/CastState';
import IdleState from '../states/IdleState';
import JumpState from '../states/JumpState';
import MoveLeftState from '../states/MoveLeftState';
import MoveRightState from '../states/MoveRighState';
import ReelState from '../states/ReelState';

type PlayerState = 'idle' | 'moveLeft' | 'moveRight' | 'jump' | 'idleRod' | 'cast' | 'reel';

export default class PlayerController {
  states: { [key: string]: { enter: () => void } };
  currentState!: { enter: () => void };

  constructor(player: Phaser.Physics.Arcade.Sprite) {
    this.states = {
      idle: new IdleState(player, false),
      moveLeft: new MoveLeftState(player),
      moveRight: new MoveRightState(player),
      jump: new JumpState(player),
      idleRod: new IdleState(player, true),
      cast: new CastState(player, true),
      reel: new ReelState(player, true),
    };
  }

  setState(name: PlayerState) {
    if (this.currentState === this.states[name]) return;
    this.currentState = this.states[name];
    this.currentState.enter();
  }
}
