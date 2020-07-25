<template>
    <div>
        <span
                v-for="n of range"
                v-bind:key="n"
                class="icon"
                v-bind:class="{ 'cursor-pointer': selectable, 'disabled': disabled }"
                v-on:click="onStarClick(n)"
        >
            <i
                    class="mdi mdi-24px"
                    v-bind:class="{ 'mdi-star': n <= value, 'mdi-star-outline': n > value }"
            />
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    function range(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, i) => i + 1)
    }

    @Component
    export default class Lives extends Vue {
        @Prop() total: number;
        @Prop() selectable: boolean;
        @Prop() value: number;
        @Prop() disabled: boolean;

        get range(): number[] {
            const r = range(1, this.total);

            return r;
        }

        onStarClick(n: number): void {
            if (!this.selectable || this.disabled) {
                return;
            }

            this.$emit('input', n);
        }
    }
</script>

<style scoped>
    .disabled {
        opacity: .5;
    }

    .cursor-pointer {
        cursor: pointer;
    }
</style>
