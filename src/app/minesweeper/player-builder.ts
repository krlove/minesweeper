import Player from '@/app/minesweeper/player';
import SingleplayerMinesweeper from '@/app/minesweeper/SingleplayerMinesweeper';

export default class PlayerBuilder {
    protected name: string;
    protected color: string;
    protected startingCellX: number;
    protected startingCellY: number;
    protected lives: number;
    protected game: SingleplayerMinesweeper;
    
    static newInstance(): PlayerBuilder {
        return new PlayerBuilder();
    }
    
    setName(name: string): this {
        this.name = name;
        
        return this;
    }
    
    setColor(color: string): this {
        this.color = color;
        
        return this;
    }
    
    setStartingCellX(startingCellX: number): this {
        this.startingCellX = startingCellX;
        
        return this;
    }
    
    setStartingCellY(startingCellY: number): this {
        this.startingCellY = startingCellY;
        
        return this;
    }
    
    setLives(lives: number): this {
        this.lives = lives;
        
        return this;
    }

    setGame(game: SingleplayerMinesweeper): this {
        this.game = game;

        return this;
    }

    create(): Player {
        const player = this.createPlayerInstance();
        player.lives = this.lives;

        const startingCell = this.game.cells[this.startingCellX][this.startingCellY];
        player.setStartingCell(startingCell);

        return player;
    }

    protected createPlayerInstance(): Player {
        return new Player(this.name, this.color);
    }
}
