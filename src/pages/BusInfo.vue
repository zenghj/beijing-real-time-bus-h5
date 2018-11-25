<template>
  <div class="bus-info-container">
    <div class="header-wrapper">
      <header class="app-header-bar">
        <i class="icon-arrow-left" @click="goBack"></i>
        <i class="icon-refresh" @click="refresh"></i>
      </header>
      <v-progress-bar class="progress-bar" :loading="isProgressBarVisible"></v-progress-bar>
    </div>
    <section v-if="pageInited" class="bus-info">
      <div class="route-info">
        <div>
          <p>{{busInfo.routeName}} {{busInfo.routeInfo}}</p>
          <p>上车站点: {{busInfo.curStopName}}</p>
          <p>{{busInfo.busRunTime}}</p>
        </div>
        <v-button class="btn" v-if="isWatchOn" size="mini" @click="cancelAttention">取消关注</v-button>
        <v-button class="btn" type="primary" v-else size="mini" @click="makeAttention">关注</v-button>
      </div>
      <p class="desc2">{{busInfo.desc2}}</p>
      <div class="buses">
        <div class="icons-desc">
          <p>
            <i class="icon-bus active"></i>&nbsp;到站车辆
          </p>
          <p>
            <i class="icon-bus"></i>&nbsp;途中车辆
          </p>
        </div>
        <div
          v-for="(name, index) in stopNames"
          :class="['bus', (busInfo.curStopSeq === index + 1 + '') ? 'current' : '']"
          :key="index"
        >
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
      isProgressBarVisible: true,
      pageInited: false,
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
  // beforeRouteEnter (to, from, next) {
  //   const query = to.query || {};
  //   getBusTimeInfo(query.lineId, query.dirId, query.stopSeq).then(info => {
  //     next(vm => {
  //       vm.isWatchOn = vm.getWatchList().includes(encodeWatchUniqueKey(query))
  //       vm.busInfo = info;
  //       vm.startTimer();
  //     })
  //   }, err => {
  //     console.error(err);
  //     next();
  //   })
  // },
  created() {
      let query = this.getQuery();
      this.isWatchOn = this.getWatchList().includes(encodeWatchUniqueKey(query));
      this.updateInfo().then(() => {
        this.pageInited = true;
      }).finally(() => {
        this.isProgressBarVisible = false;
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
      return getBusTimeInfo(query.lineId, query.dirId, query.stopSeq).then(info => {
        this.busInfo = info;
      }, err => {
        this.$message(typeof err.msg === 'string' ? err.msg : '请求失败');
        throw err;
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
      if(window.history.length > 1) {
        this.$router.back()
      } else {
        this.$router.push('/')
      }
    },
    withProgress(promise) {
      this.isProgressBarVisible = true;
      promise.finally(() => {
        this.isProgressBarVisible = false;
      })
    },
    refresh() {
      this.clearTimer();
      this.withProgress(this.updateInfo().then(() => {
        this.$message('更新成功');
      }));
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

.header-wrapper {
  position: relative;
  .progress-bar {
    position: absolute;
    left: 0;
    bottom: -@progressBarHeight;
  }
}
.bus-info-container .btn {
  width: 6em;
  text-align: center;
  padding: 0.5em 0;
}
.app-header-bar {
  display: flex;
  justify-content: space-between;
  i {
    font-size: 18px;
    line-height: inherit;
    &.icon-refresh {
      padding: 0 1em;
      margin-right: -1em;
    }
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
.desc2 {
  margin-top: 0;
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
    // z-index: 2;
  }
  & + .bus:after {
    content: '';
    position: absolute;
    left: -1.5em;
    top: calc(-4em + 1px);
    height: 4em;
    width: 2px;
    background: #999;
    z-index: -1;
  }
}
.buses {
  position: relative;
}
.icons-desc {
  position: absolute;
  p {
    margin: 0.5em 0;
  }
  .icon-bus {
    vertical-align: text-bottom;
  }
}
.bus .icon-bus {
  position: absolute;
  left: -3em;

  &.middle {
    top: 1.3em;
  }
}
.icon-bus {
  font-size: 20px;
  &.active {
    color: @lightPrimaryColor;
  }
}
</style>