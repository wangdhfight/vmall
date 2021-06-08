<template>
  <div class="recommend">
    <div v-for="(item, index) in recommends" :key="index" class="recomend-item">
      <a :href="item.link">
        <img :src="item.image" alt="" />
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style>
.recommend {
  display: flex;
  text-align: center;/* 文字对齐样式-中间对齐 */
  font-size: 12px;/* 字体大小 */
  width: 100%;
  padding: 10px 0 10px;/* 内边框大小 */
  border-bottom:10px solid #eee;/* 边框样式 */
}
.recomend-item {
  flex: 1;/* 水平空间均等分 */
}
.recomend-item img {
  width: 100%;
  margin-bottom: 10px;/* 图片与文字之间的距离 */
}
</style>