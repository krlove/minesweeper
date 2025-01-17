<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="box">
        <div class="game">
            <div class="game-dashboard level">
                <div class="level-left level-item">
                    <players-dashboard
                            v-bind:players="minesweeper.players"
                            v-bind:cells-to-open-count="minesweeper.cellsToOpenCount"
                            v-bind:player-lives-count="minesweeper.lives"
                    ></players-dashboard>
                </div>
                <div class="level-right level-item">
                    <div class="buttons">
                        <button class="button is-small" v-on:click="restartGame()">Restart</button>
                        <router-link
                                tag="button"
                                class="button is-small"
                                :to="{ path: '/play' }"
                        >
                            Quit game
                        </router-link>
                    </div>
                </div>
            </div>

            <camera
                    class="game-camera"
                    v-bind:scene-width="sceneWidth"
                    v-bind:scene-height="sceneHeight"
            >
                <template v-slot:field>
                    <div class="game-field">
                        <template v-for="(row, i) in cells">
                            <template v-for="(cell, j) in row">
                                <cell-square
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
                    <div v-if="minesweeper.gameState === GameState.Finished" class="game-result-overlay">
                        <div class="title is-1 has-text-white">Game over</div>
                    </div>
                </template>
            </camera>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Cell from "@/app/minesweeper/Cell";
    import CellSquare from "@/components/CellSquare.vue";
    import Camera from "@/components/Camera.vue";
    import Player from "@/app/minesweeper/Player";
    import {OpenedNeighbourCells, GameState} from "@/app/minesweeper/enum";
    import PlayersDashboard from "@/components/PlayersDashboard.vue";
    import GameBuilder from "@/app/minesweeper/GameBuilder";
    import PlayerBuilder from "@/app/minesweeper/PlayerBuilder";
    import ComputerPlayerBuilder from "@/app/minesweeper/ComputerPlayerBuilder";
    import ComputerPlayer from "@/app/minesweeper/ComputerPlayer";
    import Minesweeper from "@/app/minesweeper/Minesweeper";

    @Component({
        components: {PlayersDashboard, Camera, CellSquare}
    })
    export default class GameField extends Vue {
        @Prop() width!: number;
        @Prop() height!: number;
        @Prop() mines!: number;
        @Prop() speed!: number;
        @Prop() lives!: number;

        cells: Cell[][] = [];
        private minesweeper!: Minesweeper;
        private currentPlayer!: Player;
        private sceneWidth = 0;
        private sceneHeight = 0;

        private GameState = GameState;

        created() {
            if (this.width) {
                this.sceneWidth = this.width * 30;
            }
            if (this.height) {
                this.sceneHeight = this.height * 30;
            }

            this.startGame();
        }

        startGame(): void {
            const humanPlayerBuilder = PlayerBuilder
                .newInstance()
                .setName('You')
                .setStartingCellX(0)
                .setStartingCellY(0)
                .setLives(this.lives);

            const computerPlayerBuilder = ComputerPlayerBuilder
                .newInstance()
                .setName('Computer')
                .setStartingCellX(this.width - 1)
                .setStartingCellY(this.height - 1)
                .setLives(this.lives)
                .setSpeed(this.speed);

            this.minesweeper = GameBuilder
                .newInstance()
                .setWidth(this.width)
                .setHeight(this.height)
                .setMinesRandomPlacement(true)
                .setMines(this.mines)
                .setLives(this.lives)
                .addPlayerBuilder(humanPlayerBuilder)
                .addPlayerBuilder(computerPlayerBuilder)
                .create();

            this.minesweeper.players.map(player => {
                if (!(player instanceof ComputerPlayer)) {
                    this.currentPlayer = player;
                }
            });

            // init minesweeper
            this.minesweeper.initialize();
            this.cells = this.minesweeper.cells;

            // start minesweeper
            this.minesweeper.start();

            this.minesweeper.players.map(player => {
                if (player instanceof ComputerPlayer) {
                    player.playGame();
                }
            });
        }

        restartGame(): void {
            // drop references so Vue can update dashboard component
            this.minesweeper.players = [];
            this.startGame();
        }

        onFlagCell(cell: Cell): void {
            this.minesweeper.setCellFlagged(cell, !cell.isFlagged(), this.currentPlayer);
        }

        onOpenCell(cell: Cell): void {
            this.minesweeper.openCell(cell, this.currentPlayer, OpenedNeighbourCells.Unknown);
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
</style>
