<template>
  <section id="onboarding">
    <template v-if="isMobile">

    </template>
    <template v-else>
      
    </template>
  </section>
</template>

<script>
export default {
  name: 'OnboardingView'
}
</script>

<script setup>
import { useResponsiveStore } from '@/stores/responsiveStore';

const { isMobile } = useResponsiveStore().isMobile;
</script>

<style lang="scss">
</style>
