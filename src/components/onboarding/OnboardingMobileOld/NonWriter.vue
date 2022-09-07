<template>
  <onboarding-option class="onboarding-wordswriter"
    @confirmed="$emit('confirmed')"
    button-label="Confirm My Choice">
    <template #header>
      <h1>Non-Writer</h1>
      <h2>Time</h2>
    </template>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum metus orci, eget dictum enim rutrum nec. Nulla ullamcorper blandit congue. Fusce cursus diam sit amet eleifend dignissim. Nullam non vestibulum nisi, vel consequat sem. Duis quam elit, porttitor vitae tempus vel, porta vitae felis.</p>
  </onboarding-option>
</template>

<script>
import OnboardingOption from './OnboardingOption.vue';

export default {
  name: 'onboarding-nonwriter',
  components: {
    'onboarding-option': OnboardingOption
  },
  emits: ['confirmed']
}
</script>
