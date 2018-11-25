import Vue from 'vue'
import Button from './Button.vue'
import TabNav from './TabNav.vue'
import ProgressBar from './ProgressBar.vue'
import Select from './Select/Select.vue'
import SelectOption from './Select/SelectOption.vue'
export {default as $message} from './message'

Vue.component('v-button', Button)
Vue.component('v-tab-nav', TabNav)
Vue.component('v-select', Select)
Vue.component('v-select-option', SelectOption)
Vue.component('v-progress-bar', ProgressBar)