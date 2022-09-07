<template>
  <div class="mh-dropdown"
    :class="{active: dropdownToggled}">
    <div class="mh-dropdown-label" @click="toggleDropdown">
      <div class="mh-dropdown-label-text">{{ getLabel() }}</div>
      <div class="mh-dropdown-label-icon">
        <fa-icon icon="angle-down"/>
      </div>
    </div>
    <div class="mh-dropdown-content" ref="content">
      <div v-for="option in options" 
        :key="option.value" 
        @click="onSelectOption(option.value)"
        :class="{
          selected: value === option.value
        }"
        class="mh-dropdown-option">
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mh-dropdown'
}
</script>

<script setup>
import { defineEmits, ref, defineProps } from 'vue';
const emit = defineEmits(['selected']);

let dropdownToggled = ref(false);
let value = ref('');
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
});

const content = ref(null);

function toggleDropdown() {
  dropdownToggled.value = !dropdownToggled.value;
  
  if (dropdownToggled.value) {
    const contentHeight = content.value.clientHeight;
    content.value.style.clip = `rect(auto, auto, ${contentHeight + 20}px, auto)`;
  } else {
    content.value.style.removeProperty('clip');
  }
}

function onSelectOption(v) {
  value.value = v;
  toggleDropdown();
  emit('selected', v);
}

function getLabel() {
  if (value.value === '' || dropdownToggled.value) return props.label;

  return props.options?.find((p) => p.value === value.value)?.label;
}
</script>

<style scoped lang="scss">
.mh-dropdown {
  position: relative;
  min-width: 50%;
  max-width: 320px;
  margin: 0 auto;

  .mh-dropdown-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    border: 1px solid var(--nav-background);
    // border-radius: 4px;
    background-color: rgb(240,240,240);
    box-sizing: border-box;

    .mh-dropdown-label-icon {
      transition: 0.3s ease-in-out;
      margin-right: 0.3rem;
    }
  }

  .mh-dropdown-content {
    position: absolute;
    clip: rect(auto, auto, 0, auto);
    transition: 0.3s ease-in-out;
    background-color: rgb(240,240,240);;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--nav-background);
    border-top: 0px;
    text-align: left;

    .mh-dropdown-option {
      padding: 0.35rem 0.2rem;

      &:hover {
        background-color: rgba(20,20,20,0.3);
      }

      &.selected {
        background-color: rgba(20,20,20,0.1);
      }
    }
  }
  
  &.active {

    .mh-dropdown-label {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border-bottom: 0px;
      background-color: rgb(220,220,220);

      .mh-dropdown-label-icon {
        transform: rotate(180deg);
      }
    }

    .mh-dropdown-content {
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
  }
}
</style>
