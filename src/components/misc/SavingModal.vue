<template>
  <div class="saving-modal">
    <LoadingSpinner/>
    <div>Saving...</div>
  </div>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: 'SavingModal',
  components: {
    LoadingSpinner
  }
}
</script>

<style lang="scss">
.saving-modal {
  aspect-ratio: 1/1;
}
</style>
