<template>
  <div class="habits-panel" :id="category">
    <h2>{{ Constants.HABIT_CATEGORIES[category] }}</h2>
    <div class="habits-container">
      <mh-habit v-for="habit in habits" :key="habit.habit_id" :habit="habit" :tracking_mode="tracking_mode" @updated="(habit_id,value,isNewEntry) => $emit('habitUpdated',category,habit_id,value,isNewEntry)"/>
    </div>
  </div>
</template>

<script>
import HabitCard from '@/components/habits/HabitCard.vue';

export default {
  name: "habits-panel",
  components: {
    "mh-habit": HabitCard,
  },
  emits: ['habitUpdated']
}
</script>

<script setup>
import { defineProps } from 'vue';
import { Constants } from '@/helpers/constants.js';

const props = defineProps({
    category: {
      type: String,
      required: true
    },
    habits: {
      type: Object,
      required: true
    },
    tracking_mode: {
      type: String,
      required: true
    }
  });
// const {category, habits} = toRefs(props);
console.log(props.habits);
</script>

<style lang="scss">
.habits-panel {

  .habits-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, min(175px,45vw));
    grid-auto-rows: min(175px,45vw);
    column-gap: 4vw;
    row-gap: 4vw;
    padding: 0px 3vw;
    box-sizing: border-box;
  }

  &:last-child {
    margin-bottom: 30px;
  }
}
</style>
