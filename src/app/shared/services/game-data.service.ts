import { Injectable } from '@angular/core';
import { GameSerializer } from '../interfaces/game-serializer';
import { LocalGameStorage } from '../utils/local-game-storage';

@Injectable({
    providedIn: 'root',
})
export class GameDataService {
    private _gameStorage: GameSerializer;
    canSerialize: boolean;

    constructor() {
        this._gameStorage = ((window as any).databaseBridge as GameSerializer) || new LocalGameStorage();
        this.canSerialize = this._gameStorage.canSerialize();
    }
}
