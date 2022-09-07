<template>
  <div id="dashboard">
    <h1>{{trackingMode}}</h1>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
}
</script>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { Constants } from '@/helpers/constants.js';

const user = useUserStore();
const profile = await user.profile;
console.log(profile.value.tracking_mode);
const trackingMode = Constants.TRACKING_MODES[profile.value.tracking_mode];
</script>

<style lang="scss">
#dashboard {
  flex: 1 1 0;
}
</style>
