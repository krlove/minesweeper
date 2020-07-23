<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box has-background-light px-6 py-6">
                <div class="field">
                    <div class="control">
                        <div class="buttons has-addons">
                            <button class="button">Beginner</button>
                            <button class="button">Intermediate</button>
                            <button class="button">Expert</button>
                            <button class="button">Custom</button>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Width</label>
                    <div class="control">
                        <input class="slider has-output is-fullwidth" min="0" max="100" value="50" step="1" type="range">
                        <output>25</output>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Height</label>
                    <div class="control">
                        <input class="slider has-output is-fullwidth" min="0" max="100" value="50" step="1" type="range">
                        <output>25</output>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Mines</label>
                    <div class="control">
                        <input class="slider has-output is-fullwidth" min="0" max="100" value="50" step="1" type="range">
                        <output>25</output>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Computer level</label>
                    <div class="control">
                        <input class="slider has-output is-fullwidth" min="0" max="10" value="5" step="1" type="range">
                        <output>25</output>
                    </div>
                </div>

                <div class="buttons">
                    <button class="button is-danger">Play</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class GameOptions extends Vue {}
</script>

<style scoped>

</style>
