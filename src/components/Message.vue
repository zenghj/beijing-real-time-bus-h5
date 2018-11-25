<template>
  <transition name="fade" @after-leave="clear">
    <div class="mask" v-show="visible">
      <div class="message"><span>{{text}}</span></div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    text: String,
    duration: {
      type: Number,
      default: 1000,
    }
  },
  data() {
    return {
      visible: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.visible = true;
    })
    setTimeout(() => {
      this.close();
    }, this.$props.duration);
    // }, 10000000);
  },
  methods: {
    close() {
      this.visible = false;
    },
    clear() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
  }
}
</script>
<style lang="less" scoped>
@import "../assets/styles/vars.less";
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.message {
  position: fixed;
  box-sizing: border-box;
  max-width: 80%;
  padding: 1.5em;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0;
  border-radius: 4px;
  color: #fff;
  background: rgba(25, 24, 24, 0.8);
  z-index: @messageZindex;
}
</style>