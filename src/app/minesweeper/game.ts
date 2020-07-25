import Cell from './cell';
import {GameState, OpenedNeighbourCells, PlayerState} from './enum';
import Player from "@/app/minesweeper/player";

export default class Game {
    readonly startingLocationRadius = 3;

    state: GameState = GameState.Uninitialized;
    width: number;
    height: number;
    mines: number;
    cells: Cell[][] = [];
    players: Player[] = [];
    cellsToOpenCount: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.players = [];

        this.createCells();
    }

    setMines(mines: number): void {
        this.mines = mines;
    }

    initialize(): void {
        this.placeMines();
        this.cellsToOpenCount = Math.floor((this.width * this.height - this.mines) / 2) + 1;
        this.players.map((player: Player) => {
            this.doOpenCell(player.startingCell, player, OpenedNeighbourCells.AtLeastOne)
        });
        this.setState(GameState.Initialized);
    }

    addPlayer(player: Player): void {
        player.setGame(this);
        this.players.push(player);
    }

    start(): void {
        this.setState(GameState.Started);
        for (const player of this.players) {
            player.state = PlayerState.Playing;
        }
    }

    openCell(cell: Cell, player: Player, hasOpenedNeighbourCell: number = OpenedNeighbourCells.Unknown): Cell[] {
        if (this.state !== GameState.Started && this.state !== GameState.Uninitialized) {
            return [];
        }

        if (player.state !== PlayerState.Playing && player.state !== PlayerState.Ready) {
            return [];
        }

        return this.doOpenCell(cell, player, hasOpenedNeighbourCell);
    }

    setCellFlagged(cell: Cell, flagged: boolean, player: Player): void {
        if (this.state !== GameState.Started) {
            return;
        }

        if (player.state !== PlayerState.Playing) {
            return;
        }

        if (cell.isOpened()) {
            return;
        }

        if (!this.hasOpenedNeighbourCell(cell, player)) {
            return;
        }

        cell.setFlagged(flagged);
    }

    setState(state: GameState): void {
        this.state = state;
    }

    setPlayerWon(player: Player): void {
        player.state = PlayerState.Won;
        for (let i = 0; i < this.players.length; i++) {
            const iteratedPlayer = this.players[i];
            if (iteratedPlayer === player) {
                continue;
            }
            iteratedPlayer.state = PlayerState.Lost;
        }
        this.setState(GameState.Finished);
    }

    setPlayerLost(player: Player): void {
        player.state = PlayerState.Lost;
        let atLeastOnePlayerStillPlaying = false;
        for (const iteratedPlayer of this.players) {
            if (iteratedPlayer.state === PlayerState.Playing) {
                atLeastOnePlayerStillPlaying = true;

                break;
            }
        }

        if (!atLeastOnePlayerStillPlaying) {
            this.setState(GameState.Finished);
        }
    }

    playerExplodes(player: Player, cell: Cell): void {
        cell.explode();
        player.lives--;
        if (player.lives === 0) {
            this.setPlayerLost(player);
        }
    }

    *iterateNeighbours(cell: Cell): Generator<Cell> {
        for (let i = cell.x - 1; i <= cell.x + 1; i++) {
            if (!this.isXInsideTheField(i)) {
                continue;
            }

            for (let j = cell.y - 1; j <= cell.y + 1; j++) {
                if (!this.isYInsideTheField(j)) {
                    continue;
                }

                if (i === cell.x && j === cell.y) {
                    continue;
                }

                yield this.cells[i][j];
            }
        }
    }

    private isXInsideTheField(x: number): boolean {
        return x >= 0 && x < this.width;
    }

    private isYInsideTheField(y: number): boolean {
        return y >= 0 && y < this.height;
    }

    private doOpenCell(
        cell: Cell,
        player: Player,
        hasOpenedNeighbourCell: number = OpenedNeighbourCells.Unknown
    ): Cell[] {
        let openedCells = [] as Cell[];
        if (cell.isOpened() || cell.isFlagged()) {
            return openedCells;
        }

        if (hasOpenedNeighbourCell === OpenedNeighbourCells.AtLeastOne || this.hasOpenedNeighbourCell(cell, player)) {
            cell.setOpened(player);
            openedCells.push(cell);

            if (cell.getHasMine()) {
                this.playerExplodes(player, cell);

                return openedCells;
            }

            if (cell.neighbourMinesCount === 0) {
                for (const neighbourCell of this.iterateNeighbours(cell)) {
                    const newlyOpenedCells = this.doOpenCell(neighbourCell, player, OpenedNeighbourCells.AtLeastOne);
                    openedCells = openedCells.concat(newlyOpenedCells);
                }
            }
        }

        return openedCells;
    }

    private createCells(): void {
        const cells: Cell[][] = [];

        for (let x = 0; x < this.width; x++) {
            cells[x] = [];
            for (let y = 0; y < this.height; y++) {
                cells[x][y] = new Cell(x, y, this);
            }
        }

        this.cells = cells;
    }

    private placeMines(): void {
        let minesPlaced = 0;
        const startingLocationRadiusSquare = Math.pow(this.startingLocationRadius, 2);

        minesLoop:
        while (minesPlaced < this.mines) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const cell = this.cells[x][y];

            if (cell.getHasMine() || cell.isOpened()) {
                continue;
            }

            for (const player of this.players) {
                const xSquare = Math.pow(x - player.startingCell.x, 2);
                const ySquare = Math.pow(y - player.startingCell.y, 2);
                if (xSquare + ySquare <= startingLocationRadiusSquare) {
                    continue minesLoop;
                }
            }

            cell.setHasMine(true);

            minesPlaced++;
        }
    }

    private hasOpenedNeighbourCell(cell: Cell, openedBy: Player): boolean {
        for (const neighbourCell of this.iterateNeighbours(cell)) {
            if (neighbourCell.isOpenedBy(openedBy)) {
                return true;
            }
        }

        return false;
    }
}
