import { defineStore } from 'pinia';

export const ResponsiveSizes = Object.freeze({
  Desktop: Symbol("Desktop"),
  Tablet: Symbol("Tablet"),
  Mobile: Symbol("Mobile"),
});

export const useResponsiveStore = defineStore('responsive', {
  state: () => {
    return {
      size: ResponsiveSizes.Mobile
    }
  },
  getters: {
    isTabletOrBigger() {
      return this.size === ResponsiveSizes.Tablet || this.size === ResponsiveSizes.Desktop
    },
    isTabletOrSmaller() {
      return this.size === ResponsiveSizes.Mobile || this.size === ResponsiveSizes.Tablet
    },
    isMobile() {
      return this.size === ResponsiveSizes.Mobile
    },
    isDesktop() {
      return this.size === ResponsiveSizes.Desktop
    },
    isTablet() {
      return this.size === ResponsiveSizes.Tablet
    }
  },
  actions: {
    updateSize(width) {
      if (width < 576) {
        this.size = ResponsiveSizes.Mobile
      } else if (width >= 576 && width < 992) {
        this.size = ResponsiveSizes.Tablet
      } else if (width >= 992) {
        this.size = ResponsiveSizes.Desktop
      }
    }
  }
})
