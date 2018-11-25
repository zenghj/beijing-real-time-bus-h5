<template>
  <div v-show="visible" class="progress-bar-root" :style="{
    width: `${percentage}%`,
  }" v-bind="$attrs">
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },
  data() {
    return {
      percentage: 0,
      visible: true,
    }
  },
  created() {
    if(this.loading) {
      this.startProgress();
    }
  },
  watch: {
    loading(newVal, oldVal) {
      if(newVal === true) {
        this.startProgress();
      } else if(newVal === false && oldVal === true) {
        this.stopProgress();
      }
    }
  },
  methods: {
    getRandowStepCount(base = 1) {
      return Math.random() * base;
    },
    step() {
      if(this.percentage < 50) {
        this.percentage += this.getRandowStepCount(2);
      } else if(this.percentage < 80) {
        this.percentage += this.getRandowStepCount(1.5);
      } else if(this.percentage < 95) {
        this.percentage += this.getRandowStepCount(0.5);
      }
      if(this.percentage < 95) {
        window.requestAnimationFrame(this.step);
      }
    },
    startProgress() {
      this.percentage = 0;
      this.visible = true;
      window.requestAnimationFrame(this.step);
    },
    stopProgress() {
      this.percentage = 100;
      setTimeout(() => {
        this.visible = false;
      }, 200)
    },
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/vars.less';
.progress-bar-root {
  height: @progressBarHeight;
  background: @orange;
  // transition: width .1s ease-in-out;
}
</style>
