import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home.vue'
import BusInfo from '../pages/BusInfo.vue'
import MyWatchList from '../pages/MyWatchList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/BusInfo',
      name: 'BusInfo',
      component: BusInfo,
    },
    {
      path: '/MyWatchList',
      name: 'MyWatchList',
      component: MyWatchList,
    }
  ]
})
