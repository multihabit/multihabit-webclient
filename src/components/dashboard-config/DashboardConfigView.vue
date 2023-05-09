<template>
  <div class="dashboard-config">
    <div class="header">
      <div class="title">Configuration</div>
      <div class="save-button" @click="saveConfig()"><fa-icon :icon="['fas','save']"/></div>
    </div>
    <div v-for="category in categories" :key="category" class="category">
      <div>{{ HABIT_CATEGORIES[category] }}</div>
      <label :for="`${category}-column-select`">Columns: </label>
      <select :name="`${category}-column-select`" :ref="columnRefs[category]" @change="updateCols(category)">
        <option v-for="i in [2,3]" :key="`${category}-${i}-column`" :selected="i===3">{{ i }}</option>
      </select>
      <template v-if="loaded">
        <draggable v-model="lists[category].habits" class="draggable" item-key="id" :class="category" :style="{'grid-template-columns': `repeat(${config.habits[category].columns},1fr)`}" @update="updateLists()">
          <template #item="{element}">
            <div>
              <div class="handle"><fa-icon :icon="['fas','bars']"/></div>
              <div class="label">{{ element.label }}</div>
            </div>
          </template>
        </draggable>
      </template>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'DashboardConfigView',
  components: {
    draggable
  }
}
</script>

<script async setup>
  import { ref, onBeforeMount } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { Constants } from '@/helpers/constants';
  import useModalStore from '@/stores/modalStore';
  import SavingModal from '../misc/SavingModal.vue';

  const user = useUserStore();
  const modal = useModalStore();
  let config = ref(null);
  const lists = ref(null);
  const loaded = ref(false);

  onBeforeMount(async () => {
    config = await user.config;
    lists.value = config.value.habits;

    if (config.value != null) {
      loaded.value = true;
    }
  })

  console.log(config.value);
  const categories = ['professional','self-improvement','leisure'];
  const { HABIT_CATEGORIES } = Constants;

  const columnRefs = {
    professional: ref(null),
    'self-improvement': ref(null),
    leisure: ref(null)
  }

  function getColumnNumbers(category) {
    const cRef = columnRefs[category];
    const options = cRef.value[0].options;
    const selectedIndex = options.selectedIndex;
    return options[selectedIndex].value;
  }

  function updateCols(category) {
    const cols = parseInt(getColumnNumbers(category));
    config.value.habits[category].columns = cols;
  }

  function updateLists() {
    config.value.habits = lists;
  }

  function saveConfig() {
    modal.open(SavingModal,{},[]);
    user.updateConfig(config.value).then(() => {modal.close()}).catch();
  }
</script>

<style lang="scss">
.dashboard-config {
  overflow-y: scroll;

  .header {
    display: grid;
    grid-template-columns: 1fr 80% 1fr;
    grid-template-areas: "x title save";
    border-bottom: 1px solid var(--nav-background);
    position: sticky;
    top: 0;
    height: 40px;
    background-color: var(--app-background);

    .title {
      grid-area: title;
      display: flex;
      justify-content: center;
      align-content: center;
      font-size: 32px;
    }

    .save-button {
      grid-area: save;
      font-size: 32px;
      display: grid;
      justify-content: center;
      align-content: center;
    }
  }
  .category {
    width: 80%;
    margin: 15px auto 0 auto;
    border: 1px solid rgb(30,30,30);
    padding: 15px;

    .draggable {
      margin-top: 15px;
      display: grid;
      grid-auto-rows: max-content;
      grid-gap: 10px;
      
       > div {
        aspect-ratio: 1/1;
        width: 100%;
        color: rgba(250,250,250,1);
        border: 1px solid rgba(250,250,250,1);
        background-color: rgba(30,30,30,0.95);
        display: flex;
        flex-direction: column;

        .handle {
          margin-top: 10px;
        }

        .label {
          margin: auto 0px;
        }
      }
    }
  }
}
</style>
