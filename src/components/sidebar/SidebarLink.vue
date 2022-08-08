<template>
  <div class="sidebar-link">
    <router-link :to="to">
      <div class="icon">
        <fa-icon :icon="icon"/>
      </div>
      <span class="label">
        <slot></slot>
      </span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "sidebar-link",
  props: {
    to: {
      type: String,
      required: true
    },
    icon: {
      type: [String, Array],
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar-link {
  a {
    all: unset;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    padding: 0.3em;
    color: rgba(240,240,240,0.45);

    &.router-link-active {
      color: rgba(240,240,240,0.9);
      background-color: rgba(240,240,240,0.2);
      border-right: 6px solid rgba(240,240,240,0.7);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-right: 0.15em;
      font-size: 24px;
      text-align: center;
    }

    .label {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
