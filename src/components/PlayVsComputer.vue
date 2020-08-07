<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box px-6 py-6">
                <p class="title">Play vs computer</p>

                <game-options
                    v-bind:vs-computer="true"
                    v-bind:on-play-click="onPlayClick"
                ></game-options>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import GameOptions from '@/components/GameOptions.vue';
    import {GameConfig} from "@/components/types/GameConfig";

    @Component({
        components: {GameOptions}
    })
    export default class PlayVsComputer extends Vue {
        onPlayClick(gameConfig: GameConfig): void {
            this.$router.push({
                path: '/computer',
                query: {
                    width: gameConfig.width,
                    height: gameConfig.height,
                    mines: gameConfig.mines,
                    speed: gameConfig.speed,
                    lives: gameConfig.lives,
                },
            });
        }
    }
</script>

<style scoped>

</style>
