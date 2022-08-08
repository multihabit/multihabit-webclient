<template>
  <div>
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

<style scoped lang="sass">

</style>

