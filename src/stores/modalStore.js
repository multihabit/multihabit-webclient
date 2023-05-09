import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
  const isOpen = ref(false);
  const view = ref({});
  const actions = ref([]);
  const payload = ref({});

  function open(view, payload, actions) {
    this.view = markRaw(view);
    this.actions = actions;
    this.payload = payload;
    this.isOpen = true;
  }

  function close() {
    this.isOpen = false;
    this.actions = [];
    this.views = {};
    this.payload = {};
  }

  return { open, close, isOpen, view, actions, payload }
})

export default useModalStore;
