<template>
  <section id="onboarding">
    <OnboardingMobile></OnboardingMobile>
  </section>
</template>

<script>
export default {
  name: 'OnboardingView',
}
</script>

<script setup>
// import { toRefs } from 'vue';

// import OnboardingDesktop from './OnboardingDesktop.vue';
import OnboardingMobile from './OnboardingMobile/OnboardingMobile.vue';
// import { useResponsiveStore } from '@/stores/responsiveStore';
// import { ref } from 'vue';

// const { isMobile } = toRefs(useResponsiveStore());
</script>

<style lang="scss">
</style>
