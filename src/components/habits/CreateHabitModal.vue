<template>
  <div class="modal-content">
    <h2>Create New Habit</h2>
      <div id="name">
        <label for="name">Name:</label>
        <input v-model="name" type="text" name="name" @input="update()"/>
      </div>
      <div id="category">
        <label for="category">Category:</label>
        <select name="category" ref="selectedCategory" @change="update()">
          <option v-for="c in categories" :key="c" :selected="c === category" :value="c">
            {{ Constants.HABIT_CATEGORIES[c] }}
          </option>
        </select>
      </div>
  </div>
</template>

<script>
export default {
  name: 'CreateHabitModal',
}
</script>

<script setup>
import { defineProps, defineEmits, toRefs, ref } from 'vue';
import { Constants } from '@/helpers/constants';
import { debounce } from '@/helpers/debounce';

const props = defineProps(['modelValue', 'payload']);
const { payload } = toRefs(props);
const { category } = toRefs(payload);
const categories = Object.keys(Constants.HABIT_CATEGORIES);
const emits = defineEmits(['update:model-value']);

const name = ref("");
const selectedCategory = ref(category);

const update = debounce(() => {
  const value = {
    name: name.value,
    selectedCategory: selectedCategory.value.value,
  }
  emits('update:model-value',value);
}, 300)
</script>

<style lang="scss">
.modal-content {
  > div {
    text-align: left;

    &:not(last-child) {
      margin-top: 5px;
    }

    > label {
      margin-right: 5px;
    }
  }
}
</style>
