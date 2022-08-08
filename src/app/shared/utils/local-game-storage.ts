import { GameData } from '../interfaces/game-data';
import { GameSerializer } from '../interfaces/game-serializer';

export class LocalGameStorage implements GameSerializer {
    private _canSerialize = false;
    private _games: GameData[];
    private _defaultGames: GameData[] = [
        { name: 'slot 1', index: 0, containsData: false },
        { name: 'slot 2', index: 1, containsData: false },
        { name: 'slot 3', index: 2, containsData: false },
    ];

    get numberOfGames(): number {
        return 3;
    }

    canSerialize(): boolean {
        this._canSerialize = !!window.localStorage;
        return this._canSerialize;
    }

    async getGames(): Promise<GameData[]> {
        if (!this._canSerialize) {
            throw new Error('Check if serialization is possible before calling getGames.');
        }
        if (this._games) return this._games;
        const gamesSerialized = window.localStorage.getItem('games');
        if (gamesSerialized) {
            try {
                this._games = JSON.parse(gamesSerialized);
                this._games.forEach((game: GameData, index: number) => {
                    game.index = index;
                });
                return this._games;
            } catch (e: any) {
                console.error('Problem deserializing game data.');
                this._games = this._defaultGames;
                return this._games;
            }
        }
        this._games = this._defaultGames;
        return this._games;
    }

    async saveGame(data: GameData): Promise<boolean> {
        if (!this._canSerialize) {
            throw new Error('Check if serialization is possible before calling saveGame.');
        }
        this._games[data.index] = data;
        try {
            const gamesSerialized = JSON.stringify(this._games);
            window.localStorage.setItem('games', gamesSerialized);
        } catch (e: any) {
            console.error(`Error serializing game: ${e}`);
            return false;
        }
        return true;
    }

    async getGame(index: number): Promise<GameData> {
        if (!this._canSerialize) {
            throw new Error('Check if serialization is possible before calling getGame.');
        }
        if (this._games) {
            return this._games[index];
        }
        throw new Error('Call getGames first, before calling getGame');
    }
}
