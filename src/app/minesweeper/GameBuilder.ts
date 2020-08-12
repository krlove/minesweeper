import SingleplayerMinesweeper from '@/app/minesweeper/SingleplayerMinesweeper';
import PlayerBuilder from '@/app/minesweeper/PlayerBuilder';

export default class GameBuilder {
    private width!: number;
    private height!: number;
    private mines!: number;
    private lives!: number;
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

    setLives(lives: number): GameBuilder {
        this.lives = lives;

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
    
    create(): SingleplayerMinesweeper {
        const game = new SingleplayerMinesweeper(this.width, this.height, this.mines, this.lives);

        this.playerBuilders.map(playerBuilder => {
            playerBuilder.setGame(game);
            const player = playerBuilder.create();
            game.addPlayer(player);
        });

        return game;
    }
}
