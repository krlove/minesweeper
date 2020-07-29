<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box px-6 py-6">
                <div v-if="matchRoom">
                    <div class="mb-5">
                        <div class="columns">
                            <div class="column is-5 has-text-centered">
                                <span class="title is-5">{{ users.length > 0 ? users[0].name : '' }}</span>
                            </div>
                            <div class="column is-2 has-text-centered">
                                <span class="icon">
                                    <i class="mdi mdi-24px mdi-sword-cross"></i>
                                </span>
                            </div>
                            <div class="column is-5 has-text-centered">
                                <span class="title is-6">Waiting for an opponent...</span>
                            </div>
                        </div>
                        <div class="level">
                            <div class="level-item">
                                <span>Width: {{ width }}</span>
                            </div>
                            <div class="level-item">
                                <span>Height: {{ height }}</span>
                            </div>
                            <div class="level-item">
                                <span>Mines: {{ mines }}</span>
                            </div>
                            <div class="level-item">
                                <span>Lives: {{ lives }}</span>
                            </div>
                        </div>
                        <div class="message">
                            <div class="message-header">
                                <p>Chat</p>
                            </div>
                            <div class="message-body">
                                Chat here
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="error">
                    <span class="has-text-danger">{{ error }}</span>
                </div>

                <div class="buttons">
                    <router-link tag="button" class="button" :to="{ path: '/' }" :disabled="users.length < 2">Start</router-link>
                    <router-link tag="button" class="button" :to="{ path: '/lobby' }">Go to Lobby</router-link>
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

    @Component
    export default class MatchLobby extends Vue {
        @Prop() matchId;
        matchRoom: Room = null;
        error = '';
        users: User[] = [];
        width = 0;
        height = 0;
        mines = 0;
        lives = 0;

        created(): void {
            this.loadRoom();
        }

        async loadRoom(): Promise<void> {
            let matchRoom = ClientStore.getRoom(this.matchId);
            if (!matchRoom) {
                const client = ClientStore.getClient();
                try {
                    matchRoom = await client.joinById(this.matchId);
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
                this.width = this.matchRoom.state.width;
                this.height = this.matchRoom.state.height;
                this.mines = this.matchRoom.state.mines;
                this.lives = this.matchRoom.state.lives;
            });

            const self = this;
            this.matchRoom.state.users.onAdd = function (stateUser: any, id: string) {
                const user = new User(id, stateUser.name);
                self.users.push(user);
            };

            this.matchRoom.state.users.onRemove = function (stateUser: any, id: string) {
                const index = self.users.findIndex(user => user.id === id);
                self.users.splice(index, 1);
            };
        }

        destroyed(): void {
            if (this.matchRoom) {
                this.matchRoom.leave();
                ClientStore.removeRoom(this.matchId);
            }
        }
    }
</script>

<style scoped>

</style>
