<template>
    <div>
        <div class="box has-background-light">
            <game-field
                    v-bind:width="width"
                    v-bind:height="height"
                    v-bind:mines="mines"
                    v-bind:lives="lives"
                    v-bind:speed="speed"
            ></game-field>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import GameField from "@/components/GameField.vue";
    @Component({
        components: {GameField}
    })
    export default class Game extends Vue {
        @Prop() width: number;
        @Prop() height: number;
        @Prop() mines: number;
        @Prop() lives: number;
        @Prop() speed: number;
    }
</script>

<style scoped>

</style>
