<template>
  <div id="dashboard" :class="{mobile: responsive.isMobile}">
    <div class="header">
      <h1>Habits</h1>
      <router-link :to="{name: 'Dashboard Config'}">Settings</router-link>
    </div>
    <div>Tracking Mode: {{ trackingMode }}</div>
    <suspense v-if="loaded">
      <habits-panel v-for="category in categories" :key="category" :category="category" :habits="habits[category]" 
        :tracking_mode="profile.tracking_mode"
        @habitUpdated="onHabitUpdated"/>
    </suspense>
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
import { ref, onBeforeMount } from 'vue';

const loaded = ref(false);
const user = useUserStore();
let profile = ref(null);
const responsive = useResponsiveStore();
let habits = ref(null);
const trackingMode = ref(null);
const categories = ['professional', 'self-improvement', 'leisure'];

onBeforeMount(async () => {
  profile = await user.profile;
  habits = await user.habits;
  trackingMode.value = Constants.TRACKING_MODES[profile.value.tracking_mode];

  console.log("HABITS: ", habits.value.value);

  if (profile.value != null && habits.value != null) {
    loaded.value = true;
  }
})

function onHabitUpdated(category,habit_id,value,isNewEntry) {
  user.updateHabit(category,habit_id,value,isNewEntry);
}
</script>

<style scoped lang="scss">
#dashboard {
  height: 100vh;
  overflow-y: scroll;

  &.mobile {
    height: calc(100vh - 64px);
  }
}
</style>
