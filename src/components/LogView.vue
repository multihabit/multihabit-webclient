<template>
  <section id="log">
    <div class="log-page" :key="dateInteger">
    <div class="header">
      <router-link :to="{name:'Log',params:{dateInteger:yesterday}}"><div><fa-icon icon="angle-left"/></div></router-link>
      <div class="header-text">{{ header }}</div>
      <router-link :to="{name:'Log',params:{dateInteger:tomorrow}}"><div><fa-icon icon="angle-right"/></div></router-link>
    </div>
    <div v-if="loaded">
      <LogCategory v-for="category in categories" :key="category" :category="category"/>
    </div>
  </div>
  </section>
</template>

<script>
import LogCategory from './log/LogCategory.vue';

export default {
  name: "LogView",
  components: {
    LogCategory
  }
}
</script>

<script setup>
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import { computed } from '@vue/reactivity';
  import { ref } from 'vue';

  const route = useRoute();
  const user = useUserStore();
  let dateInteger = parseInt(route.params.dateInteger);
  const date = {};
  const today = new Date();
  const categories = ['professional','self-improvement','leisure'];
  const loaded = ref(false);

  if (!dateInteger) {
    date.year = today.getFullYear();
    date.month = today.getMonth() + 1;
    date.day = today.getDate();
  } else {
    date.year = Math.floor(dateInteger/10000);
    date.month = Math.floor((dateInteger%10000)/100);
    date.day = Math.floor(dateInteger%100);
  }

  today.setFullYear(date.year);
  today.setMonth(date.month-1);
  today.setDate(date.day);
  const yesDate = new Date(new Date(today).setDate(today.getDate()-1));
  const tomDate = new Date(new Date(today).setDate(today.getDate() + 1));
  const tomorrow = (tomDate.getFullYear()*10000)+((tomDate.getMonth()+1)*100) + tomDate.getDate();
  const yesterday = (yesDate.getFullYear()*10000)+((yesDate.getMonth()+1)*100) + yesDate.getDate()
  dateInteger = (date.year * 10000) + (date.month * 100) + (date.day);

  const header = computed(() => {
    let header = [];

    header.push(date.day);
    header.push(today.toLocaleString('default',{month: 'long'}));

    if (date.year !== today.getFullYear()) {
      header.push(date.year);
    }

    return header.join(' ');
  })

  user.getEntries(dateInteger).then(() => {
    loaded.value = true;
  });
</script>

<style lang="scss">
#log {
  flex: 1 1 0;

  .header {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    height: 30px;
    padding: 15px 0px;
    align-items: center;
    justify-items: center;
    border-bottom: 1px solid var(--nav-background);
    margin-bottom: 10px;

    .header-text {
      font-size: 150%;
    }
  }
}
</style>
