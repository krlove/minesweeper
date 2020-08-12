import Cell from "@/app/minesweeper/Cell";
import {PlayerState} from "@/app/minesweeper/enum";
import Minesweeper from '@/app/minesweeper/Minesweeper';
import SingleplayerMinesweeper from '@/app/minesweeper/SingleplayerMinesweeper';

export default class Player {
    id!: string;
    name: string;
    color!: string;
    startingCell!: Cell;
    playerState: PlayerState;
    lives!: number;
    protected game!: Minesweeper;
    protected openedCellsCount = 0;

    constructor(name: string) {
        this.name = name;
        this.playerState = PlayerState.Ready;
    }

    setGame(game: Minesweeper): void {
        this.game = game;
    }

    setStartingCell(cell: Cell): void {
        this.startingCell = cell;
    }

    setOpenedCellsCount(cellsOpened: number): void {
        this.openedCellsCount = cellsOpened;
        if (this.game instanceof SingleplayerMinesweeper) {
            if (this.game.cellsToOpenCount === this.openedCellsCount) {
                this.game.setPlayerWon(this);
            }
        }
    }

    incOpenedCellsCount(cellsOpened = 1): void {
        this.openedCellsCount += cellsOpened;
        if (this.game instanceof SingleplayerMinesweeper) {
            if (this.game.cellsToOpenCount === this.openedCellsCount) {
                this.game.setPlayerWon(this);
            }
        }
    }

    getOpenedCellsCount(): number {
        return this.openedCellsCount;
    }
}
