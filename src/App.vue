<template>
  <mh-sidebar v-if="showSidebar" />
  <suspense>
    <router-view :class="{
      desktop: showSidebar,
      mobile: showBottomNavBar
    }" :key="$route.fullPath"/>
  </suspense>
  <bottom-navbar v-if="showBottomNavBar" />
</template>

<script>
/* eslint-disable */
import { unref, toRaw } from 'vue';
import { debounce } from '@/helpers/debounce';
import { useResponsiveStore } from '@/stores/responsiveStore';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, onUnmounted, computed, onBeforeMount } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from './stores/userStore';

import Sidebar from '@/components/sidebar/Sidebar.vue';
import BottomNavbar from './components/bottom-navbar/BottomNavbar.vue';

export default {
  name: 'App',
  components: {
    'mh-sidebar': Sidebar,
    'bottom-navbar': BottomNavbar
  },
  setup() {
    const onWindowResizeHandler = debounce(onWindowResize);
    const responsive = useResponsiveStore();
    responsive.updateSize(window.innerWidth);
    const route = useRoute();
    const router = useRouter();
    const auth0 = useAuth0();
    const user = useUserStore();
    const isAuthenticated = auth0.isAuthenticated;
    
    onBeforeMount(async () => {
      if(!isAuthenticated.value) {
        await user.login();

        if(isAuthenticated.value && auth0.user.value != null) {
          const profile = await user.profile;

          if (profile.value != null && !profile.value.is_onboarded) {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        }
      }
    });

    onMounted(() => {
      window.addEventListener("resize", onWindowResizeHandler)
    });

    onUnmounted(() => {
      window.removeEventListener("resize",onWindowResizeHandler);
    })

    function onWindowResize() {
      responsive.updateSize(window.innerWidth);
    }

    return {
      showSidebar: computed(() => {
        return !responsive.isMobile && route.meta.showNav && isAuthenticated.value
      }),
      showBottomNavBar: computed(() => {
        return responsive.isMobile && route.meta.showNav && isAuthenticated.value
      })
    }
  }
}
</script>

<style lang="scss">
:root {
  --nav-background: rgb(21, 8, 0);
  --app-background: rgba(255, 199, 8, 1);
}

body {
  margin: 0;
  height: 100vh;
  width: 100vw;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  height: inherit;
  width: inherit;
  background-color: rgba(255, 199, 8, 255);
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr 64px;
}

.desktop {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
}

.mobile {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  padding-bottom: 94px;
}
</style>
