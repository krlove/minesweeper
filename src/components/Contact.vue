<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box px-6 py-6">
                    <p class="title">Contact</p>

                    <div class="has-text-centered">
                        <a href="mailto:mischenkoandrey@gmail.com" target="_blank" class="button">
                            <span class="icon"><i class="mdi mdi-18px mdi-email"></i></span>
                            <span>Send an email to author</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class Contact extends Vue {
    }
</script>

<style scoped>

</style>
