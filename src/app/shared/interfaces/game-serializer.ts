import { GameData } from './game-data';

export interface GameSerializer {
    get numberOfGames(): number;
    canSerialize(): boolean;
    getGames(): Promise<GameData[]>;
    saveGame(data: GameData): Promise<boolean>;
    getGame(index: number): Promise<GameData>;
}
