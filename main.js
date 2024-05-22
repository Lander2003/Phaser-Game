import './style.css'
import Phaser from "phaser";

const sizes = {
  width: 576,
  height: 324
}

let scoreBoard;
let score = 0;

class GameScene extends Phaser.Scene{
constructor(){
  super("scene-game");
  this.player;
  this.cursor,
  this.background,
  this.ground,
  this.playerSpeed=100
  this.bgMusic;
  this.jumpSound;
  this.coin;
  this.coinCollectedSound;
  this.levelPassed;
}

preload(){
 this.load.image("background", "assets/maps/winter3/4.png");
 // this.load.image("ground", "assets/winter3/3.png");

 this.load.image("background2", "assets/maps/winter5/11.png");
 this.load.image("background3", "assets/maps/summer2/Summer2.png")
 // this.load.image("ground", "assets/winter3/3.png");

 this.load.spritesheet("player", "assets/player/Pink_Monster_Walk_6.png", {
   frameWidth: 32,
   frameHeight: 32
 });
 this.load.spritesheet("playerJump", "assets/player/Pink_Monster_Jump_8.png", {
   frameWidth: 32,
   frameHeight: 32
 });
 this.load.spritesheet("playerRun", "assets/player/Pink_Monster_Run_6.png", {
   frameWidth: 32,
   frameHeight: 32
 });
 this.load.spritesheet();


 this.load.spritesheet("coin", "assets/collectables/MonedaP.png", {
   frameWidth: 16,
   frameHeight: 16
 });

 this.load.spritesheet("coin2", "assets/collectables/MonedaR.png", {
   frameWidth: 16,
   frameHeight: 16
 });
 this.load.spritesheet("coin3", "assets/collectables/MonedaD.png", {
   frameWidth: 16,
   frameHeight: 16
 });

 this.load.audio("theme", "assets/theme.mp3");
 this.load.audio("jump", "assets/jump.mp3");
 this.load.audio("levelPassed", "assets/levelPassed.mp3");
 this.load.audio("coinCollected", "assets/coinCollected.wav");
};

create(){

  this.bgMusic = this.sound.add("theme", {volume: 1});
  this.bgMusic.play();
  this.jumpSound = this.sound.add("jump", 20);
  this.coinCollectedSound = this.sound.add("coinCollected");
  this.levelPassed = this.sound.add("levelPassed");

  this.background = this.add.image(0,0, "background").setOrigin(0,0);

  // this.ground = this.physics.add.image(0, 24, "ground").setOrigin(0,0);
  // this.ground.setImmovable(true);
  // this.ground.setCollideWorldBounds(true);
  // this.ground.setSize(576,54).setOffset(0, 270);

  this.cursor = this.input.keyboard.createCursorKeys();

  this.player = this.physics.add.sprite(0, 0, "player").setOrigin(0, 0);
  this.player.setBounce(0.3);
  this.player.body.allowGravity = true;
  this.player.setCollideWorldBounds(true);
  this.player.setSize(32,42).setOffset(0, 0);
  this.player.setImmovable(true);



  this.player.setInteractive();

  this.coin = this.physics.add.sprite(520, 280, "coin").setOrigin(0,0);
  this.coin.setBounce(0.5);
  this.coin.setSize(6,32).setOffset(5, 0);
  this.coin.body.allowGravity = true;
  this.coin.setCollideWorldBounds(true);


  this.physics.add.overlap(this.coin, this.player, this.coinCollected, null, this);


this.anims.create({
  key: "player_walk",
  frames: this.anims.generateFrameNumbers("player"),
  frameRate: 15,
  repeat: -1
});

this.anims.create({
  key: "player_run",
  frames: this.anims.generateFrameNumbers("playerRun"),
  frameRate: 16,
  repeat: -1
});


this.anims.create({
  key: "player_idle",
  frames: this.anims.generateFrameNumbers("playerIdle"),
  frameRate: 8,
  repeat: -1
});

this.anims.create({
  key: "player_jump",
  frames: this.anims.generateFrameNumbers("playerJump"),
  frameRate: 10,
  repeat: -1
});


this.anims.create({
  key: "coinAnimation",
  frames: this.anims.generateFrameNumbers("coin"),
  frameRate: 6,
  repeat: -1
});

this.anims.create({
  key: "coinAnimation2",
  frames: this.anims.generateFrameNumbers("coin2"),
  frameRate: 6,
  repeat: -1
});

this.anims.create({
  key: "coinAnimation3",
  frames: this.anims.generateFrameNumbers("coin3"),
  frameRate: 6,
  repeat: -1
});


this.coin.play("coinAnimation", true);

    // Parameters: x, y, text, style
    scoreBoard = this.add.text(30, 30, 'Collected Coins: 0', {
         fontFamily: 'cursive',
         fontSize: '40px',
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

};



update(){
  // while(this.coin){
  //   this.coin.setVelocityY(-60);
  //   setTimeout(1000);
  //   this.coin.setVelocityY(60);
  // }
  const {left, right, up, shift} = this.cursor;
  if(left.isDown){
    if(shift.isDown){
      this.player.play("player_run", true);
      this.player.setVelocityX(-this.playerSpeed - 80);
    } else {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.flipX = true;
      this.player.play("player_walk", true);
    }
  } else if(right.isDown){
   if(shift.isDown){
     this.player.play("player_run", true);
     this.player.setVelocityX(this.playerSpeed + 80);
     this.player.flipX = false;
   } else {
     this.player.setVelocityX(this.playerSpeed);
     this.player.flipX = false;
     this.player.play("player_walk", true);
   }
  } else{
    this.player.setVelocityX(0);
    this.player.play("player_idle", true);
  }

  if(left.isDown && shift.isDown){
    this.player.play("player_run", true);
    this.player.setVelocityX(-this.playerSpeed - 80);
    this.player.flipX = true;
  } else if(right.isDown && shift.isDown) {
    this.player.play("player_run", true);
    this.player.setVelocityX(this.playerSpeed + 80);
    this.player.flipX = false;
  }

  if(up.isDown && this.player.y >= 260){
    this.jumpSound.play();
    this.player.setVelocityY(-175);
    this.player.play("player_jump", true);
  }

  if(score === 5){
    this.coin.play("coinAnimation2", true);
    this.background.setTexture("background2");
  }

  if(score == 10){
    this.coin.play("coinAnimation3", true);
    this.background.setTexture("background3");
  }

  if(score == 4 || score == 9){
    this.levelPassed.play();
  }

};

coinCollected(){
  this.coin.setScale(this.getRandomScale());
  this.coin.setY(100);
  this.coin.setX(this.getRandomX());
  score++;
  scoreBoard.setText("Collected Coins: " + score);
  this.coinCollectedSound.play();
  console.log("Coin collected!");
}

getRandomX(){
   return Math.floor(Math.random() * 400) + 1;
}

getRandomScale(){
  return Math.random() * (2 - 0.5) + 0.5;
}

}





const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics:{
    default: "arcade",
    arcade:{
      gravity: {y: 600},
      debug: false
    }
  },
  scene:[GameScene]
}

const game = new Phaser.Game(config);
