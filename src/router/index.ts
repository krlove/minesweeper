import Vue from 'vue'
import VueRouter, {Route, RouteConfig} from 'vue-router'
import Rules from '@/components/Rules.vue';
import Contact from '@/components/Contact.vue';
import Lobby from '@/components/Lobby.vue';
import Game from '@/components/Game.vue';
import {default as Minesweeper} from '@/app/minesweeper/game';
import Login from '@/components/Login.vue';
import NewGame from '@/components/NewGame.vue';
import PlayVsComputer from '@/components/PlayVsComputer.vue';
import MatchLobby from '@/components/MatchLobby.vue';

Vue.use(VueRouter);

const loginBeforeEnter = (to: Route, from: Route, next: any) => {
    const username = localStorage.getItem('username');
    if (!username) {
        next({
            path: '/login',
        });
    } else {
        next();
    }
};

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
        component: Game,
        props: function($route) {
            let width = $route.query.width ? parseInt($route.query.width) : 30;
            let height = $route.query.height ? parseInt($route.query.height) : 20;
            let mines = $route.query.mines ? parseInt($route.query.mines) : 120;
            let speed = $route.query.speed ? parseInt($route.query.speed) : 2;
            let lives = $route.query.lives ? parseInt($route.query.lives) : 2;

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
        beforeEnter: loginBeforeEnter,
    },
    {
        path: '/match/new',
        component: NewGame,
        beforeEnter: loginBeforeEnter,
    },
    {
        path: '/match/:id',
        component: MatchLobby,
        beforeEnter: loginBeforeEnter,
        props: function ($route) {
            return {
                matchId: $route.params.id,
            };
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
