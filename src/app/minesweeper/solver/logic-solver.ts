import Cell from "@/app/minesweeper/cell";
import {combinations} from "@/app/util/k_combinations";
import Game from "@/app/minesweeper/game";
import * as logic from "logicjs/logic";
import Action from "@/app/minesweeper/solver/action";
import ComputerPlayer from '@/app/minesweeper/computer-player';

export default class LogicSolver {
    private game: Game;
    private player: ComputerPlayer;
    private internalFlags: boolean[][];

    constructor(game: Game, player: ComputerPlayer) {
        this.game = game;
        this.player = player;
        this.internalFlags = this.player.getInternalFlags();
    }

    *solve(): Generator<Action> {
        const segregatedList = this.findSegregatedList();
        const notCertainProbabilities: Probability[] = [];
        let foundAtLeastOneSolution = false;

        const and = logic.and;
        const or = logic.or;
        const eq = logic.eq;
        const run = logic.run;
        const lvar = logic.lvar;

        for (let i = 0; i < segregatedList.length; i++) {
            const segregated = segregatedList[i];
            const closedLVars = new Map();
            const ruleArgs = [];

            for (const cell of segregated) {
                const closedNeighbourLVars = [];
                let flaggedOrExplodedNeighbourCellsCount = 0;
                for (const neighbourCell of this.game.iterateNeighbours(cell)) {
                    if (this.internalFlags[neighbourCell.x][neighbourCell.y] || neighbourCell.isExploded()) {
                        flaggedOrExplodedNeighbourCellsCount++;

                        continue;
                    }

                    if (!neighbourCell.isOpened()) {
                        const key = neighbourCell.x + '-' + neighbourCell.y;
                        let closedLVar;
                        if (closedLVars.has(key)) {
                            closedLVar = closedLVars.get(key);
                        } else {
                            closedLVar = lvar(neighbourCell);
                            closedLVars.set(key, closedLVar);
                        }
                        closedNeighbourLVars.push(closedLVar);
                    }
                }

                const combs = combinations(
                    closedNeighbourLVars,
                    cell.neighbourMinesCount - flaggedOrExplodedNeighbourCellsCount
                );

                const orArgs = [];
                for (const comb of combs) {
                    const andArgs = [];
                    comb.forEach((isFlagged, index) => {
                        andArgs.push(eq(closedNeighbourLVars[index], isFlagged));
                    });
                    orArgs.push(and.apply(null, andArgs));
                }
                ruleArgs.push(or.apply(null, orArgs));
            }
            const rule = and.apply(null, ruleArgs);
            const closedLVarArray = Array.from(closedLVars.values());
            const closedCellsArray = closedLVarArray.map((closedLVar) => closedLVar.name);
            const probabilities = run(rule, closedLVarArray);

            const composedProbabilities = LogicSolver.composeProbabilities(closedCellsArray, probabilities);
            for (const probability of composedProbabilities) {
                if (probability.hasMine()) {
                    foundAtLeastOneSolution = true;
                    yield Action.flag(probability.cell);
                } else if (probability.isEmpty()) {
                    foundAtLeastOneSolution = true;
                    yield Action.open(probability.cell);
                } else {
                    notCertainProbabilities.push(probability);
                }
            }
        }

        if (!foundAtLeastOneSolution && notCertainProbabilities.length > 0) {
            const highestProbabilityOfBeingEmpty = notCertainProbabilities.reduce(
                (curProb: Probability, prevProb: Probability) => {
                    return curProb.getProbabilityOfBeingEmpty() > prevProb.getProbabilityOfBeingEmpty()
                        ? curProb
                        : prevProb;
                }, notCertainProbabilities[0]);

            yield Action.open(highestProbabilityOfBeingEmpty.cell);
        }
    }

    private findSegregatedList(): Cell[][] {
        const segregatedList: Cell[][] = [];
        const registeredCellsSet: Set<Cell> = new Set();

        for (let i = 0; i < this.game.width; i++) {
            for (let j = 0; j < this.game.height; j++) {
                const cell = this.game.cells[i][j];

                const segregated: Cell[] = [];
                this.findSegregatedStartingFrom(cell, segregated, registeredCellsSet, undefined);

                if (segregated.length > 0) {
                    segregatedList.push(segregated);
                }
            }
        }

        return segregatedList;
    }

    private findSegregatedStartingFrom(
        cell: Cell,
        segregated: Cell[],
        registeredCellsSet: Set<Cell>,
        previousCell?: Cell
    ): void {
        if (
            !cell.isOpenedBy(this.player)
            || cell.neighbourMinesCount === 0
            || registeredCellsSet.has(cell)
        ) {
            return;
        }

        let flaggedOrExplodedNeighbourCellsCount = this.player.getFlaggedOrExplodedNeighbourCellsCount(cell);
        if (flaggedOrExplodedNeighbourCellsCount === cell.neighbourMinesCount) {
            return;
        }

        if (previousCell && !this.hasCommonClosedNeighbours(cell, previousCell)) {
            return;
        }

        segregated.push(cell);
        registeredCellsSet.add(cell);

        for (const neighbourCell of this.game.iterateNeighbours(cell)) {
            this.findSegregatedStartingFrom(neighbourCell, segregated, registeredCellsSet, cell);
        }
    }

    private hasCommonClosedNeighbours(cell1: Cell, cell2: Cell): boolean {
        const neighboursSet1: Set<Cell> = new Set();
        for (const neighbourCell of this.game.iterateNeighbours(cell1)) {
            neighboursSet1.add(neighbourCell);
        }

        const neighboursSet2: Set<Cell> = new Set();
        for (const neighbourCell of this.game.iterateNeighbours(cell2)) {
            neighboursSet2.add(neighbourCell);
        }

        const intersection = [...neighboursSet1]
            .filter(cell => neighboursSet2.has(cell) && !cell.isOpened() && !this.internalFlags[cell.x][cell.y]);

        return intersection.length > 0;
    }

    private static composeProbabilities(cells: Cell[], rawProbabilities: boolean[][]): Probability[] {
        const probabilities: Probability[] = [];
        for (let i = 0; i < cells.length; i++) {
            const probability = new Probability(cells[i]);
            for (let j = 0; j < rawProbabilities.length; j++) {
                probability.total++;
                if (rawProbabilities[j][i]) {
                    probability.hasMineCount++;
                } else {
                    probability.isEmptyCount++;
                }
            }
            probabilities.push(probability);
        }

        return probabilities;
    }
}

class Probability {
    cell: Cell;
    total = 0;
    hasMineCount = 0;
    isEmptyCount = 0;

    constructor(cell: Cell) {
        this.cell = cell;
    }

    hasMine(): boolean {
        return this.getProbabilityOfHavingMine() === 100;
    }

    isEmpty(): boolean {
        return this.getProbabilityOfBeingEmpty() === 100;
    }

    getProbabilityOfBeingEmpty(): number {
        return this.isEmptyCount * 100 / this.total;
    }

    getProbabilityOfHavingMine(): number {
        return this.hasMineCount * 100 / this.total;
    }
}
