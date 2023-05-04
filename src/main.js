import { createAuth0 } from '@auth0/auth0-vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse, faSquarePollHorizontal, faTrophy, faChartSimple, faGear, faAngleDown, faFeatherPointed, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import VueAxios from 'vue-axios';

/* eslint-disable */
import { createApp, toRaw, unref } from 'vue';
import App from './App.vue';
import LandingView from './components/LandingView.vue'

const auth0 = createAuth0({
  domain: 'multihabit.us.auth0.com',
  client_id: 'BzwseLvP21EVclAL2DqYFOtS0Ij7z3OB',
  redirect_uri: process.env.VUE_APP_AUTH0_REDIRECT_URI,
  audience: 'https://multihabit.com/authorize'
});

const pinia = createPinia();
library.add(faHouse, faSquarePollHorizontal, faTrophy, faChartSimple, faGear, faAngleDown, faFeatherPointed, faAngleLeft, faAngleRight);

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
    meta: {
      showNav: false
    }
  },
  {
    path: '/dashboard',
    name: "Dashboard",
    component: () => import('@/components/DashboardView.vue'),
    meta: {
      showNav: true
    }
  },
  {
    path: '/login',
    name: "Login",
    component: () => import('@/components/LoginView.vue'),
    meta: {
      showNav: false
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/components/StatisticsView.vue'),
    meta: {
      showNav: true
    }
  },
  {
    path: '/log/:dateInteger?',
    name: 'Log',
    component: () => import('@/components/LogView.vue'),
    meta: {
      showNav: true
    },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('@/components/LeaderboardView.vue'),
    meta: {
      showNav: true
    }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/components/onboarding/OnboardingView.vue'),
    meta: {
      showNav: true
    }
  },
  {
    path: '/dashboard/config',
    name: 'Dashboard Config',
    component: () => import('@/components/dashboard-config/DashboardConfigView.vue'),
    meta: {
      showNav: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App).use(router);
app.use(pinia)
  .use(VueAxios,axios)
  .provide('axios', app.config.globalProperties.axios)
  .use(auth0)
  .component('fa-icon',FontAwesomeIcon)
  .mount('#app')
