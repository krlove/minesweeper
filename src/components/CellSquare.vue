<template>
    <div
            class="cell is-unselectable is-family-code"
            v-bind:style="cellStyle"
            v-on:mousedown="onMouseDown()"
            v-on:mouseup="onMouseUp($event)"
            v-on:click.right.prevent="onRightClick()"
    >
        <span v-if="cell.isOpened() && cell.getHasMine()" class="icon has-text-black"><i class="mdi mdi-18px mdi-mine"></i></span>
        <span v-if="cell.isOpened() && cell.neighbourMinesCount > 0 && !cell.getHasMine()">{{ cell.neighbourMinesCount }}</span>
        <span v-if="cell.isFlagged()" class="icon has-text-danger"><i class="mdi mdi-18px mdi-flag-variant"></i></span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Cell from "@/app/minesweeper/cell";

    @Component
    export default class CellSquare extends Vue {
        @Prop() public cell: Cell;

        readonly CELL_SIZE_PX = 30;
        readonly CELL_CLICK_THRESHOLD_MILLISECONDS = 200;
        private lastMouseDownTimestamp: number;

        get cellStyle(): any {
            let backgroundColor;
            if (this.cell.isOpened()) {
                backgroundColor = this.cell.isExploded()
                    ? 'rgba(0, 0, 0, 0.2)'
                    : this.cell.openedBy.color;
            } else {
                //backgroundColor = '#97ABB1';
                //backgroundColor = '#B57F50';
                //backgroundColor = '#5FBFF9'; // I like it
                //backgroundColor = '#3AAFF8';
                backgroundColor = '#16BAC5'; // norm
                //backgroundColor = '#BDC696'; // opponent color
                //backgroundColor = '#C49E85'; // opponent color
            }

            return {
                left: (this.cell.x * this.CELL_SIZE_PX) + 'px',
                top: (this.cell.y * this.CELL_SIZE_PX) + 'px',
                height: this.CELL_SIZE_PX + 'px',
                width: this.CELL_SIZE_PX + 'px',
                'background-color': backgroundColor,
            };
        }

        onMouseDown(): void {
            this.lastMouseDownTimestamp = (new Date()).getTime();
        }

        onMouseUp($event: MouseEvent): void {
            if ($event.button === 2) {
                return;
            }

            const currentTimestamp = (new Date()).getTime();
            if (currentTimestamp - this.lastMouseDownTimestamp < this.CELL_CLICK_THRESHOLD_MILLISECONDS) {
                this.$emit('open-cell', this.cell);
            }
        }

        onRightClick(): void {
            const currentTimestamp = (new Date()).getTime();
            if (currentTimestamp - this.lastMouseDownTimestamp < this.CELL_CLICK_THRESHOLD_MILLISECONDS) {
                this.$emit('flag-cell', this.cell);
            }
        }
    }
</script>

<style scoped lang="scss">
    .cell {
        border-right: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
        position: absolute;
        display: flex;
        align-items: center;
        text-align: center;
    }

    .cell > * {
        margin: 0 auto;
    }
</style>
