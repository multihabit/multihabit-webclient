<template>
  <div id="dashboard">
    <h1>Habits</h1>
    <div>Tracking Mode: {{ trackingMode }}</div>
    <habits-panel v-for="(categoryHabits, categoryName) in habits" :key="categoryName" :category="categoryName" :habits="categoryHabits" 
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

const user = useUserStore();
const profile = await user.profile;
const habits = await user.habits;
const trackingMode = Constants.TRACKING_MODES[profile.value.tracking_mode];

function onHabitUpdated(category,habit_id,value,isNewEntry) {
  user.updateHabit(category,habit_id,value,isNewEntry);
console.log(`Entry updated in Category ${category} for habit ${habit_id} of value ${value}. Is new entry? ${isNewEntry}`);
}
</script>

<style lang="scss">
#dashboard {
  height: 100vh;
  overflow-y: scroll;
}
</style>
