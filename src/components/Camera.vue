<template>
    <div
            class="camera"
            v-bind:style="cameraStyle"
            v-on:contextmenu.prevent="() => {}"
            v-on:mouseleave="onMouseLeaveCamera()"
    >
        <div
                class="scene"
                v-bind:style="sceneStyle"
                v-on:mousedown.prevent.stop.left="onMouseDown($event)"
                v-on:mousemove.prevent.stop="onMouseMove($event)"
                v-on:mouseup.prevent.stop.left="onMouseUp()"
        >
            <slot name="field"></slot>
        </div>
        <slot name="result"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class Camera extends Vue {
        @Prop() sceneWidth: number;
        @Prop() sceneHeight: number;

        cameraWidth: number;
        cameraHeight: number = 600;

        private sceneLeftPosition = 0;
        private sceneTopPosition = 0;
        private horizontalScrollEnabled = true;
        private verticalScrollEnabled = true;
        private locked = false;
        private prevX: number;
        private prevY: number;

        mounted(): void {
            // todo calculate by iterating parents and summing their dimensions
            const cardContentPaddingVertical = 48;
            const gameDashboardHeight = 67;
            const gameDashboardPaddingBottom = 24;
            const elementStyle = getComputedStyle(this.$el);

            this.cameraWidth = parseInt(elementStyle.width);
            this.cameraHeight = window.innerHeight -
                (cardContentPaddingVertical + gameDashboardHeight + gameDashboardPaddingBottom);

            if (this.cameraWidth >= this.sceneWidth) {
                this.horizontalScrollEnabled = false;
                this.sceneLeftPosition = Math.floor((this.cameraWidth - this.sceneWidth) / 2);
            }

            if (this.cameraHeight >= this.sceneHeight) {
                this.verticalScrollEnabled = false;
                this.sceneTopPosition = Math.floor((this.cameraHeight - this.sceneHeight) / 2);
            }
        }

        get cameraStyle(): object {
            return {
                width: this.cameraWidth + 'px',
                height: this.cameraHeight + 'px',
            };
        }

        get sceneStyle(): object {
            return {
                left: this.sceneLeftPosition + 'px',
                top: this.sceneTopPosition + 'px',
            };
        }

        onMouseDown($event: MouseEvent) {
            this.locked = true;
            this.prevX = $event.clientX;
            this.prevY = $event.clientY;
        }

        onMouseMove($event: MouseEvent) {
            if (!this.locked) {
                return;
            }

            // handle "nEvents" of 10 events
            const nEvents = 3;
            if (Math.floor(Math.random() * 10) > nEvents) {
                return;
            }

            const distance = Math.sqrt(
                Math.pow($event.clientX - this.prevX, 2) +
                Math.pow($event.clientY - this.prevY, 2)
            );
            if (distance < 7) {
                return;
            }

            this._calNewLeftPosition($event.clientX);
            this._calcNewTopPosition($event.clientY);
        }

        onMouseUp() {
            this.locked = false;
        }

        onMouseLeaveCamera() {
            this.locked = false;
        }

        private _calNewLeftPosition(clientX: number): void {
            if (!this.horizontalScrollEnabled) {
                return;
            }

            const newLeft = this.sceneLeftPosition + clientX - this.prevX;
            if (newLeft > 0) {
                this.sceneLeftPosition = 0;
            } else if (newLeft < this.cameraWidth - this.sceneWidth) {
                this.sceneLeftPosition = this.cameraWidth - this.sceneWidth;
            } else {
                this.sceneLeftPosition = newLeft;
            }

            this.prevX = clientX;
        }

        private _calcNewTopPosition(clientY: number): void {
            if (!this.verticalScrollEnabled) {
                return;
            }

            const newTop = this.sceneTopPosition + clientY - this.prevY;
            if (newTop > 0) {
                this.sceneTopPosition = 0;
            } else if (newTop < this.cameraHeight - this.sceneHeight) {
                this.sceneTopPosition = this.cameraHeight - this.sceneHeight;
            } else {
                this.sceneTopPosition = newTop;
            }

            this.prevY = clientY;
        }
    }
</script>

<style scoped lang="css">
    .camera {
        position: relative;
        overflow: hidden;
    }

    .scene {
        position: absolute;
    }
</style>
