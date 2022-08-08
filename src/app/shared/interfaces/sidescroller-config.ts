import Phaser from 'phaser';
import { GameService } from '../services/game.service';

export interface SidescrollerConfig extends Phaser.Types.Core.GameConfig {
    gameService: GameService;
}
