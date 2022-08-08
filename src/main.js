import { createAuth0 } from '@auth0/auth0-vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse, faSquarePollHorizontal, faTrophy, faChartSimple, faGear } from '@fortawesome/free-solid-svg-icons';

/* eslint-disable */
import { createApp, toRaw, unref } from 'vue';
import App from './App.vue';
import DashboardView from './components/DashboardView.vue'

const auth0 = createAuth0({
  domain: 'multihabit.us.auth0.com',
  client_id: 'BzwseLvP21EVclAL2DqYFOtS0Ij7z3OB',
  redirect_uri: process.env.VUE_APP_AUTH0_REDIRECT_URI,
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
});

const pinia = createPinia();
library.add(faHouse, faSquarePollHorizontal, faTrophy, faChartSimple, faGear);

const routes = [
  {
    path: '/',
    name: "Dashboard",
    component: DashboardView,
    beforeEnter: (_, __, next) => {
      console.log("Nav Guard");
      const isAuthenticated = unref(toRaw(auth0.isAuthenticated));
      if(!isAuthenticated) next({name: "Login"});
      else next();
    }
  },
  {
    path: '/login',
    name: "Login",
    component: () => import('@/components/LoginView.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/components/StatisticsView.vue')
  },
  {
    path: '/log',
    name: 'Log',
    component: () => import('@/components/LogView.vue')
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('@/components/LeaderboardView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .use(pinia)
  .use(auth0)
  .component('fa-icon',FontAwesomeIcon)
  .mount('#app')
