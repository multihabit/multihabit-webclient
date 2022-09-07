<template>
  <div id="login">
    <header>
      <h1>Multihabit</h1>
      <h2>A Time-based Habit-Tracking App</h2> 
    </header>
    <LoginButton/>
  </div>
</template>

<script>
import LoginButton from './LoginButton.vue'
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  name: 'LoginView',
  components: {
    LoginButton
  },
  setup() {
    const {isAuthenticated, user} = useAuth0();

    return {
      isAuthenticated,
      user
    }
  }
}
</script>

<style scoped lang="scss">
#login{
  align-self: center;
  justify-self: center;
  flex: 1 1 0;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
}
</style>

