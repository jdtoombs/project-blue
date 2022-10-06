import { Scene, Physics, GameObjects } from 'phaser';
import PlayerController from '../controllers/PlayerController';

export default class GameScene extends Scene {
  playerController!: PlayerController;
  player?: Physics.Arcade.Sprite;
  rod?: Physics.Arcade.Sprite;

  hasRod?: boolean;
  casted?: boolean;
  fishOnLine?: boolean;
  actionMessage!: GameObjects.Text;

  constructor() {
    super({ key: 'Game' });
  }

  //TODO: Organize this with best practices later
  create() {
    const map = this.add.tilemap('tilemap');
    const tileset = map.addTilesetImage('standard_tiles', 'base_tiles');
    const platform = map.createLayer('Ground', tileset);

    // create player
    this.player = this.physics.add.sprite(250, 600, 'blu');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.input.keyboard.on('keydown-F', this.fishing, this);

    this.actionMessage = this.add.text(220, 500, '', {
      font: '"Press Start 2P"',
      fontSize: '12',
    });

    this.playerController = new PlayerController(this.player);
    this.playerController.setState('idle');

    this.rod = this.physics.add.sprite(200, 200, 'rod-1');
    this.rod.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 4;

    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.rod, platform);
    platform.setCollisionBetween(0, 3);

    this.physics.add.overlap(this.player, this.rod, this.collectRod);
  }

  // TODO: Set up animations for running left/right/jump, player can currently jump infinitely
  update() {
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    /** Movement Controls */
    if (keyA.isDown) {
      this.playerController.setState('moveLeft');
    } else if (keyD.isDown) {
      this.playerController.setState('moveRight');
    } else if (keyW.isDown) {
      this.playerController.setState('jump');
    } else if (this.input.mousePointer.isDown && this.hasRod) {
      this.playerController.setState('cast');
      this.casted = true;
    } else if (this.hasRod) {
      this.playerController.setState('idleRod');
    } else {
      this.playerController.setState('idle');
    }
  }
  // figure out typings later, expected ArcadePhysicsCallback; however, need Arcade.Physics.Sprite for rod.disableBody???
  collectRod = (player: any, rod: any) => {
    rod.disableBody(true, true);
    this.hasRod = true;
  };

  fishing = () => {
    /** Random amount of time for fish to bite */
    if (this.hasRod) {
      const rng = Phaser.Math.Between(0, 15);
      this.time.delayedCall(rng * 1000, this.reel);
    } else {
      this.actionMessage.setX(this.player?.body.x);
      this.actionMessage.setY(this.player?.body.y);
      this.actionMessage.setText('You need a rod to fish!');
    }
  };

  reel = () => {
    /** Indicate when fish on the line. */
    this.actionMessage.setX(this.player?.body.x);
    this.actionMessage.setY(this.player?.body.y);
    this.actionMessage.setText('Reel!');
  };
}
