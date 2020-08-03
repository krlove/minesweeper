import {DoublyLinkedList, Node} from "@/app/util/doubly-linked-list";
import Cell from "@/app/minesweeper/cell";
import Minesweeper from "@/app/minesweeper/minesweeper";
import Action from "@/app/minesweeper/solver/action";
import ComputerPlayer from '@/app/minesweeper/computer-player';

export default class DirectSolver {
    private game: Minesweeper;
    private player: ComputerPlayer;
    private cellsToAnalyze: DoublyLinkedList<Cell>;
    private internalFlags: boolean[][];

    constructor(game: Minesweeper, player: ComputerPlayer) {
        this.game = game;
        this.player = player;
        this.internalFlags = this.player.getInternalFlags();
    }

    initialize(): void {
        this.cellsToAnalyze = new DoublyLinkedList<Cell>();
        for (let i = 0; i < this.game.width; i++) {
            for (let j = 0; j < this.game.height; j++) {
                const cell = this.game.cells[i][j];

                if (!cell.isOpenedBy(this.player)) {
                    continue;
                }

                if (cell.neighbourMinesCount === 0) {
                    continue;
                }

                this.cellsToAnalyze.append(cell);
            }
        }
    }

    *solve(): Generator<Action> {
        let firstNoActionNode: Node<Cell>|undefined = undefined;
        for (const node of this.cellsToAnalyze.iterate()) {
            const cell = node.value;

            const flaggedOrExplodedNeighbourCellsCount = this.player.getFlaggedOrExplodedNeighbourCellsCount(cell);
            if (flaggedOrExplodedNeighbourCellsCount === cell.neighbourMinesCount) {
                for (const neighbourCell of this.game.iterateNeighbours(cell)) {
                    if (!neighbourCell.isOpened() && !this.internalFlags[neighbourCell.x][neighbourCell.y]) {
                        firstNoActionNode = undefined;
                        yield Action.open(neighbourCell);
                    }
                }
                this.cellsToAnalyze.remove(node);

                continue;
            }

            let closedOrExplodedNeighbourCellsCount = 0;
            for (const neighbourCell of this.game.iterateNeighbours(cell)) {
                if (!neighbourCell.isOpened() || neighbourCell.isExploded()) {
                    closedOrExplodedNeighbourCellsCount++;
                }
            }

            if (closedOrExplodedNeighbourCellsCount === cell.neighbourMinesCount) {
                for (const neighbourCell of this.game.iterateNeighbours(cell)) {
                    if (!neighbourCell.isOpened() && !this.internalFlags[neighbourCell.x][neighbourCell.y]) {
                        firstNoActionNode = undefined;
                        yield Action.flag(neighbourCell);
                    }
                }
                this.cellsToAnalyze.remove(node);

                continue;
            }

            if (node === firstNoActionNode) {
                return;
            }
            if (firstNoActionNode === undefined) {
                firstNoActionNode = node;
            }
        }
    }

    addCellToAnalyse(cell: Cell): void {
        this.cellsToAnalyze.append(cell);
    }
}
