<template>
  <div class="habits-panel" :id="category">
    <div class="header">
      <div class="title">
        {{ Constants.HABIT_CATEGORIES[category] }}
      </div>
      <div class="add-button" @click="openModal()"><fa-icon :icon="['fas','square-plus']"/></div>
    </div>
    <div class="habits-container" :style="{
      'grid-template-columns': `repeat(${columns},1fr)`
    }">
      <mh-habit v-for="habit in habitOrder" :key="habit.id" :habit="habits[habit.id]" :tracking_mode="tracking_mode" @updated="(habit_id,value,isNewEntry) => $emit('habitUpdated',category,habit_id,value,isNewEntry)"/>
    </div>
  </div>
</template>

<script>
import HabitCard from '@/components/habits/HabitCard.vue';
import SavingModal from '../misc/SavingModal.vue';

export default {
  name: "habits-panel",
  components: {
    "mh-habit": HabitCard,
  },
  emits: ['habitUpdated']
}
</script>

<script async setup>
import { defineProps } from 'vue';
import { useUserStore } from '@/stores/userStore';
import useModalStore from '@/stores/modalStore';
import CreateHabitModal from './CreateHabitModal.vue';
import { Constants } from '@/helpers/constants.js';

const user = useUserStore();
const modal = useModalStore();
const config = await user.config;
const habitOrder = config.value.habits[props.category].habits;
const columns = config.value.habits[props.category].columns;

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

function openModal() {
  modal.open(CreateHabitModal,{ 
    category: props.category 
  },[
    {
      id: 'submit',
      label: 'Submit',
      callback: (model) => {
        const { name: label, selectedCategory: category } = model;
        modal.close();
        openSavingModal();
        user.createHabit(label,category).then(() => {
          closeSavingModal();
        });
      }
    }
  ]);
}

function openSavingModal() {
  modal.open(SavingModal,{},[]);
}

function closeSavingModal() {
  modal.close();
}
</script>

<style lang="scss">
.habits-panel {

  &:not(last-child) {
    margin-top: 25px;
  }

  .header {
    display: grid;
    grid-template-areas: "leftside title rightside";
    grid-template-columns: 32px 1fr 32px;
    position: sticky;
    top: 0;
    background-color: var(--app-background);
    font-size: 24px;
    margin-bottom: 10px;

    .title {
      grid-area: title;
      text-align: center;
    }

    .add-button {
      grid-area: rightside;
      text-align: left;
    }
  }

  .habits-container {
    width: 100%;
    display: grid;
    grid-auto-rows: max-content;
    grid-gap: 10px;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }

  &:last-child {
    margin-bottom: 30px;
  }
}
</style>
