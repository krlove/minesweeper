import {GameState} from '@/app/minesweeper/enum';

export default class Match {
    roomId!: string;
    username!: string;
    width!: number;
    height!: number;
    mines!: number;
    lives!: number;
    playersCount!: number;
    gameState!: GameState;
}
