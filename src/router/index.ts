import Vue from 'vue'
import VueRouter, {Route, RouteConfig} from 'vue-router'
import GameOptions from '@/components/GameOptions.vue';
import Rules from '@/components/Rules.vue';
import Contact from '@/components/Contact.vue';
import Lobby from '@/components/Lobby.vue';
import Game from '@/components/Game.vue';
import {default as Minesweeper} from '@/app/minesweeper/game';
import Login from '@/components/Login.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/play',
    },
    {
        path: '/play',
        component: GameOptions,
    },
    {
        path: '/game',
        component: Game,
        props: function($route) {
            let width = (typeof $route.query.width) === 'string' ? parseInt($route.query.width) : 30;
            let height = (typeof $route.query.height) === 'string' ? parseInt($route.query.height) : 20;
            let mines = (typeof $route.query.mines) === 'string' ? parseInt($route.query.mines) : 120;
            let speed = (typeof $route.query.speed) === 'string' ? parseInt($route.query.speed) : 2;
            let lives = (typeof $route.query.lives) === 'string' ? parseInt($route.query.lives) : 2;

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
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/lobby',
        component: Lobby,
        beforeEnter (to: Route, from: Route, next: any) {
            const username = localStorage.getItem('username');
            if (!username) {
                next({
                    path: '/login',
                });
            } else {
                next();
            }
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
