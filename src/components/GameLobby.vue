<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box px-6 py-6">
                <div v-if="gameRoom">
                    <p>Game info</p>
                    <ul>
                        <li>Width: {{ width }}</li>
                        <li>Height: {{ height }}</li>
                        <li>Mines: {{ mines }}</li>
                        <li>Lives: {{ lives }}</li>
                    </ul>
                    <p>Users list</p>
                    <ul>
                        <li v-for="user of users" v-bind:key="user.id">{{ user.name }}</li>
                    </ul>
                </div>
                <div v-if="error">
                    <span class="has-text-danger">{{ error }}</span>
                </div>

                <div class="buttons">
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
    export default class GameLobby extends Vue {
        @Prop() gameId;
        gameRoom: Room = null;
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
            let gameRoom = ClientStore.getRoom(this.gameId);
            if (!gameRoom) {
                const client = ClientStore.getClient();
                try {
                    gameRoom = await client.joinById(this.gameId);
                } catch (e) {
                    // be silent
                }
            }
            if (!(gameRoom instanceof Room)) {
                this.error = 'Room not found';

                return;
            }

            this.gameRoom = gameRoom;

            this.gameRoom.onStateChange((state) => {
                this.width = this.gameRoom.state.width;
                this.height = this.gameRoom.state.height;
                this.mines = this.gameRoom.state.mines;
                this.lives = this.gameRoom.state.lives;
            });

            const self = this;
            this.gameRoom.state.users.onAdd = function (stateUser: any, id: string) {
                const user = new User(id, stateUser.name);
                self.users.push(user);
            };

            this.gameRoom.state.users.onRemove = function (stateUser: any, id: string) {
                const index = self.users.findIndex(user => user.id === id);
                self.users.splice(index, 1);
            };
            console.log(this.gameRoom);
        }

        destroyed(): void {
            if (this.gameRoom) {
                this.gameRoom.leave();
            }
        }
    }
</script>

<style scoped>

</style>
