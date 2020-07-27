<template>
    <div>
        <div class="controls">
            <div class="field mb-5">
                <div class="control">
                    <div class="buttons has-addons">
                        <button
                                class="button"
                                v-bind:class="{ 'is-link': mode === Mode.Beginner }"
                                v-on:click="setMode(Mode.Beginner)"
                        >Beginner</button>
                        <button
                                class="button"
                                v-bind:class="{ 'is-link': mode === Mode.Intermediate }"
                                v-on:click="setMode(Mode.Intermediate)"
                        >Intermediate</button>
                        <button
                                class="button"
                                v-bind:class="{ 'is-link': mode === Mode.Expert }"
                                v-on:click="setMode(Mode.Expert)"
                        >Expert</button>
                        <button
                                class="button"
                                v-bind:class="{ 'is-link': mode === Mode.Custom }"
                                v-on:click="setMode(Mode.Custom)"
                        >Custom</button>
                    </div>
                </div>
            </div>

            <div class="field">
                <div class="control columns is-vcentered">
                    <div class="column is-3">
                        <label class="label">Width</label>
                    </div>
                    <div class="column is-7 has-text-centered">
                        <input
                                class="slider has-output is-fullwidth is-dark is-small"
                                min="20"
                                max="60"
                                step="1"
                                type="range"
                                v-model="width"
                                :disabled="mode !== Mode.Custom"
                        >
                    </div>
                    <div class="column is-2">
                        <span class="tag is-dark">{{ width }}</span>
                    </div>
                </div>
            </div>

            <div class="field">
                <div class="control columns is-vcentered">
                    <div class="column is-3">
                        <label class="label">Height</label>
                    </div>
                    <div class="column is-7 has-text-centered">
                        <input
                                class="slider has-output is-fullwidth is-dark is-small"
                                min="10"
                                max="40"
                                step="1"
                                type="range"
                                v-model="height"
                                :disabled="mode !== Mode.Custom"
                        >
                    </div>
                    <div class="column is-2">
                        <span class="tag is-dark">{{ height }}</span>
                    </div>
                </div>
            </div>

            <div class="field">
                <div class="control columns is-vcentered">
                    <div class="column is-3">
                        <label class="label">Mines</label>
                    </div>
                    <div class="column is-7 has-text-centered">
                        <input
                                class="slider has-output is-fullwidth is-dark is-small"
                                min="40"
                                max="500"
                                step="5"
                                type="range"
                                v-model="mines"
                                :disabled="mode !== Mode.Custom"
                        >
                    </div>
                    <div class="column is-2">
                        <span class="tag is-dark">{{ mines }}</span>
                    </div>
                </div>
            </div>

            <div class="field my-5">
                <div class="control columns is-vcentered">
                    <div class="column is-3">
                        <label class="label">Player lives</label>
                    </div>
                    <div class="column is-7 has-text-centered">
                        <lives
                                v-bind:total="5"
                                v-bind:selectable=true
                                v-bind:disabled="mode !== Mode.Custom"
                                v-model="lives"
                        ></lives>
                    </div>
                    <div class="column is-2">
                        <span class="tag is-dark">{{ lives }}</span>
                    </div>
                </div>
            </div>

            <div class="field" v-if="vsComputer">
                <div class="control columns is-vcentered">
                    <div class="column is-3">
                        <label class="label">Computer speed</label>
                    </div>
                    <div class="column is-7 has-text-centered">
                        <input
                                class="slider has-output is-fullwidth is-dark is-small"
                                min="1"
                                max="10"
                                step="1"
                                type="range"
                                v-model="speed"
                                :disabled="mode !== Mode.Custom"
                        >
                    </div>
                    <div class="column is-2">
                        <span class="tag is-dark">{{ speed }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="buttons">
            <button class="button" v-on:click="playClick">{{ vsComputer ? 'Play' : 'Create game' }}</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import Lives from '@/components/Lives.vue';
    import {GameConfig} from '@/components/types/GameConfig';

    enum Mode {
        Beginner = 0,
        Intermediate = 1,
        Expert = 2,
        Custom = 3,
    }

    @Component({
        components: {Lives}
    })
    export default class GameOptions extends Vue {
        @Prop() vsComputer: boolean;
        @Prop() onPlayClick: (gameConfig: GameConfig) => void;

        Mode = Mode;
        mode = Mode.Beginner;
        width = 0;
        height = 0;
        mines = 0;
        speed = 0;
        lives = 0;

        private modes = {
            [Mode.Beginner]: {
                width: 30,
                height: 20,
                mines: 110,
                speed: 2,
                lives: 2,
            } as GameConfig,
            [Mode.Intermediate]: {
                width: 40,
                height: 25,
                mines: 230,
                speed: 5,
                lives: 3,
            } as GameConfig,
            [Mode.Expert]: {
                width: 50,
                height: 30,
                mines: 340,
                speed: 8,
                lives: 4,
            } as GameConfig,
        };

        created(): void {
            this.setMode(Mode.Beginner);
        }

        setMode(mode: Mode): void {
            this.mode = mode;

            if (mode in this.modes) {
                const modeConfig = this.modes[mode];
                this.width = modeConfig.width;
                this.height = modeConfig.height;
                this.mines = modeConfig.mines;
                this.speed = modeConfig.speed;
                this.lives = modeConfig.lives;
            }
        }

        playClick(): void {
            // todo what to do with the buttons?
            const gameConfig: GameConfig = {
                width: this.width,
                height: this.height,
                mines: this.mines,
                speed: this.speed,
                lives: this.lives,
            };

            this.onPlayClick(gameConfig);
        }
    }
</script>

<style scoped>
    .controls {
        margin-bottom: 3rem;
    }
</style>
