<template>
  <aside>
    <sidebar-link 
      v-for="link in NavLinks"
      :key="link.path"
      :to="link.path"
      :icon="link.icon"
      >{{link.label}}</sidebar-link>
    <button id="logout" @click="logout">Logout</button>
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
import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();

function logout() {
  auth0.logout({returnTo: window.location.origin});
}
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

  .logout {
    align-self: flex-end;
  }
}
</style>
