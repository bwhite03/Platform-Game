import "phaser";
import config from "./config/config";
import LevelOne from "./scenes/LevelOne";
import LevelTwo from "./scenes/LevelTwo";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("Game", LevelOne);
    this.scene.add("Level2", LevelTwo);
    this.scene.start("Game");
  }
}

window.game = new Game();
