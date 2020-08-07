<template>
    <table class="table is-narrow">
        <tbody>
        <tr v-for="player of players" v-bind:key="player.name" class="is-family-code">
            <td>{{ player.name }}</td>
            <td>{{ player.getOpenedCellsCount() }} / {{ cellsToOpenCount }}</td>
            <td>
                <lives
                        v-bind:total="playerLivesCount"
                        v-model="player.lives"
                        v-bind:selectable="false"
                        v-bind:disabled="false"
                ></lives>
            </td>
            <td>
                <p class="has-text-danger" v-if="player.state === PlayerState.Lost">lost</p>
                <p class="has-text-success" v-if="player.state === PlayerState.Won">won</p>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {PlayerState} from "../app/minesweeper/enum";
    import Lives from "@/components/Lives.vue";
    import Player from "@/app/minesweeper/player";
    @Component({
        components: {Lives}
    })
    export default class PlayersDashboard extends Vue {
        @Prop() players: Player[];
        @Prop() cellsToOpenCount: number;
        @Prop() playerLivesCount: number;
        PlayerState = PlayerState;
    }
</script>

<style scoped>

</style>
