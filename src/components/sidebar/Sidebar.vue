<template>
  <aside>
    <sidebar-link 
      v-for="link in NavLinks"
      :key="link.path"
      :to="link.path"
      :icon="link.icon"
      >{{link.label}}</sidebar-link>
  </aside>
</template>

<script>
import SidebarLink from './SidebarLink.vue';
export default {
    name: "mh-sidebar",
    components: { SidebarLink }
}
</script>

<script setup>
import { NavLinks } from '@/helpers/navlinks';
</script>

<style lang="scss">
aside {
  width: 300px;
  background-color: var(--nav-background);
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
}
</style>
