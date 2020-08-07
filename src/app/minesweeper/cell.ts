import Player from "@/app/minesweeper/player";
import Minesweeper from '@/app/minesweeper/Minesweeper';
import SingleplayerMinesweeper from '@/app/minesweeper/SingleplayerMinesweeper';

export default class Cell {
    public x: number;
    public y: number;
    public neighbourMinesCount = 0;
    public openedBy: Player;
    private hasMine = false;
    private game: Minesweeper;
    private opened = false;
    private flagged = false;
    private exploded = false;

    constructor(x: number, y: number, game: Minesweeper) {
        this.x = x;
        this.y = y;
        this.game = game;
    }

    setHasMine(hasMine: boolean): void {
        this.hasMine = hasMine;

        if (this.game instanceof SingleplayerMinesweeper) {
            for (const neighbourCell of this.game.iterateNeighbours(this)) {
                neighbourCell.neighbourMinesCount += this.hasMine ? 1 : -1;
            }
        }
    }

    getHasMine(): boolean {
        return this.hasMine;
    }

    setOpened(playerOpened: Player): void {
        this.opened = true;
        this.openedBy = playerOpened;
        if (this.game instanceof SingleplayerMinesweeper) {
            playerOpened.incOpenedCellsCount();
        }
    }

    isOpened(): boolean {
        return this.opened;
    }

    isOpenedBy(openedBy: Player): boolean {
        return this.opened && this.openedBy === openedBy;
    }

    setFlagged(flagged: boolean): void {
        this.flagged = flagged;
    }

    isFlagged(): boolean {
        return this.flagged;
    }

    isExploded(): boolean {
        return this.exploded;
    }

    explode(): void {
        this.exploded = true;
    }

    getFlaggedOrExplodedNeighbourCellsCount(): number {
        let count = 0;
        for (const neighbourCell of this.game.iterateNeighbours(this)) {
            if (neighbourCell.isFlagged() || neighbourCell.isExploded()) {
                count++;
            }
        }

        return count;
    }
}
