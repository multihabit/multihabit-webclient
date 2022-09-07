<template>
  <nav id="bottom-navbar">
    <bottom-navbar-link v-for="link in NavLinks" :key="link.path" :to="link.path" :icon="link.icon" />
  </nav>
</template>

<script>
import BottomNavbarLink from './BottomNavbarLink.vue'

export default {
  name: "bottom-navbar",
  components: {
    BottomNavbarLink
  }
}
</script>

<script setup>
import { NavLinks } from '@/helpers/navlinks';
</script>

<style lang="scss">
#bottom-navbar {
  position: fixed;
  bottom: 0;
  height: 64px;
  display: flex;
  width: 100%;
  background-color: var(--nav-background);
  grid-column-start: 1;
  grid-column-start: 3;
  grid-row-start: 2;
  grid-row-end: 3;
}
</style>
