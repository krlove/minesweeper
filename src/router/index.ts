import Vue from 'vue'
import VueRouter, {Route, RouteConfig} from 'vue-router'
import Rules from '@/components/Rules.vue';
import Contact from '@/components/Contact.vue';
import Lobby from '@/components/Lobby.vue';
import {default as Minesweeper} from '@/app/minesweeper/SingleplayerMinesweeper';
import Login from '@/components/Login.vue';
import NewMatch from '@/components/NewMatch.vue';
import PlayVsComputer from '@/components/PlayVsComputer.vue';
import MatchLobby from '@/components/MatchLobby.vue';
import GameField from '@/components/GameField.vue';

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
        component: GameField,
        props: function($route) {
            const query = $route.query;
            let width = query.width ? parseInt(query.width) : 30;
            let height = query.height ? parseInt(query.height) : 20;
            let mines = query.mines ? parseInt(query.mines) : 120;
            let speed = query.speed ? parseInt(query.speed) : 2;
            let lives = query.lives ? parseInt(query.lives) : 2;

            width = Math.max(20, Math.min(60, width));
            height = Math.max(10, Math.min(40, height));
            const maxMines = (width * height) - (2 * Math.pow(Minesweeper.startingLocationRadius * 2, 2));
            mines = Math.max(40, Math.min(maxMines, mines));
            speed = Math.max(1, Math.min(10, speed));
            lives = Math.max(1, Math.min(5, lives));
            const isMultiplayer = false;

            return { width, height, mines, speed, lives, isMultiplayer };
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
        component: NewMatch,
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
