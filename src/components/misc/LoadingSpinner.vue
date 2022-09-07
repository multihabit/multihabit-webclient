<template>
  <div class="spinner">
    <div></div><div></div><div></div>
  </div>
</template>

<style scoped lang="scss">
.spinner {
  display: block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    border: 4px solid var(--nav-background);
    opacity: 1;
    border-radius: 50%;
    animation: ripple 3s cubic-bezier(0, 0.2, 0.8, 0.1) infinite;

    &:nth-child(2) {
      animation-delay: -1s;
    }

    &:nth-child(3) {
      animation-delay: -2s;
    }
  }
}

@keyframes ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }

  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }

  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }

  100% {
    top: 0;
    left: 0;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
