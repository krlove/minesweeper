import Player from '@/app/minesweeper/Player';
import DirectSolver from '@/app/minesweeper/solver/DirectSolver';
import SingleplayerMinesweeper from '@/app/minesweeper/SingleplayerMinesweeper';
import LogicSolver from '@/app/minesweeper/solver/LogicSolver';
import Action, {ActionType} from '@/app/minesweeper/solver/Action';
import {GameState, OpenedNeighbourCells, PlayerState} from '@/app/minesweeper/enum';
import {sleep} from '@/app/util/time';
import Cell from '@/app/minesweeper/cell';

export default class ComputerPlayer extends Player {
    private speed: number;
    private directSolver: DirectSolver;
    private logicSolver: LogicSolver;
    private moveTimeMs: number;
    private internalFlags: boolean[][];

    setGame(game: SingleplayerMinesweeper): void {
        super.setGame(game);
        this.initializeInternalFlags();

        this.directSolver = new DirectSolver(game, this);
        this.logicSolver = new LogicSolver(game, this);
    }

    setSpeed(speed: number): void {
        this.speed = speed;
        this.moveTimeMs = 1200 - this.speed * 100;
    }

    getInternalFlags(): boolean[][] {
        return this.internalFlags;
    }

    getFlaggedOrExplodedNeighbourCellsCount(cell: Cell): number {
        let count = 0;
        for (const neighbourCell of this.game.iterateNeighbours(cell)) {
            if (this.internalFlags[neighbourCell.x][neighbourCell.y] || neighbourCell.isExploded()) {
                count++;
            }
        }

        return count;
    }

    async playGame(): Promise<void> {
        let atLeastOneActionTaken;
        do {
            atLeastOneActionTaken = false;
            this.directSolver.initialize();
            for (const action of this.directSolver.solve()) {
                await sleep(this.moveTimeMs);
                this.handleAction(action);
                atLeastOneActionTaken = true;
            }

            for (const action of this.logicSolver.solve()) {
                await sleep(this.moveTimeMs);
                this.handleAction(action);
                atLeastOneActionTaken = true;
            }
        } while (atLeastOneActionTaken && this.game.state === GameState.Started && this.playerState === PlayerState.Playing);
    }

    private handleAction(action: Action): void {
        const cell = action.getCell();

        switch (action.getType()) {
            case ActionType.Open:
                if (cell.isFlagged()) {
                    this.game.setCellFlagged(cell, false, this);
                }
                const openedCells = this.game.openCell(cell, this, OpenedNeighbourCells.AtLeastOne);
                for (const openedCell of openedCells) {
                    this.directSolver.addCellToAnalyse(openedCell);
                }

                break;
            case ActionType.Flag:
                this.game.setCellFlagged(cell, true, this);
                this.internalFlags[cell.x][cell.y] = true;

                break;
            default:
                // do nothing
        }
    }

    private initializeInternalFlags(): void {
        const flags: boolean[][] = [];
        for (let i = 0; i < this.game.width; i++) {
            flags[i] = [];
            for (let j = 0; j < this.game.height; j++) {
                flags[i][j] = false;
            }
        }

        this.internalFlags = flags;
    }
}
