import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import GameOptions from '@/components/GameOptions.vue';
import Rules from '@/components/Rules.vue';
import Contact from '@/components/Contact.vue';
import Lobby from '@/components/Lobby.vue';

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
        path: '/rules',
        component: Rules,
    },
    {
        path: '/contact',
        component: Contact,
    },
    {
        path: '/lobby',
        component: Lobby,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
