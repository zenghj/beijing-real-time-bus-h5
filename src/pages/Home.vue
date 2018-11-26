<template>
  <section class="home-page">
    <div class="header app-header-bar">北京实时公交</div>
    <div class="body">
      <div class="form">
        <v-select
          class="margin1em"
          filterable
          :loading="linesLoading"
          placeholder="请选择公交线路"
          v-model="lineId"
        >
          <v-select-option
            v-for="(line, index) in busLines"
            :key="index"
            :label="line"
            :value="line"
          ></v-select-option>
        </v-select>
        <v-select
          class="margin1em"
          :loading="dirsLoading"
          placeholder="请选择路线方向"
          v-model="dirId"
          :disabled="dirSelectDisabled"
        >
          <v-select-option
            v-for="(item, index) in dirs"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></v-select-option>
        </v-select>
        <v-select
          class="margin1em"
          :loading="stationsLoading"
          placeholder="请选择上车站点"
          v-model="stopSeq"
          :disabled="stationSelectDiabled"
        >
          <v-select-option
            v-for="(item, index) in stations"
            :key="index"
            :label="item.text"
            :value="item.seq"
          ></v-select-option>
        </v-select>
        <!-- <v-select class="margin1em" label="text" v-model="dir" :options="dirs"></v-select> -->
        <!-- <v-select class="margin1em" label="text" v-model="station" :options="stations"></v-select> -->
        <v-button type="primary" class="margin1em" v-on:click="handleClickQuery">查询公交信息</v-button>
      </div>
    </div>
    <v-tab-nav></v-tab-nav>
  </section>
</template>

<script>
import axios from 'axios'
import {getBusLines, getBusDirList, getBusDirStationList} from '../api'
// import {MySelect, SelectOption} from 'Components'
// let t = 0
  export default {
    data() {
      return {
        busLines: [],
        lineId: '',
        
        dirs: [],
        dirId: '',

        stations: [],
        stopSeq: '',

        linesLoading: true,
        dirsLoading: true,
        stationsLoading: true,
      }
    },
    // beforeCreate() {
    //   console.time('home')
    //   t = Date.now()
    // },
    created() {
      getBusLines().then(list => {
        this.$nextTick(() => { // TODO 长列表渲染的问题
          this.busLines = list || [];
          this.linesLoading = false;
        })
      })
    },
    // mounted() {
    //   console.timeEnd('home')
    //   alert(Date.now() - t)
    // },
    watch: {
      lineId: function(newVal) {
        // TODO 加防抖
        this.resetSelectedDirs();
        this.resetSelectedStations();
        if(newVal) {
          getBusDirList(newVal).then(dirs => {
            this.dirs = dirs;
          }).finally(() => {
            this.dirsLoading = false;
          })
        }
      },
      dirId: function(newVal) {
        this.resetSelectedStations();
        if(newVal) {
          getBusDirStationList(this.lineId, newVal).then(stations => {
            this.stations = stations;
          }).finally(() => {
            this.stationsLoading = false;
          })
        }
        
      }
    },
    computed: {
      dirSelectDisabled() {
        return !this.lineId;
      },
      stationSelectDiabled() {
        return !this.lineId || !this.dirId;
      }
    },
    methods: {
      handleClickQuery() {
        if(!this.lineId) {
          return this.$message('线路不能为空')
        }
        if(!this.dirId) {
          return this.$message('线路方向不能为空')
        }
        if(!this.stopSeq) {
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
      },
      resetSelectedDirs() {
        this.dirs = [];
        this.dirsLoading = true;
        this.dirId = '';
      },
      resetSelectedStations() {
        this.stations = [];
        this.stationsLoading = true;
        this.stopSeq = '';
      },
    },
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
      &:first-child {
        margin-top: 0;
      }
    }
  }
  input {
    border: 1px solid;
    height: 2em;
  }
}
</style>