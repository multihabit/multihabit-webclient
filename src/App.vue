<template>
  <mh-sidebar v-if="showSidebar" />
  <router-view/>
  <bottom-navbar v-if="showBottomNavBar" />
</template>

<script>
import { debounce } from '@/helpers/debounce';
import { useResponsiveStore } from '@/stores/responsiveStore';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, computed, onBeforeMount } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

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
    const auth0 = useAuth0();

    onBeforeMount(() => {
      auth0.getAccessTokenSilently();
    })

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
        return !responsive.isMobile && route.path !== '/login'
      }),
      showBottomNavBar: computed(() => {
        return responsive.isMobile && route.path !== '/login'
      })
    }
  }
}
</script>

<style lang="scss">
:root {
  --nav-background: rgb(21, 8, 0);
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
  background: rgba(255, 199, 8, 255);
  display: flex;
}
</style>
