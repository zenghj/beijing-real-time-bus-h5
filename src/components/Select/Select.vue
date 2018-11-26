<template>
  <div class="select-root" v-click-outside="hideOptions">
    <div class="input-wrapper">
      <input v-if="filterable" 
        :value="query" 
        @input="handleQueryChange" 
        class="select-input" 
        type="text" 
        :placeholder="placeholder" 
        :disabled="disabled"
        @click="toggle">
      <input
        v-else
        :value="selectedLabel"
        class="select-input"
        type="text"
        :placeholder="placeholder"
        readonly
        :disabled="disabled"
        @click="toggle"
      >
      <i :class="['icon-arrow2-down', 'icon-arrow', optionsVisible? 'rotated' : '']" @click="toggle"></i>
    </div>
    <transition name="fade">
      <div v-show="optionsVisible" class="options">
        <slot v-if="$slots.default"></slot>
        <div class="tip" v-else-if="!loading">暂无选项</div>
        <div class="tip" v-if="noMatch">无匹配数据</div>
        <div class="tip" v-if="loading">加载中...</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    filterable: Boolean,
    loading: Boolean,
    disabled: Boolean,
  },
  provide() {
    return {
      $parentSelect: this,
    }
  },
  data() {
    return {
      optionsVisible: false,
      selectedOption: null,
      // cachedOptions: [],
      options: [],
      optionsUuidMap: {},
      query: '',
      filteredCount: 0,
      noMatch: false,
    }
  },
   computed: {
    selectedLabel() {
      if(this.selectedOption) {
        return this.selectedOption.label;
      }
      return '';
    }
  },
  watch: {
    value(newVal) {
      this.$nextTick(() => {
        this.setSelect(newVal);
      })
    },
  }, 
  mounted() {
    if(this.value) {
      this.setSelect(this.value);
    }
    // this.cachedOptions = [...this.options]
  },
  methods: {
    setSelect(val) {
      let option = this.getOption(val)
      if(option) {
        this.selectedOption = option;
        if(this.filterable) {
          this.query = option.label;
        }
      } else {
        this.selectedOption = null;
      }

    },
    getOption(val) {
      let opt;
      for(let option of this.options) {
        if(option.value === val) {
          opt = option;
          break;
        }
      }
      return opt;
    },
    toggle(e) {
      if(this.optionsVisible) {
        this.hideOptions();
      } else {
        this.showOptions();
      }
    },
    hideOptions() {
      this.optionsVisible = false;
      this.filteredCount = this.options.length;
      if(this.query && !this.isOneOfOptions(this.query)) {
        this.query = '';
      }
      this.noMatch = false;
    },
    isOneOfOptions(str) {
      let idx = this.options.findIndex(item => item.label === str)
      return idx > -1;
    },
    showOptions() {
      if(!this.optionsVisible) {
        this.optionsVisible = true;
        if(this.filterable) {
          this.filterOptions(this.query);
        }
      }
      
    },
    // @inject to select-option
    handleSelect(e, {label, value}) {
      this.$emit('input', value);
      this.hideOptions();
    },
    // @inject to select-option
    registerOption(optionVm) {
      if(!this.optionsUuidMap[optionVm.uuid]) {
        // is it ok to initially setSelect here or it's too time consuming?
        this.optionsUuidMap[optionVm.uuid] = true;
        this.options.push(optionVm);
        this.filteredCount +=1;
      }
    },
    handleQueryChange(e) {
      let query = e.target.value.trim();
      this.query = query;
      this.filterOptions(query);
      this.showOptions();
    },
    filterOptions(query) {
      this.filteredCount = this.options.length;
      if(!query) {
        this.options.forEach(option => option.show())
        return;
      }
      this.options.forEach(option => {
        if(option.label.includes(query)) {
          option.show();
        } else {
          option.hide();
          this.filteredCount -= 1;
        }
      })
      let optLen = this.options.length;

      if(optLen && this.filteredCount <= 0) {
        this.noMatch = true;
      } else {
        this.noMatch = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/less-util.less';
@selectHeight: 2.5em;
.select-root {
  // display: inline-block;
  position: relative;
  cursor: pointer;
  .fade(.2s);
}
.input-wrapper {
  display: inline-block;
  position: relative;
  width: 100%;
  .select-input {
    box-sizing: border-box;
    display: inline-block;
    width: inherit;
    padding: 0 0.5em;
    border: 1px solid #aaa;
    outline: none;
    border-radius: 2px;
    height: @selectHeight;
    line-height: @selectHeight;
    &:active, &:focus {
      border-color: @primaryColor;
    }
    &:disabled {
      background: @lightestGray;
      border-color: @lightGray;
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  .icon-arrow {
    position: absolute;
    right: 0.2em;
    top: @selectHeight / 4;
    color: @lightGray;
    transition: all .2s ease-in-out;
    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.options {
  position: absolute;
  left: 0;
  top: @selectHeight;
  box-sizing: border-box;
  width: 100%;
  padding: 0.5em;
  margin-bottom: 1em;
  background: #fff;
  box-shadow: @boxShadow;
  border-radius: 4px;
  z-index: @selectOptionsZindex;
  .tip {
    color: #aaa;
  }
}
</style>
