import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MainGame } from '../../game-engine/main-game';
import { environment } from '../../../environments/environment';
import { GameService } from '../../shared/services/game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
    canvasId = 'game-canvas';
    game: MainGame;

    constructor(private gameService: GameService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        const gameConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                parent: this.canvasId,
                mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 800,
                height: 400,
            },
            physics: {
                default: 'matter',
                matter: {
                    // debug: environment.env === 'sandbox' || environment.env === 'local',
                    debug: false,
                },
            },
            transparent: true,
            zoom: 2,
        };
        this.game = new MainGame(gameConfig, this.gameService);
    }

    ngOnDestroy(): void {}
}
