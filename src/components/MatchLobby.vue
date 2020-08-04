<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box px-6 py-6">
                <div v-if="matchRoom">
                    <div v-if="gameState === GameState.Uninitialized" class="mb-5">
                        <div class="columns">
                            <div class="column is-5 has-text-centered">
                                <span class="title is-5" v-if="users[0] !== undefined">{{ users[0].username }}</span>
                                <span class="title icon" v-else><i class="mdi mdi-24px mdi-account-question"></i></span>
                            </div>
                            <div class="column is-2 has-text-centered">
                                <span class="icon">
                                    <i class="mdi mdi-24px mdi-sword-cross"></i>
                                </span>
                            </div>
                            <div class="column is-5 has-text-centered">
                                <span class="title is-5" v-if="users[1] !== undefined">{{ users[1].username }}</span>
                                <span class="title icon" v-else><i class="mdi mdi-24px mdi-account-question"></i></span>
                            </div>
                        </div>
                        <div class="level">
                            <div class="level-item">
                                <span>Width: <b>{{ width }}</b></span>
                            </div>
                            <div class="level-item">
                                <span>Height: <b>{{ height }}</b></span>
                            </div>
                            <div class="level-item">
                                <span>Mines: <b>{{ mines }}</b></span>
                            </div>
                            <div class="level-item">
                                <span>Lives: <b>{{ lives }}</b></span>
                            </div>
                        </div>
                        <div class="message">
                            <div class="message-header">
                                <p>Chat</p>
                            </div>
                            <div class="chat-body message-body has-background-white">
                                <div class="field">
                                    <input
                                            class="input"
                                            type="text"
                                            v-model="message"
                                            v-on:keyup.enter="sendMessage()"
                                    />
                                </div>
                                <div class="message-list">
                                    <div v-for="message of messages.slice().reverse()" v-bind:key="message.createdAt.toLocaleString()">
                                        <span class="has-text-grey-light is-size-7">{{ message.createdAt.toLocaleString() }}</span> <b>{{
                                        message.author.username }}</b>: <span class="has-text-weight-light">{{ message.body }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="gameState === GameState.Started">
                        <div class="box">
                            <span class="has-text-success">Game started</span>
                        </div>
                    </div>
                </div>
                <div v-if="error">
                    <span class="has-text-danger">{{ error }}</span>
                </div>

                <div class="buttons">
                    <button class="button" v-on:click="startGame()" :disabled="users.length < 2">Start</button>
                    <router-link tag="button" class="button" :to="{ path: '/lobby' }">Cancel</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import ClientStore from "@/app/multiplayer/client-store";
    import {Room} from 'colyseus.js';
    import User from "@/app/multiplayer/model/user";
    import Message from "@/app/multiplayer/model/message";
    import {GameState} from "@/app/minesweeper/enum";

    @Component
    export default class MatchLobby extends Vue {
        @Prop() matchId;
        matchRoom: Room = null;
        error = '';
        message = '';
        messages: Message[] = [];
        users: User[] = [];
        gameState = GameState.Uninitialized;
        width = 0;
        height = 0;
        mines = 0;
        lives = 0;
        GameState = GameState;

        async created(): Promise<void> {
            let matchRoom = ClientStore.getRoom(this.matchId);
            if (!matchRoom) {
                const client = ClientStore.getClient();
                const username = localStorage.getItem('username');
                try {
                    matchRoom = await client.joinById(this.matchId, { username });
                    ClientStore.addRoom(matchRoom);
                } catch (e) {
                    // be silent
                }
            }
            if (!(matchRoom instanceof Room)) {
                this.error = 'Match not found';

                return;
            }

            this.matchRoom = matchRoom;
            this.matchRoom.onStateChange((state) => {
                this.width = state.width;
                this.height = state.height;
                this.mines = state.mines;
                this.lives = state.lives;
                this.gameState = state.gameState;
            });

            const self = this;
            this.matchRoom.state.players.onAdd = (stateUser: any, id: string) => {
                const user = new User(id, stateUser.username);
                self.users.push(user);
            };

            this.matchRoom.state.players.onRemove = (stateUser: any, id: string) => {
                const index = self.users.findIndex(user => user.id === id);
                self.users.splice(index, 1);
            };

            this.matchRoom.onMessage('message.post', function(message) {
                const index = self.users.findIndex(user => user.id === message.author.id);
                const author = index !== -1
                    ? self.users[index]
                    : new User(message.author.id, message.author.username);
                const body = message.body;
                const createdAt = new Date(message.createdAt);
                const msg = new Message(author, body, createdAt);

                self.messages.push(msg);
            });
        }

        sendMessage(): void {
            if (this.matchRoom === undefined) {
                return;
            }

            this.matchRoom.send('message.post', { body: this.message });
            this.message = '';
        }

        destroyed(): void {
            if (this.matchRoom) {
                this.matchRoom.leave();
                ClientStore.removeRoom(this.matchId);
            }
        }

        startGame(): void {
            this.matchRoom.send('game.start');
        }
    }
</script>

<style scoped>
    .chat-body {
        height: 300px;
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
