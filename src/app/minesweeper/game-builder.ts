import Minesweeper from '@/app/minesweeper/minesweeper';
import PlayerBuilder from '@/app/minesweeper/player-builder';

export default class GameBuilder {
    private width: number;
    private height: number;
    private mines: number;
    private minesRandomPlacement = false;
    private playerBuilders: PlayerBuilder[] = [];

    static newInstance(): GameBuilder {
        return new GameBuilder();
    }
    
    setWidth(width: number): GameBuilder {
        this.width = width;

        return this;
    }
    
    setHeight(height: number): GameBuilder {
        this.height = height;

        return this;
    }
    
    setMines(mines: number): GameBuilder {
        this.mines = mines;

        return this;
    }
    
    setMinesRandomPlacement(minesRandomPlacement: boolean): GameBuilder {
        this.minesRandomPlacement = minesRandomPlacement;

        return this;
    }
    
    addPlayerBuilder(playerBuilder: PlayerBuilder): GameBuilder {
        this.playerBuilders.push(playerBuilder);

        return this;
    }
    
    create(): Minesweeper {
        const game = new Minesweeper(this.width, this.height);
        if (this.minesRandomPlacement) {
            game.setMines(this.mines);
        }

        this.playerBuilders.map(playerBuilder => {
            playerBuilder.setGame(game);
            const player = playerBuilder.create();
            game.addPlayer(player);
        });

        return game;
    }
}
