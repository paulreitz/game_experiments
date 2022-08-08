import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SceneNames } from '../constants/scenes';
import { LevelData } from '../interfaces/level-data';
import { InputService } from './input.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    startScene: string;
    onDesktop: boolean;
    nextMapData: LevelData;

    constructor(private _inputService: InputService) {
        if (environment.env === 'sandbox') {
            this.startScene = SceneNames.SANDBOX;
            this.nextMapData = {
                backgroundColor: '#505750',
                backgroundFar: 'background1',
                backgroundNear: 'background2',
                tileMapKey: 'tilemap',
                tileImageKey: 'tiles',
                tileSetName: 'MainPlatforms',
            };
        } else {
            this.startScene = SceneNames.MAP;
        }
        this.onDesktop = !!(window as any).appBridge;
    }

    get inputService(): InputService {
        return this._inputService;
    }
}
