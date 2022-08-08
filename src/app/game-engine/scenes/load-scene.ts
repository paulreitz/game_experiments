import Phaser from 'phaser';
import { SidescrollerConfig } from '../../shared/interfaces/sidescroller-config';
import { GameService } from '../../shared/services/game.service';
import { buildPlayerAnimations, loadPlayerSpritesheets } from '../player/player-asset-util';

export class LoadScene extends Phaser.Scene {
    preload(): void {
        loadPlayerSpritesheets(this);
        this.load.image('background1', 'assets/game/img/backgrounds/background1.png');
        this.load.image('background2', 'assets/game/img/backgrounds/background2.png');
    }

    create(): void {
        buildPlayerAnimations(this);
        const gameService: GameService = (this.game.config as unknown as SidescrollerConfig).gameService;
        this.scene.start(gameService.startScene);
    }
}
