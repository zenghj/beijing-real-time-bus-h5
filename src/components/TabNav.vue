<template>
  <div class="nav-wrapper">
    <ul class="nav-tabs">
      <li ><router-link :class="['tab', isActiveTab('Home') ? 'active' : '']" :to="{name: 'Home'}"><i class="icon-home"></i><span>首页</span></router-link></li>
      <li ><router-link :class="['tab', isActiveTab('MyWatchList') ? 'active' : '']" :to="{name: 'MyWatchList'}"><i class="icon-user"></i><span>我的关注</span></router-link></li>
    </ul>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      isActiveTab(tabName) {
        return this.$router.currentRoute.name === tabName;
      }
    }
  }
</script>
<style lang="less" scoped>
@import "../assets/styles/vars.less";
.nav-wrapper {
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #ccc;
  height: 10vh;
  padding: 0 2em;
}
.nav-tabs {
  display: flex;
  justify-content: space-between;
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #333;
    background: #fff;
    &:active {
      background: inherit;
    }
    &.active {
      color: @primaryColor;
    }
    i {
      font-size: 16px;
    }
    span {
      font-size: 12px;
    }
  }
}

</style>