<template>
  <van-tabbar v-model="active" class="van-tabbar" route active-color="#FF0000" z-index="100">
    <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="search" to="/category">分类</van-tabbar-item>
    <van-tabbar-item icon="cart-o" to="/cart" badge="$store.state.">购物车</van-tabbar-item>
    <van-tabbar-item icon="setting-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
/* 底部标签栏 */
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style scoped>
.van-tabbar {
  border-top: 1px solid #cccccc;
  background-color: #f6f6f6;
}
.van-tabbar-item {
  font-size: 14px;
}

.van-tabbar-item__icon {
  font-size: 22px;
}
</style>
