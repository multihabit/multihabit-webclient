<template>
  <div class="onboarding-mobile">
    <div class="onboarding-preamble">
      <div class="onboarding-preamble-icon">
        <fa-icon icon="feather-pointed"/>
      </div>
      Multihabit offers a number of different tracking options for writers and non-writers alike. Please choose one of the options below. You can change your choice at any time.
    </div>
    <div class="onboarding-selection">
      <mh-dropdown label="Select Tracking Type" :options="options" @selected="onSelected"/>
    </div>
    <div class="onboarding-content">
      <component :is="getComponent()" @confirmed="onChoiceConfirmed"/>
    </div>
  </div>
</template>

<script>
import MHDropdown from '@/components/MHDropdown.vue';

export default {
  name: 'onboarding-mobile',
  components: {
    'mh-dropdown': MHDropdown
  }
}
</script>

<script setup>
import OnboardingOption from './OnboardingOption.vue';
import TimeWriter from './TimeWriter.vue';
import WordsWriter from './WordsWriter.vue';
import NonWriter from './NonWriter.vue';

import { ref } from 'vue';

const selection = ref('');

const options = [
  {
    label: 'Writer (Words)',
    value: 'words-writer',
    component: WordsWriter
  },
  {
    label: 'Writer (Time)',
    value: 'time-writer',
    component: TimeWriter,
  },
  {
    label: 'Non-Writer',
    value: 'non-writer',
    component: NonWriter
  }
]

function onSelected(value) {
  selection.value = value;
}

function getComponent() {
  if (selection.value === '') return OnboardingOption;

  return options.find((o) => o.value === selection.value).component;
}

function onChoiceConfirmed() {
  console.log(selection.value);
}
</script>

<style scoped lang="scss">
.onboarding-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .onboarding-selection {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .onboarding-preamble {
    padding: 2rem 2rem 1rem 2rem;
    font-size: 11pt;

    .onboarding-preamble-icon {
      margin-bottom: 1.5rem;
      font-size: 48pt;
    }
  }
}
</style>
