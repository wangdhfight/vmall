<template>
  <div id="app">
    <!-- keep-alive 以使被包含的组件保留状态，或避免重新渲染
    include - 字符串或正则表达，只有匹配的组件会被缓存
    exclude - 字符串或正则表达式，任何匹配的组件都不会被缓存 -->
    <keep-alive exclude="Detail"><!-- 每次由路由跳转，进入Detail页面时，要求每次刷新，故排除Detail -->
      <router-view></router-view>
    </keep-alive>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import TabBar from "components/common/tabbar/TabBar";

export default {
  name: "App",
  components: {
    TabBar,
  },
};
</script>

<style>
</style>
