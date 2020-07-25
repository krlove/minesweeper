<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="game">
        <div class="game-dashboard level">
            <div class="level-left level-item">
                <players-dashboard
                        v-bind:players="this.game.players"
                        v-bind:cells-to-open-count="game.cellsToOpenCount"
                        v-bind:player-lives-count="lives"
                ></players-dashboard>
            </div>
            <div class="level-right level-item">
                <div class="buttons">
                    <button class="button is-small is-danger" v-on:click="restartGame()">Restart</button>
                    <router-link :to="{ path: '/play' }">
                        <button class="button is-small is-danger">Quit game</button>
                    </router-link>
                </div>
            </div>
        </div>

        <camera
                class="game-camera"
                v-bind:scene-width="width * 30"
                v-bind:scene-height="height * 30"
        >
            <template v-slot:field>
                <div class="game-field">
                    <template v-for="(row, i) in cells">
                        <template v-for="(cell, j) in row">
                            <cell-square
                                    v-bind:class="{ clickable: currentPlayer.state === PlayerState.Playing }"
                                    v-bind:cell="cell"
                                    :key="i + '-' + j"
                                    v-on:open-cell="onOpenCell"
                                    v-on:flag-cell="onFlagCell"
                            >
                            </cell-square>
                        </template>
                    </template>
                </div>
            </template>

            <template v-slot:result>
                <div v-if="game.state === GameState.Finished" class="game-result-overlay">
                    <div class="title is-1 has-text-white">Game over</div>
                </div>
            </template>
        </camera>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Cell from "@/app/minesweeper/cell";
    import CellSquare from "@/components/CellSquare.vue";
    import Camera from "@/components/Camera.vue";
    import Game from "@/app/minesweeper/game";
    import Player from "@/app/minesweeper/player";
    import {GameState, PlayerState} from '@/app/minesweeper/enum';
    import PlayersDashboard from "@/components/PlayersDashboard.vue";
    import GameBuilder from "@/app/minesweeper/game-builder";
    import PlayerBuilder from "@/app/minesweeper/player-builder";
    import ComputerPlayerBuilder from "@/app/minesweeper/computer-player-builder";
    import ComputerPlayer from "@/app/minesweeper/computer-player";

    @Component({
        components: {PlayersDashboard, Camera, CellSquare}
    })
    export default class GameField extends Vue {
        @Prop() width: number;
        @Prop() height: number;
        @Prop() mines: number;
        @Prop() speed: number;
        @Prop() lives: number;

        cells: Cell[][] = [];
        private game: Game;
        private currentPlayer: Player;
        private GameState = GameState;
        private PlayerState = PlayerState;

        created() {
            this.startGame();
        }

        startGame(): void {
            const humanPlayerBuilder = PlayerBuilder
                .newInstance()
                .setName('You')
                .setColor('#ffffff')
                .setStartingCellX(0)
                .setStartingCellY(0)
                .setLives(this.lives);

            const computerPlayerBuilder = ComputerPlayerBuilder
                .newInstance()
                .setName('Computer')
                .setColor('#dddddd')
                .setStartingCellX(this.width - 1)
                .setStartingCellY(this.height - 1)
                .setLives(this.lives)
                .setSpeed(this.speed);

            this.game = GameBuilder
                .newInstance()
                .setWidth(this.width)
                .setHeight(this.height)
                .setMinesRandomPlacement(true)
                .setMines(this.mines)
                .addPlayerBuilder(humanPlayerBuilder)
                .addPlayerBuilder(computerPlayerBuilder)
                .create();

            // todo how to do this more gracefully?
            this.game.players.map(player => {
                if (!(player instanceof ComputerPlayer)) {
                    this.currentPlayer = player;
                }
            });

            // init game
            this.game.initialize();
            this.cells = this.game.cells;

            // start game
            this.game.start();
            // todo how to do this more gracefully?
            this.game.players.map(player => {
                if (player instanceof ComputerPlayer) {
                    player.playGame();
                }
            });
        }

        restartGame(): void {
            // drop references so Vue can update dashboard component
            this.game.players = [];
            this.startGame();
        }

        onFlagCell(cell: Cell): void {
            this.game.setCellFlagged(cell, !cell.isFlagged(), this.currentPlayer);
        }

        onOpenCell(cell: Cell): void {
            if (!cell.isOpened()) {
                this.game.openCell(cell, this.currentPlayer);

                return;
            }

            if (cell.isOpened() && cell.neighbourMinesCount > 0 && !cell.getHasMine()) {
                const flaggedOrExplodedNeighbourCellsCount = cell.getFlaggedOrExplodedNeighbourCellsCount();
                if (flaggedOrExplodedNeighbourCellsCount !== cell.neighbourMinesCount) {
                    return;
                }

                for (const neighbourCell of this.game.iterateNeighbours(cell)) {
                    this.game.openCell(neighbourCell, this.currentPlayer);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .game-camera {
        position: relative;
    }
    .game-field {
        position: relative;
    }
    .game-result-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }
    .clickable:active {
        transform: translate(1px, 1px);
    }
</style>
