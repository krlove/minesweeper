<template>
    <div>
        <nav class="navbar is-dark">
            <div class="container">
                <div class="navbar-brand">
                    <a class="navbar-item" href="/">
                        Minesweeper Battle
                    </a>
                </div>
                <div class="navbar-start">
                    <router-link tag="a" to="/play" class="navbar-item" active-class="is-active">
                        Play vs computer
                    </router-link>
                    <router-link tag="a" to="/lobby" class="navbar-item" active-class="is-active">
                        Multiplayer
                    </router-link>
                    <router-link tag="a" to="/rules" class="navbar-item" active-class="is-active">
                        Rules
                    </router-link>
                    <router-link tag="a" to="/contact" class="navbar-item" active-class="is-active">
                        Contact
                    </router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class Navbar extends Vue {
    }
</script>

<style scoped>

</style>
