<template>
    <div>
            <div class="box has-background-light px-6 py-6">
                <div class="columns">
                <div class="column is-one-quarter">
                    <div class="message is-dark">
                        <div class="message-header">
                            Players online (2)
                        </div>
                        <div class="message-body">
                            Players list
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="message is-dark">
                        <div class="message-header">
                            Chat
                        </div>
                        <div class="message-body">
                            Chat
                        </div>
                    </div>
                </div>
                <div class="column is-one-quarter">
                    <div class="message is-dark">
                        <div class="message-header">
                            Games
                        </div>
                        <div class="message-body">
                            Games
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class Lobby extends Vue {
    }
</script>

<style scoped>

</style>
