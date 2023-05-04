<template>
  <div class="log-page-category" :key="category">
    <div class="log-category-header">
      {{ categoryName }}
    </div>
    <Suspense>
      <LogEntry v-for="habit in habits" :key="habit.habit_id" :habit="habit"/>
    </Suspense>
  </div>
</template>

<script>
import LogEntry from './LogEntry.vue';

export default {
  name: 'LogCategory',
  components: {
    LogEntry
  }
}
</script>

<script setup>
import { Constants } from '@/helpers/constants';
import { defineProps } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  category: {type: String, required: true}
});
const user = useUserStore();
const allHabits = await user.habits;
const habits = allHabits.value[props.category];
const categoryName = Constants.HABIT_CATEGORIES[props.category]
</script>
