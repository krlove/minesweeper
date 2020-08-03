import Cell from "@/app/minesweeper/cell";
import Minesweeper from "@/app/minesweeper/minesweeper";
import {PlayerState} from "@/app/minesweeper/enum";

export default class Player {
    name: string;
    color: string;
    startingCell: Cell;
    state: PlayerState;
    lives: number;
    protected game: Minesweeper;
    protected openedCellsCount = 0;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.state = PlayerState.Ready;
    }

    setGame(game: Minesweeper): void {
        this.game = game;
    }

    setStartingCell(cell: Cell): void {
        this.startingCell = cell;
    }

    incOpenedCellsCount(cellsOpened = 1): void {
        this.openedCellsCount += cellsOpened;
    }

    getOpenedCellsCount(): number {
        return this.openedCellsCount;
    }
}
