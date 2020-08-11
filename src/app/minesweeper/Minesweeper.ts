import {GameState} from '@/app/minesweeper/enum';
import Cell from '@/app/minesweeper/Cell';
import Player from '@/app/minesweeper/Player';
import Palette from '@/app/util/Palette';

export default abstract class Minesweeper {
    static readonly startingLocationRadius = 3;

    gameState: GameState = GameState.Uninitialized;
    width: number;
    height: number;
    mines: number;
    lives: number;
    cells: Cell[][] = [];
    players: Player[] = [];
    cellsToOpenCount: number;

    protected palette = new Palette();

    abstract openCell(
        cell: Cell,
        player: Player,
        hasOpenedNeighbourCell: number
    ): Cell[];

    abstract setCellFlagged(cell: Cell, flagged: boolean, player: Player): void


    addPlayer(player: Player): void {
        player.setGame(this);
        if (player.color === undefined) {
            player.color = this.palette.getRandomColorHEX();
        }
        this.players.push(player);
    }
}
