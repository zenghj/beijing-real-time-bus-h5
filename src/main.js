// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/styles/common.less'
import vSelect from 'vue-select'
import 'Components'
import globalMixin from 'Assets/js/globalMixin'

Vue.config.productionTip = false
Vue.mixin(globalMixin)

Vue.component('v-select', vSelect)
/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
