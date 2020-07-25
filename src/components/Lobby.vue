<template>
    <div>
        <div class="box px-6 py-6">
            <div class="columns">
                <div class="column is-one-third">
                    <div class="message is-dark">
                        <div class="message-header">
                            Players online
                        </div>
                        <div class="players-list-body message-body has-background-white">
                        </div>
                    </div>

                    <div class="message is-dark">
                        <div class="message-header">
                            Games
                        </div>
                        <div class="games-body message-body has-background-white">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="message is-dark">
                        <div class="message-header">
                            Chat
                        </div>
                        <div class="chat-body message-body has-background-white">
                            <div class="field">
                                <input class="input" type="text" />
                            </div>
                            <div class="message-list">
                            </div>
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
    .players-list-body {
        height: 400px;
        overflow: auto;
    }

    .games-body {
        height: 200px;
        overflow: auto;
    }

    .chat-body {
        height: 662px;
        display: flex;
        flex-flow: column-reverse nowrap;
    }

    .message-list {
        display: flex;
        flex-flow: column-reverse nowrap;
        overflow: auto;
        height: 100%;
        border: 1px solid lightgrey;
        margin: 10px 0;
        padding: 5px
    }
</style>
