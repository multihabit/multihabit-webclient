<template>
  <section id="dashboard">
    Dashboard
    <pre>
      {{user}}
    </pre>
  </section>
</template>

<script>
export default {
  name: "DashboardView",
}
</script>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();
const user = auth0.user;
</script>

<style lang="scss">
#dashboard {
  flex: 1 1 0;
}
</style>
