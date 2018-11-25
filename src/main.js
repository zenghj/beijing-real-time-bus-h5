// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'Assets/js/directives'
import 'Components'
import App from './App'
import router from './router'
import './assets/styles/common.less'
import globalMixin from 'Assets/js/globalMixin'
Vue.config.productionTip = false
Vue.mixin(globalMixin)

/* eslint-disable no-new */
window.app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
