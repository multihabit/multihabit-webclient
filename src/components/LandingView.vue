<template>
  <div id="landing">
    <h1>Multihabit</h1>
    <h2>A habit-tracking app</h2>
    <loading-spinner />
    <p>Loading...</p>
  </div>
</template>

<script>
  import LoadingSpinner from './misc/LoadingSpinner.vue';

  export default {
    name: 'landing-view',
    components: {
      'loading-spinner': LoadingSpinner
    }
  }
</script>

<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';
  import { onBeforeMount } from 'vue';
  import { useRouter } from 'vue-router';

  const auth0 = useAuth0();
  const router = useRouter();

  onBeforeMount(() => {
    if (auth0.isAuthenticated.value) {
      router.push('/dashboard');
    }
  })
</script>

<style scoped lang="scss">
  #landing {
    align-self: center;
    justify-self: center;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
