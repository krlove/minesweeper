<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box px-6 py-6">
                    <div class="content">
                        <p><b>Minesweeper Battle</b>'s rules are the same as classical Minesweeper's except the following.</p>
                        <p>
                            Two players play against each other on the same field. The goal is to gain as much territory as possible by flagging mines and opening empty cells.
                            At the beginning of the game each player has it's own starting location.
                            It is possible to open or flag only those cells which border with player's territory.
                        </p>
                        <p>The winner is the player who:</p>
                        <ul>
                            <li>Opened 50% of the field + 1 cell</li>
                            <li>Didn't explode on a mine</li>
                        </ul>
                        <p>If one of the players explodes, another still must open enough cells to become a winner.</p>
                        <hr/>
                        <p class="title is-5">Controls</p>
                        <table class="table is-bordered">
                            <tbody>
                            <tr>
                                <td>Left click on a closed cell</td>
                                <td>open the cell</td>
                            </tr>
                            <tr>
                                <td>Right click on a closed cell</td>
                                <td>flag the cell</td>
                            </tr>
                            <tr>
                                <td>Left click on an opened cell</td>
                                <td>open adjacent cells</td>
                            </tr>
                            <tr>
                                <td>Hold left click and move the mouse</td>
                                <td>drag the field</td>
                            </tr>
                            </tbody>
                        </table>
                        <br/>
                        <p>Good luck!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class Rules extends Vue {
    }
</script>

<style scoped>

</style>
