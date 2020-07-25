<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box px-6 py-6">
                    <div class="field">
                        <label class="label">Enter your username</label>
                        <div class="control">
                            <input
                                    v-model="username"
                                    class="input"
                                    type="text"
                                    placeholder="Username"
                                    v-on:keyup.enter="saveAndContinue()"
                            >
                            <p class="help is-success">Min 3 characters</p>
                        </div>
                    </div>
                    <br />

                    <div class="buttons">
                        <button
                                class="button is-danger"
                                :disabled="username.length < 3"
                                v-on:click="saveAndContinue()"
                        >
                            Continue
                        </button>
                        <router-link :to="{ path: '/play' }">
                            <button class="button is-light">Cancel</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {
        username = '';

        saveAndContinue(): void {
            localStorage.setItem('username', this.username);
            this.$router.push('/lobby');
        }
    }
</script>

<style scoped>
</style>
