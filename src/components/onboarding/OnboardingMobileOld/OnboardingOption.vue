<template>
  <div class="onboarding-option onboarding-default">
    <div class="onboarding-option-header">
      <slot name="header"></slot>
    </div>
    <div class="onboarding-option-body">
      <slot></slot>
    </div>
    <div 
      class="onboarding-option-confirm-button"
      @click="$emit('confirmed')"
      v-if="buttonLabel">{{buttonLabel}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'onboarding-default',
  emits: ['confirmed'],
  props: {
    'button-label': String
  }
}
</script>

<style lang="scss">
.onboarding-option {
  text-align: center;

  .onboarding-option-header {
    h1 {
      margin-bottom: 0.25rem;
      margin-top: 0.75rem;
      font-size: 190%;
    }

    h2 {
      margin: 0;
      font-size: 130%;
    }
  }

  .onboarding-option-body {
    padding: 0 2rem 0 2rem;
  }

  .onboarding-option-confirm-button {
    padding: 1rem;
    background-color: var(--nav-background);
    display: inline-block;
    color: rgba(220,220,220,1);
    border-radius: 4px;
  }
}
</style>
