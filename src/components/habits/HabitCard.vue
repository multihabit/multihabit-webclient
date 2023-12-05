<template>
  <div class="habit-wrapper" :id="habit.habit_id">
    <h3>{{ habit.label }}</h3>
    <div class="habit">
      <div class="input value" ref="inputField" :id="`${habit.habit_id}-input`" @keydown.enter.prevent="saveEdited" :contenteditable="isEditable">{{ display.value }}</div>
      <span>{{ display.label }}</span>
      <hr />
      <div v-if="habit.label==='Writing' && tracking_mode==='words-writer'" class="words-writer buttons">
        <button v-if="!isEditable" @click="toggleWordsEditable">Edit</button>
        <button v-if="isEditable" @click="saveEditedWords">Save</button>
        <button @click="updateEntry">Log</button>
      </div>
      <div v-else class="buttons">
        <button v-if="!isEditable" class="start-timer-button" @click="startStopwatch">
          <fa-icon :icon="['fas','play']" />
        </button>
        <button v-if="!isEditable" class="pause-timer-button" @click="stopwatch.pause()">
          <fa-icon :icon="['fas','pause']" />
        </button>
        <button v-if="!isEditable" class="reset-timer-button" @click="stopwatch.reset()">
          <fa-icon :icon="['fas','rotate-right']" />
        </button>
        <button v-if="!isEditable" class="edit-timer-value-button" @click="toggleTimerEditable">Edit</button>
        <button v-if="isEditable" @click="saveEditedTimer">Save</button>
        <button @click="updateEntry">Log</button>
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
import { defineProps, computed, ref, nextTick, watchEffect, /*watchEffect*/ } from 'vue';
import { useStopwatch } from 'vue-timer-hook';
import { calculateInputVal } from '@/helpers/util';
import { useUserStore } from '@/stores/userStore';
import { useModalStore } from '@/stores/modalStore';
import { SavingModal } from '@/misc/SavingModal';

const inputField = ref(null);
const isEditable = ref(false);
const today = ref(null);
const todayInteger = ref(null);
const value = ref(0);
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
const stopwatch = useStopwatch(0,false);
const user = useUserStore();
const modal = useModalStore();

watchEffect(async () => {
  if(stopwatch.isRunning){
    const seconds = stopwatch.seconds.value;
    stopwatchUpdateValue();

    const now = new Date();
    const nowInteger = now.getFullYear() * 1e4 + (now.getMonth()+1) * 100 + now.getDate();
    if (today.value != null && nowInteger > todayInteger.value) {
      await user.updateEntry(todayInteger.value,props.habit,'add',value.value);
      updateToday();
      value.value = 0;
      stopwatch.reset();
    }
  }
})

const display = computed(() => {
  const result = {
    value: value.value,
    label: 'Words'
  };

  if (props.habit.label !== 'Writing' || props.tracking_mode !== 'words-writer') {
    let display = [];
    result.label = '';
    display.push(Math.floor(value.value/60));
    display.push(Math.floor(value.value%60))
    result.label += 'MM:SS'
    result.value = display.map((i) => i.toString().padStart(2,'0')).join(':');
  }

  return result;
});

function toggleWordsEditable() {
  isEditable.value = true;
  nextTick(() => inputField.value.focus());
}

function toggleTimerEditable() {
  stopwatch.pause();
  isEditable.value = true;
  nextTick(() => inputField.value.focus());
}

function startStopwatch() {
  updateToday();
  stopwatch.start();
}

function stopwatchUpdateValue() {
  value.value = stopwatch.hours.value * 3600 + stopwatch.minutes.value * 60 + stopwatch.seconds.value;
}

function updateToday() {
  if (today.value == null) {
    today.value = new Date();
    todayInteger.value = today.value.getFullYear() * 1e4 + (today.value.getMonth()+1) * 100 + today.value.getDate();
  }
}

function saveEditedTimer() {
  const input = inputField.value.innerHTML;
  const regex = new RegExp(/^([+-]?)(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$/);
  let offsetVal = 0;

  if (regex.test(input)) {
    let inputParts = input.match(regex);
    inputParts.shift();
    const modifier = inputParts.shift();
    inputParts = inputParts.filter((i) => i !== undefined).map((i) => parseInt(i));

    const inputVal = calculateInputVal(input, value);
    if (value.value === inputVal) {
      inputField.value.innerHTML = display.value.value;
    } else {
      offsetVal = inputVal;
    }
  } else {
    inputField.value.innerHTML = display.value.value;
  }
  document.activeElement.blur();
  isEditable.value = false;
  stopwatch.reset(value.value + offsetVal);
}

function saveEditedWords() {
  const input = inputField.value.innerHTML;
  const regex = new RegExp(/^([+-]?)(\d+)$/);
  if (regex.test(input)) {
    const inputParts = input.match(regex);
    inputParts.shift();
    const modifier = inputParts.shift();
    const inputVal = parseInt(inputParts.shift());

    if (modifier) {
      value.value += parseInt(`${modifier}${inputVal}`);
    } else {
      value.value = inputVal;
    }
  } else {
    inputField.value.innerHTML = display.value.value;
  }
  document.activeElement.blur();
  isEditable.value = false;
}

function saveEdited() {
  if (props.habit.label === 'Writing' && props.tracking_mode === 'words-writer') {
    saveEditedWords();
  } else {
    saveEditedTimer();
  }
}

async function updateEntry() {
  modal.open(SavingModal,{},[]);
  await user.updateEntry(todayInteger.value,props.habit,'add',value.value,null);
  stopwatch.reset(0,false);
  value.value = 0;
  modal.close();
}
</script>

<style lang="scss">
.habit-wrapper {
  width: 100%;
  aspect-ratio: 1/1;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  grid-template-columns: 1fr;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid var(--nav-background);
  position: relative;
  box-sizing: border-box;

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
