<template>
  <div class="option-root" @click="handleClick" v-show="visible">
    <template v-if="$slots.default">
      <slot></slot>
    </template>
    <template v-else>
      {{label}}
    </template>
  </div>
</template>

<script>
import {getUuid} from 'Assets/js/utils'
export default {
  props: {
    label: {
      type: [String, Number]
    },
    value: null,
  },
  data() {
    return {
      visible: true,
      uuid: getUuid('option'),
    }
  },
  inject: ['$parentSelect'],
  created() {
    // console.log('opt');
    this.$parentSelect.registerOption(this)
  },
  methods: {
    handleClick(e) {
      this.$parentSelect.handleSelect(e, {
        label: this.$props.label,
        value: this.$props.value,
      });
    },
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    }
  }
}
</script>

<style>

</style>
