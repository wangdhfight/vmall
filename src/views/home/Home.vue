<template ontouchstart>
  <div id="home">
    <!-- 导航栏 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- BSscroll滚动区域 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="LoadMore"
    >
      <!-- 轮播图 -->
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <!-- 推荐分类 -->
      <recommend-view :recommends="recommends"></recommend-view>
      <!-- 本周流行 -->
      <feature-view></feature-view>
      <!-- 控制栏 -->
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl"
        :class="{ fixed: isTabFixed }"
      ></tab-control>
      <!-- 商品列表展示 -->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- .native原生监听-主要是给自定义的组件添加原生事件，组件不能监听事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
/* 公共组件导入 */
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabcontrol/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import backTop from "components/content/backtop/backTop";
/* 业务组件导入 */
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
/* 网络请求导入 */
import { getHomeMultidata, getHomeGoods } from "network/home.js";
import { imgListenerMixin , backTopMixin} from "common/mixin"
export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    backTop,
  },
  data() {
    return {
      banners: [] /* 轮播图数据 */,
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      itemImgListener:null
    };
  },
  mixins: [ imgListenerMixin  , backTopMixin ],
  computed: {
    showGoods() {
      /* 实现点击tabcontrol，切换不同显示 */
      return this.goods[this.currentType].list;
    },
  },

  methods: {
    /* 事件监听相关的方法 */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
    },
    /* 返回顶部的方法 */
    backClick() {
      /* 1.scroll通过ref父访问子组件  2.scroll属性  3.调用scrollTo的方法 */
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    /* 监听内容发生滚动 */
    contentScroll(position) {
      /* backtop组件显示与否 */
      this.isShowBackTop = Math.abs(position.y) > 1000;
      /* 决定tabcontrol是否吸顶 */
      this.isTabFixed = Math.abs(position.y) > this.tabOffsetTop;
    },
    /* 上拉加载更多 */
    LoadMore() {
      this.getHomeGoods(this.currentType); /* 获取更多数据 */
      this.$refs.scroll.scroll.refresh(); /* 解决图片加载缓慢的bug */
    },
    /* 根据轮播图加载完成获得吸顶距离值 */
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },
    /* 网络请求相关的方法 */
    /* 请求首页轮播图数据，推荐数据，流行数据 */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      /* 当前类型数据翻页 */
      const page = this.goods[type].page + 1;
      /* 调用网络请求，请求更多数据 */
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        /*  */
        this.$refs.scroll.finishPullUp();
      });
    },
  },



  created() {
    /* 1.请求首页轮播图数据 思路先将数据请求过来，在用数组变量接收数据 */
    this.getHomeMultidata();
    /* 2.请求商品数据 */
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    //2.获取tabControl的offsetTop
    //图片还未加载完全
    /*     console.log(this.$refs.tabControl.$el.offsetTop)
    this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop */
  },
  /* 返回首页时，保持在进入的页面 */
  activated() {
    this.$refs.scroll.refresh();/* 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。例：scroll.refresh() */
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  deactivated() {
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();
    // 2.取消全局事件的监听
    
    this.$bus.$off('itemImgLoad', )
  },
};
</script>
<style scoped>
#home {
  position: relative;
  height: 100vh;
}
.home-nav {
  background: var(--color-high-text);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
/* betterscroll */
.content {
  position: absolute;
  top: 44px;
  right: 0;
  bottom: 50px;
  left: 0;
  overflow: hidden;
}
.fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}
.tab-control {
  position: relative;
  z-index: 9;
}
</style>