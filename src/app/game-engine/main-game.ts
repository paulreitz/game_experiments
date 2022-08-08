import Phaser from 'phaser';
import { SceneNames } from '../shared/constants/scenes';
import { SidescrollerConfig } from '../shared/interfaces/sidescroller-config';
import { GameService } from '../shared/services/game.service';
import { BootScene } from './scenes/boot-scene';
import { LoadScene } from './scenes/load-scene';
import { MainMap } from './scenes/map-scene';
import { SandboxScene } from './scenes/sandbox-scene';

export class MainGame extends Phaser.Game {
    constructor(gameConfig: Phaser.Types.Core.GameConfig, gameService: GameService) {
        super(gameConfig);
        (this.config as unknown as SidescrollerConfig).gameService = gameService;

        this.scene.add(SceneNames.BOOT, BootScene);
        this.scene.add(SceneNames.LOAD, LoadScene);
        this.scene.add(SceneNames.MAP, MainMap);
        this.scene.add(SceneNames.SANDBOX, SandboxScene);
        this.scene.start(SceneNames.BOOT);
    }
}
