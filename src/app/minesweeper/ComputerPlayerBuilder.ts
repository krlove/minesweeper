import PlayerBuilder from '@/app/minesweeper/PlayerBuilder';
import ComputerPlayer from '@/app/minesweeper/ComputerPlayer';

export default class ComputerPlayerBuilder extends PlayerBuilder {
    protected speed: number;

    static newInstance(): ComputerPlayerBuilder {
        return new ComputerPlayerBuilder();
    }

    setSpeed(speed: number): this {
        this.speed = speed;

        return this;
    }

    create(): ComputerPlayer {
        const player = super.create();

        if (player instanceof ComputerPlayer) {
            player.setSpeed(this.speed);

            return player;
        }

        throw new Error('"player" must be of ComputerPlayer type');
    }

    protected createPlayerInstance(): ComputerPlayer {
        return new ComputerPlayer(this.name);
    }
}
