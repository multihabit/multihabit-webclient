<template>
  <div class="habit-wrapper" :id="habit.habit_id">
    <h3>{{ habit.label }}</h3>
    <div class="habit">
      <div class="input value" ref="inputField" :id="`${habit.habit_id}-input`" @keydown.enter.prevent="emitUpdate" :contenteditable="isEditable">{{ display.value }}</div>
      <span>{{ display.label }}</span>
      <hr />
      <div class="buttons">
        <button v-if="!isEditable" @click="toggleEditable">Edit</button>
        <button v-if="isEditable" @click="emitUpdate">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mh-habit',
}
</script>

<script setup>
import { defineEmits, defineProps, computed, ref, nextTick } from 'vue';

const emits = defineEmits(['updated']);
const inputField = ref(null);
const isEditable = ref(false);
const props = defineProps({
  habit: {
    type: Object,
    required: true,
  },
  tracking_mode: {
    type: String,
    required: true,
  }
});

const value = computed(() => props.habit.activeEntry != null ? props.habit.activeEntry.value : 0);

const display = computed(() => {
  const result = {
    value: value.value,
    label: 'Words'
  };

  if (props.tracking_mode !== 'words-writer') {
    let display = [];
    result.label = '';
    if (value.value >= 3600) {
      display.push(Math.floor(value.value/3600));
      result.label += 'HH:';
    }
    display.push(Math.floor((value.value%3600)/60));
    display.push(Math.floor((value.value%3600)%60))
    result.label += 'MM:SS'
    result.value = display.map((i) => i.toString().padStart(2,'0')).join(':');
  }

  return result;
});

function toggleEditable() {
  isEditable.value = true;
  nextTick(() => inputField.value.focus());
}

function emitUpdate(){
  const input = inputField.value.innerHTML;
  const regex = new RegExp(/^([+-]?)(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$/);

  if (regex.test(input)) {
    let inputParts = input.match(regex);
    inputParts.shift();
    const modifier = inputParts.shift();
    inputParts = inputParts.filter((i) => i !== undefined).map((i) => parseInt(i));

    if(!(inputParts.length > 1 && props.tracking_mode === 'words-writer')) {
      const inputVal = calculateInputVal(input,value);
      
      if (inputVal !== value.value) {
        emits('updated',props.habit.habit_id,inputVal,props.habit.activeEntry == null);
      } else {
        inputField.value.innerHTML = display.value.value;
      }
    } else {
      inputField.value.innerHTML = display.value.value;
    }
  } else {
    inputField.value.innerHTML = display.value.value;
  }
  document.activeElement.blur();
  isEditable.value = false;
}

function calculateInputVal(input, value) {
  const regex = new RegExp(/^([+-]?)(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$/);
  let result;
  let tmpVal;

  let inputParts = input.match(regex);
  inputParts.shift();
  const modifier = inputParts.shift();
  inputParts = inputParts.filter((i) => i !== undefined).map((i) => parseInt(i));

  switch (inputParts.length) {
    case 1:
      tmpVal = inputParts[0];
      break;
    case 2:
      tmpVal = inputParts[0]*60 + inputParts[1];
      break;
    case 3:
      tmpVal = inputParts[0]*3600 + inputParts[1]*60 + inputParts[2];
      break;
  }

  if (modifier) {
    if (modifier == '+') {
      result = Math.max(value.value + tmpVal,0);
    } else if (modifier == '-') {
      result = Math.max(value.value + (tmpVal*-1),0);
    }
  } else {
    result = Math.max(tmpVal,0);
  }

  return result;
}
</script>

<style lang="scss">
.habit-wrapper {
  height: 300px;
  width: 300px;
  display: grid;
  grid-template-rows: 30px 2fr 30px;
  grid-template-columns: 1fr;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid var(--nav-background);
  position: relative;

  &:before {
    content: " ";
    position: absolute;
    top: 5px;
    bottom: 5px;
    right: 5px;
    left: 5px;
    border-radius: 50%;
    border: 1px solid var(--nav-background);
    pointer-events: none;
  }

  .habit {
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    
    hr {
      border: unset;
      height: 1px;
      border-top: 1px solid var(--nav-background);
      margin: 0.25rem 0px;
      width: 70%
    }

    .value {
      font-size: 180%;
    }

    span {
      font-weight: bold;
      font-size: 80%;
    }

    .buttons {
      margin-bottom: auto;
    }
  }

  h3 {
    position: relative;
    top: 20px;
  }
}
</style>
