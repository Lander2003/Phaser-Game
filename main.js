import './style.css';
import Phaser from 'phaser';

const sizes = {
  width: 576,
  height: 324
};

let scoreBoard;
let score = 0;
let soundPlayed = false;

class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
    this.playerSpeed = 100;
  }

  preload() {
    this.loadAssets();
  }

  create() {
    this.createSounds();
    this.createBackground();
    this.createPlayer();
    this.createCoin();
    this.createAnimations();
    this.createScoreBoard();
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.handlePlayerMovement();
    this.handleBackgroundChange();
  }

  loadAssets() {
    this.load.image('background', 'assets/maps/winter3/4.png');
    this.load.image('background2', 'assets/maps/winter5/11.png');
    this.load.image('background3', 'assets/maps/summer2/Summer2.png');

    this.load.spritesheet('player', 'assets/player/Pink_Monster_Walk_6.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('playerJump', 'assets/player/Pink_Monster_Jump_8.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('playerRun', 'assets/player/Pink_Monster_Run_6.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('playerIdle', 'assets/player/Pink_Monster_Idle_4.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('coin', 'assets/collectables/MonedaP.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('coin2', 'assets/collectables/MonedaR.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('coin3', 'assets/collectables/MonedaD.png', { frameWidth: 16, frameHeight: 16 });

    this.load.audio('theme', 'assets/theme.mp3');
    this.load.audio('jump', 'assets/jump.mp3');
    this.load.audio('levelPassed', 'assets/levelPassed.mp3');
    this.load.audio('coinCollected', 'assets/coinCollected.wav');
  }

  createSounds() {
    this.bgMusic = this.sound.add('theme', { volume: 1 });
    this.bgMusic.play();
    this.jumpSound = this.sound.add('jump');
    this.coinCollectedSound = this.sound.add('coinCollected');
    this.levelPassed = this.sound.add('levelPassed');
  }

  createBackground() {
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(0, 0, 'player').setOrigin(0, 0);
    this.player.setBounce(0.3);
    this.player.body.allowGravity = true;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(26, 42).setOffset(2, 0);
    this.player.setImmovable(true);
    this.player.setInteractive();
  }

  createCoin() {
    this.coin = this.physics.add.sprite(520, 280, 'coin').setOrigin(0, 0);
    this.coin.setSize(16, 32).setOffset(0, 0);
    this.coin.body.allowGravity = true;
    this.coin.setCollideWorldBounds(true);

    this.physics.add.overlap(this.coin, this.player, this.coinCollected, null, this);
    this.coin.play('coinAnimation', true);
  }

  createAnimations() {
    this.createPlayerAnimations();
    this.createCoinAnimations();
  }

  createPlayerAnimations() {
    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('player'),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'player_run',
      frames: this.anims.generateFrameNumbers('playerRun'),
      frameRate: 16,
      repeat: -1
    });

    this.anims.create({
      key: 'player_idle',
      frames: this.anims.generateFrameNumbers('playerIdle'),
      frameRate: 6,
      repeat: -1
    });
  }

  createCoinAnimations() {
    this.anims.create({
      key: 'coinAnimation',
      frames: this.anims.generateFrameNumbers('coin'),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'coinAnimation2',
      frames: this.anims.generateFrameNumbers('coin2'),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'coinAnimation3',
      frames: this.anims.generateFrameNumbers('coin3'),
      frameRate: 6,
      repeat: -1
    });
  }

  createScoreBoard() {
    scoreBoard = this.add.text(15, 60, 'Collected Coins: 0', {
      fontFamily: 'cursive',
      fontSize: '20px',
      color: 'black',
      align: 'center',
      stroke: '#fff',
      strokeThickness: 4,
      shadow: {
        offsetX: 0.5,
        offsetY: 0.5,
        color: '#333333',
        blur: 2,
        fill: true
      }
    });

    this.add.text(15, 15, 'Lander\'s Pet', {
      fontFamily: 'cursive',
      fontSize: '30px',
      color: 'black',
      align: 'center',
      stroke: '#fff',
      strokeThickness: 4,
      shadow: {
        offsetX: 0.5,
        offsetY: 0.5,
        color: '#333333',
        blur: 2,
        fill: true
      }
    });
  }

  handlePlayerMovement() {
    const { left, right, up, shift } = this.cursor;

    if (left.isDown) {
      this.handleMovement(-this.playerSpeed, 'left', shift.isDown);
    } else if (right.isDown) {
      this.handleMovement(this.playerSpeed, 'right', shift.isDown);
    } else {
      this.player.setVelocityX(0);
      this.player.play('player_idle', true);
    }

    if (up.isDown && this.player.body.onFloor()) {
      this.jumpSound.play();
      this.player.setVelocityY(-210);
    }
  }

  handleMovement(speed, direction, isRunning) {
    this.player.flipX = direction === 'left';

    if (isRunning) {
      this.player.play('player_run', true);
      this.player.setVelocityX(direction === 'left' ? -speed - 80 : speed + 80);
    } else {
      this.player.play('player_walk', true);
      this.player.setVelocityX(direction === 'left' ? -speed : speed);
    }
  }

  handleBackgroundChange() {
    if (score === 10 || score === 20) {
      if (!soundPlayed) {
        this.levelPassed.play();
        soundPlayed = true;
      }
      this.changeBackground(score === 10 ? 'background2' : 'background3', score === 10 ? 'coinAnimation2' : 'coinAnimation3');
    } else if (score === 11 || score === 21) {
      soundPlayed = false;
    }
  }

  changeBackground(backgroundKey, coinAnimationKey) {
    this.background.setTexture(backgroundKey);
    this.coin.play(coinAnimationKey, true);
  }

  coinCollected() {
    this.coin.setScale(this.getRandomScale());
    this.coin.setY(100);
    this.coin.setX(this.getRandomX());
    score++;
    scoreBoard.setText('Collected Coins: ' + score);
    this.coinCollectedSound.play();
    console.log('Coin collected!');
  }

  getRandomX() {
    return Math.floor(Math.random() * 400) + 1;
  }

  getRandomScale() {
    return Math.random() * (2 - 0.5) + 0.5;
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.getElementById('gameCanvas'),
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
