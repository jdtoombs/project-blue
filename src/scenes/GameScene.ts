import { Scene, Physics, GameObjects } from 'phaser';
import PlayerController from '../controllers/PlayerController';

export default class GameScene extends Scene {
  playerController!: PlayerController;
  player?: Physics.Arcade.Sprite;
  rod?: Physics.Arcade.Sprite;
  slider?: any;
  fishingBar?: GameObjects.Sprite;

  hasRod?: boolean;
  casted?: boolean = false;
  reeling?: boolean = false;
  count?: number = 0;

  fishOnLine?: boolean;
  actionMessage!: GameObjects.Text;

  stars?: GameObjects.Sprite;
  mountains?: GameObjects.TileSprite;

  constructor() {
    super({ key: 'Game' });
  }

  //TODO: Organize this with best practices later
  create() {
    const numberOfYellowStars = Phaser.Math.Between(0, 5);
    const numberOfWhiteStars = Phaser.Math.Between(10, 50);

    const map = this.add.tilemap('tilemap');
    const tileset = map.addTilesetImage('standard_tiles', 'base_tiles');
    const platform = map.createLayer('Ground', tileset);
    map.createLayer('Background', tileset);

    // this.stars = this.add.sprite(250, 315, 'stars');
    // this.add.sprite(250, Phaser.Math.Between(300, 315), 'yellow-star');

    for (let i = 0; i < numberOfWhiteStars; i++) {
      this.physics.add
        .sprite(Phaser.Math.Between(0, 450), Phaser.Math.Between(480, 530), 'white-star')
        .setVelocityX(0.25)
        .body.setAllowGravity(false);
    }

    for (let i = 0; i < numberOfYellowStars; i++) {
      let yellowStar = this.physics.add
        .sprite(Phaser.Math.Between(0, 450), Phaser.Math.Between(480, 500), 'yellow-star')
        .setVelocityX(0.35);
      yellowStar.anims.play({ key: 'Glow', repeat: -1 });
      yellowStar.body.setAllowGravity(false);
    }
    // create player
    this.player = this.physics.add.sprite(250, 600, 'blu');
    this.player.setSize(13, 22).setOffset(10);
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
    this.rod.setSize(15, 10).setOffset(0, 20);
    this.rod.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 4;

    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.rod, platform);
    platform.setCollisionBetween(0, 15);

    this.physics.add.overlap(this.player, this.rod, this.collectRod);
  }

  // TODO: Set up animations for running left/right/jump, player can currently jump infinitely
  update() {
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (!!this.slider && !!this.fishingBar && this.reeling) {
      if (this.input.mousePointer.isDown) {
        this.slider.setVelocityX(20);
      } else {
        this.slider.setVelocityX(-30);
      }

      if (
        Math.floor(this.slider.x) >= Math.floor(this.fishingBar!.x - 5) &&
        Math.floor(this.slider.x) <= Math.floor(this.fishingBar!.x + 5)
      ) {
        this.count!++;
      } else {
        this.count = this.count! - 0.35;
      }

      if (
        Math.floor(this.slider.x) === Math.floor(this.fishingBar!.x - 30) ||
        Math.floor(this.slider.x) === Math.floor(this.fishingBar!.x + 30)
      ) {
        this.actionMessage.setX(this.player!.body.x + 5);
        this.actionMessage.setY(this.player!.body.y - 5);
        this.actionMessage.setText('Fish lost!');
        this.reeling = false;
        this.fishingBar?.destroy();
        this.slider.destroy();
      }
    }

    if (this.count === 300) {
      this.actionMessage.setText('Fish caught!');
      this.reeling = false;
      this.count = 0;
      this.fishingBar?.destroy();
      this.slider.destroy();
    }

    /** Control State */
    if (keyA.isDown) {
      this.playerController.setState('moveLeft');
    } else if (keyD.isDown) {
      this.playerController.setState('moveRight');
    } else if (keyW.isDown) {
      this.playerController.setState('jump');
    } else if (this.hasRod && !this.casted && !this.reeling) {
      this.playerController.setState('idleRod');
    } else if (!this.casted && !this.reeling) {
      this.playerController.setState('idle');
    } else if (this.casted && !this.reeling) {
      this.playerController.setState('cast');
    } else if (this.reeling) {
      this.casted = false;
      this.playerController.setState('reel');
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
      this.casted = true;
      const rng = Phaser.Math.Between(0, 10);
      this.time.delayedCall(rng * 1000, this.reel);
    } else {
      this.actionMessage.setX(this.player?.body.x);
      this.actionMessage.setY(this.player?.body.y);
      this.actionMessage.setText('You need a rod to fish!');
    }
  };

  reel = () => {
    /** Indicate when fish on the line. */
    this.actionMessage.setX(this.player!.body.x + 5);
    this.actionMessage.setY(this.player!.body.y - 5);
    this.actionMessage.setText('Reel!');
    this.reeling = true;
    this.fishingBar = this.add.sprite(
      this.player!.body.x + 15,
      this.player!.body.y - 10,
      'fishing-bar',
    );
    if (!this.slider) {
      this.slider = this.physics.add.sprite(this.fishingBar.x, this.fishingBar.y - 1, 'slider');
      this.slider.body.setAllowGravity(false);
    }
  };
}
