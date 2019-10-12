import "phaser";
import Tiles from "../assets/level2/arcade_platformerV2-transparent.png";
import Spikes from "../assets/level2/spikes.png";
import End from "../assets/level2/end.png";
import TileMap from "../assets/level2/level2.json";
import Dude from "../assets/dude.png";
import Star from "../assets/star.png";

export default class LevelTwo extends Phaser.Scene {
  constructor() {
    super("Level2");
  }

  preload() {
    this.load.image("tiles", Tiles);
    this.load.image("spikes", Spikes);
    this.load.image("end", End);
    this.load.image("star", Star);
    this.load.tilemapTiledJSON("map", TileMap);
    this.load.spritesheet("dude", Dude, { frameWidth: 32, frameHeight: 48 });
    this.load.audio("background", "audio/background-music.mp3");
    this.load.audio("collectStar", "audio/collect-star.wav");
  }

  create() {
    this.player;
    this.cursors;
    this.stars;
    this.score = 0;
    this.scoreText;
    this.gameOverText;
    this.youWinText;
    this.restartButton;
    this.music;

    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16
    });
    const tileset = map.addTilesetImage("terrain", "tiles");
    const spikeset = map.addTilesetImage("spikes", "spikes");
    const endset = map.addTilesetImage("end", "end");
    const worldLayer = map.createStaticLayer("world", tileset, 0, 0);
    const spikes = map.createStaticLayer("spikes", spikeset, 0, 0);
    const end = map.createStaticLayer("end", endset, 0, 0);

    // play background music;
    this.music = this.sound.add("background", { volume: 0.3, loop: true });
    this.music.play();

    this.player = this.physics.add.sprite(40, 40, "dude");
    this.player.body.setGravityY(300);

    //sets collision by property
    worldLayer.setCollisionByProperty({ collide: true });
    spikes.setCollisionByProperty({ collide: true });
    end.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.player, end, completeLevel, null, this);
    this.physics.add.collider(this.player, spikes, hitFire, null, this);
    this.player.setBounce(0.2);

    // makes stars collectable & not fall off map
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 32,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    this.physics.add.collider(this.stars, worldLayer);
    this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

    function collectStar(player, star) {
      star.disableBody(true, true);
      this.score += 10;
      this.scoreText.setText("Score: " + this.score);
      this.sound.play("collectStar", { volume: 0.3 });
    }

    // complete level
    function completeLevel(player, end) {
      this.physics.pause();
      this.youWinText = this.add.text(300, 150, "YOU WIN", {
        fontSize: "32px",
        color: "green",
        strokeThickness: 2,
        backgroundColor: "black",
        padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
        }
      });
      this.youWinText.setScrollFactor(0);
    }

    // Make player lose when touching fire
    function hitFire(player, spikes) {
      this.physics.pause();
      this.music.stop();
      this.player.setTint(0xff0000);
      player.anims.play("turn");
      this.gameOverText = this.add.text(300, 150, "GAME OVER", {
        fontSize: "32px",
        color: "red",
        strokeThickness: 2,
        backgroundColor: "black",
        padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
        }
      });
      this.gameOverText.setScrollFactor(0);

      // restarts game if clicked
      this.restartButton = this.add.text(320, 200, "RESTART", {
        fontSize: "32px",
        color: "red",
        strokeThickness: 2,
        backgroundColor: "black",
        padding: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5
        }
      });
      this.restartButton.setScrollFactor(0);
      this.restartButton.setInteractive();
      this.restartButton.on("pointerdown", () => {
        this.scene.restart();
      });
    }

    // shows players score
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "16px",
      fill: "#000"
    });
    this.scoreText.setScrollFactor(0);

    // makes camera follow player

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    // creates walking animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-300);
    }
  }
}
