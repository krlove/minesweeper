import Cell from "@/app/minesweeper/cell";
import Game from "@/app/minesweeper/game";
import {PlayerState} from "@/app/minesweeper/enum";

export default class Player {
    name: string;
    color: string;
    startingCell: Cell;
    state: PlayerState;
    lives: number;
    protected game: Game;
    protected openedCellsCount = 0;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.state = PlayerState.Ready;
    }

    setGame(game: Game): void {
        this.game = game;
    }

    setStartingCell(cell: Cell): void {
        this.startingCell = cell;
    }

    incOpenedCellsCount(cellsOpened = 1): void {
        this.openedCellsCount += cellsOpened;
        if (this.game.cellsToOpenCount === this.openedCellsCount) {
            this.game.setPlayerWon(this);
        }
    }

    getOpenedCellsCount(): number {
        return this.openedCellsCount;
    }
}
