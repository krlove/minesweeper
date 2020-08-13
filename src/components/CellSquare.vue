<template>
    <div
            class="cell is-unselectable is-family-code"
            v-bind:style="cellStyle"
            v-bind:class="{
                'opened': cell.isOpened(),
                'closed': !cell.isOpened(),
                'top': cell.y === 0,
                'left': cell.x === 0,
            }"
            v-on:mousedown="onMouseDown()"
            v-on:mouseup="onMouseUp($event)"
            v-on:click.right.prevent="onRightClick()"
    >
        <span
                v-if="cell.isOpened() && cell.getHasMine()"
                class="icon"
        >
            <i class="mdi mdi-18px mdi-mine"></i>
        </span>
        <span
                v-if="cell.isOpened() && cell.neighbourMinesCount > 0 && !cell.getHasMine()"
                v-bind:style="cellWithNumberStyle(cell)"
                class="has-text-weight-bold"
        >
            {{ cell.neighbourMinesCount }}
        </span>
        <span
                v-if="cell.isFlagged()"
                class="icon has-text-danger"
        >
            <i class="mdi mdi-18px mdi-flag-variant"></i>
        </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Cell from "@/app/minesweeper/Cell";

    @Component
    export default class CellSquare extends Vue {
        @Prop() public cell!: Cell;

        readonly CELL_SIZE_PX = 30;
        readonly CELL_CLICK_THRESHOLD_MILLISECONDS = 200;
        private lastMouseDownTimestamp!: number;

        get cellStyle(): any {
            const style = {
                left: (this.cell.x * this.CELL_SIZE_PX) + 'px',
                top: (this.cell.y * this.CELL_SIZE_PX) + 'px',
                height: this.CELL_SIZE_PX + 'px',
                width: this.CELL_SIZE_PX + 'px',
            } as any;

            if (this.cell.isOpened() && !this.cell.isExploded()) {
                style['background-color'] = this.cell.openedBy.color;
            }

            return style;
        }

        cellWithNumberStyle(cell: Cell): any {
            const colors = [
                '#0a0a0a',
                '#0000ff',
                '#007b00',
                '#ff0000',
                '#00007b',
                '#7b0000',
                '#007b7b',
                '#000000',
                '#7b7b7b'
            ];

            return {
                color: colors[cell.neighbourMinesCount],
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
        position: absolute;
        display: flex;
        align-items: center;
        text-align: center;
        border-radius:4px;
        border-right:1px solid #dcdcdc;
        border-bottom:1px solid #dcdcdc;
        padding: 1px;
    }

    .cell.left {
        border-left:1px solid #dcdcdc;
    }

    .cell.top {
        border-top:1px solid #dcdcdc;
    }

    .cell.closed {
        box-shadow:inset 0px 1px 0px 0px #ffffff;
        background:linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
        background-color:#f9f9f9;
    }

    .cell.closed:hover {
        opacity: 0.8;
    }

    .cell > * {
        margin: 0 auto;
    }
</style>
