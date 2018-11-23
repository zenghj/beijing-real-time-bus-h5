<template>
  <section class="my-watch-list-page">
    <header class="app-header-bar">
      我的关注
    </header>
    <div class="body">
      <div class="cards">
        <router-link class="card" v-for="(item, index) in watchList" :to="{name: 'BusInfo', query: item.query}" :key="index">
            <i class="icon-star"></i>
            <div>
              <p>{{item.routeName}}</p>
              <p>{{item.curStopName}}</p>
              <p>{{item.routeInfo}}</p>
            </div>
            <div>
              <p>{{item.remainingStops ? item.remainingStops : '-'}}站</p>
              <p>{{item.remainingTime ? item.remainingTime : '-'}}</p>
            </div>
         
        </router-link>

      </div>
    </div>
    <v-tab-nav></v-tab-nav>
  </section>

</template>

<script>
import storage, {STORAGE_KEYS} from 'Assets/js/storage'
export default {
  data() {
    return {
      watchList: [],
    }
  },
  created() {
    let watchListMap = storage.get(STORAGE_KEYS.WATCHED_ROUTES_BASIC_INFO)
    this.watchList = Object.values(watchListMap)
  }
}
</script>

<style lang="less" scoped>
.body {
  padding: 0 2em;
}
.card {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em 0;
  padding: 0.8em;
  box-shadow: 0px 1px 10px #ccc;
  border-radius: 5px;
  .icon-star {
    position: absolute;
    top: 0.2em;
    right: 0.8em;
    color: #ff9800;
    font-size: 20px;
  }
  p {
    margin: 0.3em;
  }
}
</style>
  