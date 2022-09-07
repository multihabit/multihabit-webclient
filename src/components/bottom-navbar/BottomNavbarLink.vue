<template>
  <router-link :to="to">
    <fa-icon :icon="icon"/>
  </router-link>
</template>

<script>
export default {
  name: 'bottom-navbar-link',
  props: {
    to: {
      type: String,
      required: true
    },
    icon: {
      type: [String,Array],
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
  a {
    all: unset;
    flex: 1 1 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: rgba(240, 240, 240, 0.45);
  }

  .router-link-active {
    color: rgba(240,240,240,0.9);
  }
</style>
