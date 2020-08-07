import {Room} from 'colyseus.js';
import Minesweeper from '@/app/minesweeper/Minesweeper';
import Player from '@/app/minesweeper/Player';
import Cell from '@/app/minesweeper/Cell';

export default class MultiplayerMinesweeper extends Minesweeper {
    private room: Room;

    constructor(room: Room) {
        super();
        this.room = room;
        const state = this.room.state;
        this.width = state.width;
        this.height = state.height;
        this.mines = state.mines;
        this.lives = state.lives;
        this.cellsToOpenCount = state.cellsToOpenCount;

        this.room.onStateChange((state) => {
            this.state = state.gameState;
            console.log(state.gameState);
        });

        Object.keys(state.players).forEach(key => {
            const statePlayer = state.players[key];
            const player = new Player(statePlayer.username, '#fff');
            player.id = statePlayer.id;
            player.setGame(this);
            player.lives = statePlayer.lives;
            player.setOpenedCellsCount(statePlayer.openedCellsCount);
            this.players.push(player);
        });

        this.room.state.players.onChange = (statePlayer: any, key: string) => {
            const player = this.players.find(p => p.id === key);
            if (!player) {
                return;
            }
            player.lives = statePlayer.lives;
            player.setOpenedCellsCount(statePlayer.openedCellsCount);
        };

        Object.keys(state.cells).forEach(key => {
            const stateCell = state.cells[key];
            const cell = new Cell(stateCell.x, stateCell.y, this);
            cell.setHasMine(stateCell.hasMine);
            cell.setFlagged(stateCell.flagged);
            cell.neighbourMinesCount = stateCell.neighbourMinesCount;

            if (stateCell.opened) {
                const playerOpened = this.players.find(p => p.id === stateCell.openedBy);
                if (playerOpened) {
                    cell.setOpened(playerOpened);
                }
            }

            if (!this.cells[stateCell.x]) {
                this.cells[stateCell.x] = [];
            }

            this.cells[stateCell.x][stateCell.y] = cell;
        });

        this.room.state.cells.onChange = (stateCell: any) => {
            const cell = this.cells[stateCell.x][stateCell.y];

            // cell has been opened
            if (cell.isOpened() !== stateCell.opened) {
                // todo check explosion
                const playerOpened = this.players.find(p => p.id === stateCell.openedBy);
                if (playerOpened) {
                    cell.setOpened(playerOpened);
                }
            }

            if (cell.isFlagged() !== stateCell.flagged) {
                cell.setFlagged(stateCell.flagged);
            }
        };
    }

    openCell(cell: Cell, player: Player, hasOpenedNeighbourCell: number): Cell[] {
        this.room.send('cell.open', {
            x: cell.x,
            y: cell.y,
        });

        return [];
    }

    setCellFlagged(cell: Cell, flagged: boolean, player: Player): void {
        this.room.send('cell.flag', {
            x: cell.x,
            y: cell.y,
            flagged: flagged,
        });
    }
}
