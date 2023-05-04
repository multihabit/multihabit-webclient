<template>
  <div class="dashboard-config">
    <div v-for="category in categories" :key="category">
      <div>{{ category }}</div>
      <label :for="`${category}-column-select`">Columns: </label>
      <select :name="`${category}-column-select`" :ref="columnRefs[category]" @change="updateCols(category)">
        <option v-for="i in [1,2,3]" :key="`${category}-${i}-column`">{{ i }}</option>
      </select>
      <div :class="category">{{ config.habits[category] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardConfigView'
}
</script>

<script setup>
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';

  const user = useUserStore();
  const config = await user.config;
  const categories = ['professional','self-improvement','leisure'];

  const columnRefs = {
    professional: ref(null),
    'self-improvement': ref(null),
    leisure: ref(null)
  }

  const color = "#ffff00";

  function getColumnNumbers(category) {
    const cRef = columnRefs[category];
    const options = cRef.value[0].options;
    const selectedIndex = options.selectedIndex;
    return options[selectedIndex].value;
  }

  function updateCols(category) {
    const cols = parseInt(getColumnNumbers(category));
    config.value.habits[category].columns = cols;
    console.log(config.value.habits);
  }
</script>

<style lang="scss">
.dashboard-config {
  background-color: v-bind(color);
}
</style>
