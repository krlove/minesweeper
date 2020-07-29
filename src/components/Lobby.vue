<template>
    <div>
        <div class="box px-6 py-6">
            <p class="title">Lobby</p>

            <div class="columns">
                <div class="column is-one-third">
                    <div class="message">
                        <div class="message-header">
                            <p>Players online</p>
                        </div>
                        <div class="players-list-body message-body has-background-white">
                            <ul>
                                <li v-for="user of users" v-bind:key="user.id">{{ user.name }}</li>
                            </ul>
                        </div>
                    </div>

                    <div class="message">
                        <div class="message-header">
                            <p>Matches</p>
                        </div>
                        <div class="matches-body message-body has-background-white">
                            <div class="has-text-right">
                                <router-link tag="button" class="button is-small" :to="{ path: '/match/new' }">Create match</router-link>
                            </div>
                            <div class="my-3">
                                <div v-for="match of matches" v-bind:key="match.roomId">
                                    <div class="level">
                                        <div class="level-left">
                                            <span class="level-item">
                                                {{ match.width }}/{{ match.height }}/{{ match.mines }}/{{ match.lives }} by {{ match.author }}
                                            </span>
                                        </div>
                                        <div class="level-right">
                                            <a>Join</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
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
                                    <span class="has-text-grey-light is-size-7">{{ message.createdAt.toLocaleString() }}</span> <b>{{ message.author.name }}</b>: <span class="has-text-weight-light">{{ message.body }}</span>
                                </div>
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
    import User from '@/app/multiplayer/model/user';
    import Message from '@/app/multiplayer/model/message';
    import {Client, Room} from "colyseus.js";
    import ClientStore from '@/app/multiplayer/client-store';
    import Match from "@/app/multiplayer/model/Match";

    @Component
    export default class Lobby extends Vue {
        users: User[] = [];
        messages: Message[] = [];
        matches: Match[] = [];
        message = '';

        private client: Client;
        private chatRoom: Room;

        created(): void {
            const self = this;

            self.client = ClientStore.getClient();
            const name = localStorage.getItem('username');

            self.client.joinOrCreate("chat_room", { name }).then((room: Room) => {
                this.chatRoom = room;

                this.chatRoom.state.users.onAdd = function (stateUser: any, id: string) {
                    const user = new User(id, stateUser.name);
                    self.users.push(user);
                };

                this.chatRoom.state.users.onRemove = function (stateUser: any, id: string) {
                    const index = self.users.findIndex(user => user.id === id);
                    self.users.splice(index, 1);
                };

                this.chatRoom.state.matches.onAdd = function (stateGame: any, id: string) {
                    // todo send match creator as well
                    const match = new Match();
                    match.roomId = stateGame.roomId;
                    match.author = stateGame.author;
                    match.width = stateGame.width;
                    match.height = stateGame.height;
                    match.mines = stateGame.mines;
                    match.lives = stateGame.lives;

                    self.matches.push(match);
                };

                this.chatRoom.state.matches.onRemove = function (stateGame: any, id: string) {
                    const index = self.matches.findIndex(game => game.roomId === stateGame.roomId);
                    self.matches.splice(index, 1);
                };

                this.chatRoom.onStateChange((state) => {
                    self.syncMessages(state);
                });
            }).catch(e => {
                // todo show something
                console.log(e);
            });
        }

        destroyed(): void {
            this.chatRoom.leave();
        }

        sendMessage(): void {
            if (this.chatRoom === undefined) {
                return;
            }

            this.chatRoom.send('message.post', { body: this.message });
            this.message = '';
        }

        private syncMessages(state: any): void
        {
            const messages: Message[] = [];
            const stateMessages = state.messages;

            for (const stateMessage of stateMessages) {
                const index = this.users.findIndex(user => user.id === stateMessage.author.id);
                const author = index !== -1
                    ? this.users[index]
                    : new User(stateMessage.author.id, stateMessage.author.name);
                const body = stateMessage.body;
                const createdAt = new Date(stateMessage.createdAt);
                const message = new Message(author, body, createdAt);
                messages.push(message);
            }

            this.messages = messages;
        }
    }
</script>

<style scoped>
    .players-list-body {
        height: 200px;
        overflow: auto;
    }

    .matches-body {
        height: 200px;
        overflow: auto;
    }

    .chat-body {
        height: 462px;
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
