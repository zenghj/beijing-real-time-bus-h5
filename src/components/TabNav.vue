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
  display: flex;
  align-items: center;
  width: 100%;
  height: @bottomNavHeight;
  padding: 0 1.5em;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: @bottomTabZindex;
  // &:before {
  //   content: '';
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   height: 1px;
  //   width: 100%;
  //   background: @lightestGray;
  //   transform: scaleY(0.5);
  //   transform-origin: 50% 100%;
  // }
}
.nav-tabs {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .5em;
    text-decoration: none;
    color: #333;
    background: #fff;
    &:active, &:link, &:hover, &:visited {
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