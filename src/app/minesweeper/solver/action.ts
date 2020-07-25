import Cell from "@/app/minesweeper/cell";

export enum ActionType {
    Open = 0,
    Flag = 1,
}

export default class Action {
    private readonly type: ActionType;
    private readonly cell: Cell;

    static open(cell: Cell): Action {
        return new Action(ActionType.Open, cell);
    }

    static flag(cell: Cell): Action {
        return new Action(ActionType.Flag, cell);
    }

    private constructor(type: ActionType, cell: Cell) {
        this.type = type;
        this.cell = cell;
    }

    getType(): ActionType {
        return this.type;
    }

    getCell(): Cell {
        return this.cell;
    }
}
