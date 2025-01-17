import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Rules from '@/components/Rules.vue';
import Contact from '@/components/Contact.vue';
import {default as Minesweeper} from '@/app/minesweeper/SingleplayerMinesweeper';
import PlayVsComputer from '@/components/PlayVsComputer.vue';
import GameField from '@/components/GameField.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/play',
    },
    {
        path: '/play',
        component: PlayVsComputer,
    },
    {
        path: '/computer',
        component: GameField,
        props: function($route) {
            const query = $route.query;
            let width = query.width ? parseInt(query.width.toString()) : 30;
            let height = query.height ? parseInt(query.height.toString()) : 20;
            let mines = query.mines ? parseInt(query.mines.toString()) : 120;
            let speed = query.speed ? parseInt(query.speed.toString()) : 2;
            let lives = query.lives ? parseInt(query.lives.toString()) : 2;

            width = Math.max(20, Math.min(60, width));
            height = Math.max(10, Math.min(40, height));
            const maxMines = (width * height) - (2 * Math.pow(Minesweeper.startingLocationRadius * 2, 2));
            mines = Math.max(40, Math.min(maxMines, mines));
            speed = Math.max(1, Math.min(10, speed));
            lives = Math.max(1, Math.min(5, lives));

            return { width, height, mines, speed, lives };
        },
    },
    {
        path: '/rules',
        component: Rules,
    },
    {
        path: '/contact',
        component: Contact,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
