<template>
  <div class="bus-info-container">
    <header class="app-header-bar">
      <i class="icon-left-arrow" @click="goBack"></i>
      <i class="icon-refresh" @click="refresh"></i>
    </header>
    <section class="bus-info">
      <div class="route-info">
        <div>
          <p>{{busInfo.routeName}} {{busInfo.routeInfo}}</p>
          <p>上车站点: {{busInfo.curStopName}}</p>
          <p>{{busInfo.busRunTime}}</p>
        </div>
        <v-button v-if="isWatchOn" size="small" @click="cancelAttention">取消关注</v-button>
        <v-button v-else size="small" @click="makeAttention">关注</v-button>

      </div>

      <p class="desc2">{{busInfo.desc2}}</p>
      <div class="buses">
        <div v-for="(name, index) in stopNames" :class="['bus', (busInfo.curStopSeq === index + 1 + '') ? 'current' : '']" :key="index">
          <i v-if="busesArriving.includes(index + 1 + '')" class="icon-bus active"></i>
          <i v-if="busesArriving.includes(index + 1.5 + '')" class="icon-bus middle active"></i>
          <i v-if="busesOnTheWay.includes(index + 1 + '')" class="icon-bus"></i>
          <i v-if="busesOnTheWay.includes(index + 1.5 + '')" class="icon-bus middle"></i>
          <span>{{name}}</span>
        </div>
      </div>
    </section>
  </div>

</template>

<script>
import {getBusTimeInfo} from 'Api';
import storage, {STORAGE_KEYS} from 'Assets/js/storage'
function encodeWatchUniqueKey(query) {
  if(query && typeof query === 'object') {
    return `${query.lineId}_${query.dirId}_${query.stopSeq}`;
  }
  return query;
}
function decodeWatchUniqueKey(key = '') {
  let vals = key.split('_');
  return {
    lineId: vals[0],
    dirId: vals[1],
    stopSeq: vals[2],
  }
} 
export default {
  data() {
    return {
      busInfo: {},
      isWatchOn: false,
      timer: '',
    }
  },
  computed: {
    stopNames() {
      return Object.values(this.busInfo.stopSeqToName || {})
    },
    busesArriving() {
      return this.busInfo.busesArriving || []
    },
    busesOnTheWay() {
      return this.busInfo.busesOnTheWay || []
    },
    watchedUniqueKey() {
      return encodeWatchUniqueKey(this.$router.currentRoute.query)
    }
  },
  beforeRouteEnter (to, from, next) {
    const query = to.query || {};
    getBusTimeInfo(query.lineId, query.dirId, query.stopSeq).then(info => {
      next(vm => {
        vm.isWatchOn = vm.getWatchList().includes(encodeWatchUniqueKey(query))
        vm.busInfo = info;
        vm.startTimer();
      })
    }, err => {
      console.error(err);
      next();
    })
  },
  methods: {
    getQuery() {
      return this.$router.currentRoute.query;
    },
    getWatchList() {
      return storage.get(STORAGE_KEYS.WATCH_LIST) || [];
    },
    updateInfo() {
      let query = this.getQuery();
      query && query.lineId && getBusTimeInfo(query.lineId, query.dirId, query.stopSeq).then(info => {
        this.busInfo = info;
      }, err => {
        console.log(err)
        this.$message(err);
      }).finally(() => {
        this.startTimer()
      })
    },
    startTimer() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.updateInfo()
      }, 30000)
    },
    clearTimer() {
      clearTimeout(this.timer);
    },
    saveWatchList(list, isAdd) {
      storage.save(STORAGE_KEYS.WATCH_LIST, list || []);
      let savedBasicInfo = storage.get(STORAGE_KEYS.WATCHED_ROUTES_BASIC_INFO) || {}
      if(isAdd) {
        savedBasicInfo[this.watchedUniqueKey] = this.getBasicBusInfo()
      } else {
        delete savedBasicInfo[this.watchedUniqueKey]
      }
      storage.save(STORAGE_KEYS.WATCHED_ROUTES_BASIC_INFO, savedBasicInfo);
    },
    getBasicBusInfo() {
      return {
        routeName: this.busInfo.routeName,
        curStopName: this.busInfo.curStopName,
        routeInfo: this.busInfo.routeInfo,
        query: this.getQuery(),
      }
    },
    goBack() {
      this.$router.back();
    },
    refresh() {
      this.clearTimer();
      this.updateInfo();
    },
    makeAttention() {
      let list = this.getWatchList()
      
      if(!list.includes(this.watchedUniqueKey)) {
        list.push(this.watchedUniqueKey)
        this.saveWatchList(list, true);
      }
      
      this.isWatchOn = true;
    },
    cancelAttention() {
      let list = this.getWatchList();
      if(list.includes(this.watchedUniqueKey)) {
        list = list.filter(item => item !== this.watchedUniqueKey);
        this.saveWatchList(list, false);
      }
      this.isWatchOn = false;
    },
  },

  beforeDestroy () {
    this.clearTimer();
  },
}
</script>

<style lang="less" scoped>
@import '../assets/styles/vars.less';
.app-header-bar {
  display: flex;
  justify-content: space-between;
  i {
    font-size: 18px;
    line-height: inherit;
  }
}

section.bus-info {
  padding: 2em;
}
.route-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bus {
  position: relative;
  height: 4em;
  margin-left: 50%;
  &.current {
    span {
      color: @lightPrimaryColor;
      font-weight: bold;
    }
  }
  &:before {
    content: '';
    position: absolute;
    left: -2em;
    top: 0.1em;
    display: block;
    width: 1em;
    height: 1em;
    border: 1px solid #666;
    border-radius: 50%;
    background: #fff;
    z-index: 2;
  }
  & + .bus:after {
    content: '';
    position: absolute;
    left: -1.5em;
    top: calc(-4em + 1px);
    height: 4em;
    width: 2px;
    background: #999;
    z-index: 1;
  }
  .icon-bus {
    position: absolute;
    left: -4em;
    font-size: 20px;
    &.middle {
      top: 1.3em;
    }
    &.active {
      color: @lightPrimaryColor;
    }
  }
}
</style>