<template>
  <div id="dashboard" :class="{mobile: responsive.isMobile}">
    <div class="header">
      <h1>Habits</h1>
      <router-link :to="{name: 'Dashboard Config'}">Settings</router-link>
    </div>
    <div>Tracking Mode: {{ trackingMode }}</div>
    <habits-panel v-for="category in categories" :key="category" :category="category" :habits="habits[category]" 
      :tracking_mode="profile.tracking_mode"
      @habitUpdated="onHabitUpdated"/>
  </div>
</template>

<script>
import HabitsPanel from './habits/HabitsPanel.vue';

export default {
  name: "DashboardView",
  components: {
    HabitsPanel
  }
}
</script>

<script async setup>
import { useUserStore } from '@/stores/userStore';
import { Constants } from '@/helpers/constants.js';
import { useResponsiveStore } from '@/stores/responsiveStore';

const user = useUserStore();
const profile = await user.profile;
const responsive = useResponsiveStore();
const habits = await user.habits;
const trackingMode = Constants.TRACKING_MODES[profile.value.tracking_mode];
const categories = ['professional', 'self-improvement', 'leisure'];

function onHabitUpdated(category,habit_id,value,isNewEntry) {
  user.updateHabit(category,habit_id,value,isNewEntry);
console.log(`Entry updated in Category ${category} for habit ${habit_id} of value ${value}. Is new entry? ${isNewEntry}`);
}
</script>

<style lang="scss">
#dashboard {
  height: 100vh;
  overflow-y: scroll;

  &.mobile {
    height: calc(100vh - 64px);
  }
}
</style>
