<template>
  <button v-if="text" v-bind="$attrs" @click="handleClick" :class="['btn', size, type]">{{text}}</button>
  <button v-else v-bind="$attrs" @click="handleClick" :class="['btn', size, type]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    size: {
      type: String,
      default: 'small',
      validator(value) {
        return ['medium', 'small', 'mini'].indexOf(value) !== -1;
      }
    },
    type: {
      type: String,
      // default: 'primary',
      validator(value) {
        return ["primary", "success", "warning", "danger", "info", "text"].indexOf(value) !== -1;
      }
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e);
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/vars.less';
.btn {
  border: 1px solid @lightGray;
  padding: .5em 1.2em;
  outline: none;
  background-color: #fff;
  border-radius: 2px;
  color: @darkGray;
}
.medium {
  font-size: 16px;
}
.small {
  font-size: 14px;
}
.mini {
  font-size: 12px;
}
.primary {
  background-color: @darkPrimaryColor;
  border-color: @darkPrimaryColor;
  color: #fff;
  border-radius: 2px;
}
</style>