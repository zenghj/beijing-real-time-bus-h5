<template>
  <section class="home-page">
    <div class="header app-header-bar">
      北京实时公交
    </div>
    <div class="body">
      <div class="form">
        <v-select class="margin1em" v-model="lineId" label="name" :filterable="false" :options="busLines" @search="onSearch">
        </v-select>

        <v-select class="margin1em" label="text" v-model="dir" :options="dirs"></v-select>
        <v-select class="margin1em" label="text" v-model="station" :options="stations"></v-select>
        <v-button type="primary" class="margin1em" v-on:click="handleClickQuery">查询公交信息</v-button>
      </div>
    </div>
    <v-tab-nav></v-tab-nav>
  </section>
</template>

<script>
import debounce from 'debounce'
import axios from 'axios'
import {getBusLines, getBusDirList, getBusDirStationList} from '../api'

  export default {
    data() {
      return {
        busLines: [],
        lineId: '',
        
        dirs: [],
        dir: {},

        stations: [],
        station: {},

      }
    },
    computed: {
      dirId() {
        return this.dir && this.dir.id;
      },
      stopSeq() {
        return this.station.seq;
      }
    },
    created() {
      getBusLines().then(list => {
        this.busLines = list;
      })
    },
    watch: {
      lineId: function(newVal) {
        // TODO 加防抖
        this.dirs = [];
        getBusDirList(newVal).then(dirs => {
          this.dirs = dirs;
        })
      },
      dirId: function(newVal) {
        this.stations = [];
        getBusDirStationList(this.lineId, newVal).then(stations => {
          this.stations = stations;
        })
      }
    },
    methods: {
      onSearch(wordStr, loading) {
        loading(true);
        this.search(wordStr, loading, this);
      },
      search: debounce(function(wordStr, loading, vm) {
        getBusLines(wordStr).then(list => {
          vm.busLines = list|| [];
          loading(false);
        }).catch(err => {
          console.error(err);
          loading(false);
        })
      }, 350),

      handleClickQuery() {
        if(!this.lineId) {
          return this.$message('线路不能为空')
        }
        if(!this.dirId) {
          return this.$message('线路方向不能为空')
        }
        if(!this.station) {
          return this.$message('上车站点不能为空')
        }
        this.$router.push({
          name: 'BusInfo',
          query: {
            lineId: this.lineId,
            dirId: this.dirId,
            stopSeq: this.stopSeq,
          }
        })
      }

    }
  }
</script>
<style lang="less" scoped>
@import '../assets/styles/vars.less';

.body {
  .form {
    padding: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .margin1em {
      margin: 1em 0;
    }
  }
  input {
    border: 1px solid;
    height: 2em;
  }
}
</style>