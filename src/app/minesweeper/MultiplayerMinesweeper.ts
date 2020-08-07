import {Room} from 'colyseus.js';
import Minesweeper from '@/app/minesweeper/Minesweeper';
import Player from '@/app/minesweeper/player';
import Cell from '@/app/minesweeper/cell';

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

        Object.keys(state.players).forEach(key => {
            const statePlayer = state.players[key];
            const player = new Player(statePlayer.username, '#fff');
            player.id = statePlayer.id;
            player.setGame(this);
            player.lives = statePlayer.lives;
            player.setOpenedCellsCount(statePlayer.openedCellsCount);
            this.players.push(player);
        });

        Object.keys(state.cells).forEach(key => {
            const stateCell = state.cells[key];
            const cell = new Cell(stateCell.x, stateCell.y, this);
            // todo set opened by
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

        // todo start listening for open/flag
    }

    openCell(cell: Cell, player: Player, hasOpenedNeighbourCell: number): Cell[] {
        this.room.send('cell.open', {
            x: cell.x,
            y: cell.y,
        });
        console.log('Cell opened', cell.x, cell.y);

        return [];
    }

    setCellFlagged(cell: Cell, flagged: boolean, player: Player): void {
        console.log('Flagging cell', cell.x, cell.y);
    }
}
