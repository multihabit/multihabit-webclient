<template>
  <div>
    <div v-if="isOpen" class="modal">
      <div class="modal-box">
        <label class="close-button" @click="modal.close()">
          <fa-icon :icon="['fas','xmark']"/>
        </label>

        <component :is="view" v-model="model" :payload="payload" />

        <div class="modal-actions">
          <button v-for="action in actions" @click="action.callback(model)" :key="action.id">
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MH Modal'
}
</script>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useModalStore from '@/stores/modalStore';

const modal = useModalStore();
const model = ref({});
const { isOpen, payload, view, actions } = storeToRefs(modal);
</script>

<style lang="scss">
.modal {
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  position: fixed;
  top: 0;
  display: grid;
  align-items: center;
  justify-items: center;
  background-color: rgba(30,30,30,0.7);

  .modal-box {
    padding: 15px;
    background-color: rgb(240,240,240);
    border: 1px solid rgb(200,200,200);
    box-shadow: 0 0 2px 1px rgba(30,30,30,0.8);

    .close-button {
      float: right;
    }

    .modal-actions {
      margin-top: 5px;
    }
  }
}
</style>
