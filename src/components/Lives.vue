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
                    v-bind:class="{ 'mdi-heart': n <= value, 'mdi-heart-outline': n > value }"
            />
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {range} from '@/app/util/range';

    @Component
    export default class Lives extends Vue {
        @Prop() total: number;
        @Prop() selectable: boolean;
        @Prop() value: number;
        @Prop() disabled: boolean;

        get range(): number[] {
            return range(1, this.total);
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
