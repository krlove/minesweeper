<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box px-6 py-6">
                <p class="title">Create match</p>

                <game-options
                        v-bind:vs-computer="false"
                        v-bind:on-play-click="onPlayClick"
                ></game-options>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {GameConfig} from '@/components/types/GameConfig';
    import GameOptions from '@/components/GameOptions.vue';
    import ClientStore from "@/app/multiplayer/client-store";

    @Component({
        components: {GameOptions}
    })
    export default class NewMatch extends Vue {
        async onPlayClick(gameConfig: GameConfig): void {
            const name = localStorage.getItem('username');

            const client = ClientStore.getClient();
            const matchRoom = await client.create('match_room', {
                name,
                width: gameConfig.width,
                height: gameConfig.height,
                mines: gameConfig.mines,
                lives: gameConfig.lives,
            });
            ClientStore.addRoom(matchRoom);

            this.$router.push({ path: `/match/${matchRoom.id}` });
        }
    }
</script>

<style scoped>

</style>
