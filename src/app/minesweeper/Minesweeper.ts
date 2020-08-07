import {GameState} from '@/app/minesweeper/enum';
import Cell from '@/app/minesweeper/cell';
import Player from '@/app/minesweeper/player';

export default abstract class Minesweeper {
    static readonly startingLocationRadius = 3;

    state: GameState = GameState.Uninitialized;
    width: number;
    height: number;
    mines: number;
    lives: number;
    cells: Cell[][] = [];
    players: Player[] = [];
    cellsToOpenCount: number;

    abstract openCell(
        cell: Cell,
        player: Player,
        hasOpenedNeighbourCell: number
    ): Cell[];

    abstract setCellFlagged(cell: Cell, flagged: boolean, player: Player): void
}
