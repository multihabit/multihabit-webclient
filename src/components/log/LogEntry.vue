<template>
  <div class="log-entry" :id="habit.habit_id">
    <div class="log-entry-label">{{ habit.label }}</div>
    <div class="log-entry-note" :contenteditable="noteEditable" inputmode="text" enterkeyhint="done" @keydown.enter.prevent="updateNote" @click="noteClicked" ref="entryNote">{{ entry?.note }}</div>
    <div class="log-entry-entry">
      <div class="log-entry-entry-value" :contenteditable="valueEditable"  inputmode="text" enterkeyhint="done" @keydown.enter.prevent="updateValue" @click="valueClicked" ref="entryValue">{{ display.value }}</div>
      <div class="log-entry-entry-label">{{ display.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogEntry',
}
</script>

<script setup>
import { defineProps, computed, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';
import { calculateInputVal, getNowInteger } from '@/helpers/util';

const props = defineProps({
  habit: {type: Object, required: true}
});
const route = useRoute();
const dateInteger = route.params.dateInteger || getNowInteger() ;
const user = useUserStore();
const profile = await user.profile;
const entry = ref(await user.getEntry(dateInteger, props.habit.habit_id));
const valueEditable = ref(false);
const noteEditable = ref(false);
const entryValue = ref();
const entryNote = ref();
const tracking_mode = profile.value.tracking_mode;

const value = computed(() => 
  entry.value != null ? entry.value.value : 0);

const note = computed(() => entry.value != null ? entry.value.note : '');

const display = computed(() => {
  const display = {
    value: '00:00',
    label: 'mm:ss'
  }

  const habitLabel = props.habit.label;

  if (habitLabel === 'Writing' && tracking_mode === 'words-writer') {
    display.value = value.value;
    display.label = 'words';
  } else {
    const minutes = Math.floor(value.value/60);
    const seconds = value.value%60;
    display.value = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
  }

  return display;
})

function valueClicked() {
  if (!valueEditable.value) {
    valueEditable.value = true;
    setTimeout(() => {entryValue.value.focus()},0);
  }
}

function noteClicked() {
  if (!noteEditable.value) {
    noteEditable.value = true;
    setTimeout(() => {entryNote.value.focus()},0);
  }
}

function updateNote() {
  const input = entryNote.value.innerHTML;
  
  if (input !== note.value) {
    user.updateEntry(dateInteger,props.habit,value.value, input, entry.value==null).then((e) => {entry.value = e});
  } else {
    entryNote.value.innerHTML = note.value;
  }

  setTimeout(() => {entryNote.value.blur()},0);
  noteEditable.value = false;
}

function updateValue() {
  const input = entryValue.value.innerHTML;
  const regex = new RegExp(/^([+-]?)(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$/);

  if (regex.test(input)) {
    let inputParts = input.match(regex);
    inputParts.shift();
    const modifier = inputParts.shift();
    inputParts = inputParts.filter((i)=>i!==undefined).map((i)=>parseInt(i));

    if (!((props.habit.label === 'Writing' && tracking_mode === 'words-writer') && inputParts.length > 1)) {
      const inputVal = calculateInputVal(input, value);

      if (inputVal !== value.value) {
        user.updateEntry(dateInteger,props.habit,inputVal, note.value, entry.value==null).then((e) => {entry.value = e});
        entryValue.value.innerHTML = display.value.value;
      } else {
        entryValue.value.innerHTML = display.value.value;
      }
    } else {
      entryValue.value.innerHTML = display.value.value;
    }
  } else {
    entryValue.value.innerHTML = display.value.value;
  }

  setTimeout(() => {entryValue.value.blur()},0);
  valueEditable.value = false;
}

</script>

<style lang="scss">
.log-entry {
  display: grid;
  grid-template-columns: 25% 1fr 25%;
  grid-template-rows: max-content;
  width: 100%;
  padding: 0px 15px;
  box-sizing: border-box;

  &:nth-child(2n) {
    background-color: rgba(21, 8, 0, 0.2);
  }

  > div:not(:last-child) {
    border-right: 1px solid var(--nav-background);
    padding-right: 15px;
  }

  > div {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  &-note {
    text-align: left;
    padding-left: 10px;
  }

  &-entry {
    text-align: left;
    padding-left: 10px;
    pointer-events: none;

    &-value {
      font-size: 110%;
      pointer-events: auto;
    }

    &-label {
      font-size: 70%;
      font-weight: bold;
    }
  }
}
</style>
