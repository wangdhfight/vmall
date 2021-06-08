<template>
  <div id="detail">
    <detail-nav-bar
      class="detailnavbar"
      @titleClick="titleClick"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imgLoad="imgLoad"
      ></detail-goods-info>
      <detail-param-info
        :param-info="paramInfo"
        ref="param"
      ></detail-param-info>
      <detail-comment-info ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
  </div>
</template>

<script>
/* 公共组件 */
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import GoodsList from "components/content/goods/GoodsList";
import DetailBottomBar from "./childComps/DetailBottomBar";
import Scroll from "components/common/scroll/Scroll";
import backTop from "components/content/backtop/backTop";
import { imgListenerMixin, backTopMixin } from "common/mixin";
/* 网络请求 */
import {
  getDetail,
  Goods,
  Shop,
  GoodsParams,
  getRecommend,
} from "network/detail.js";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
    backTop,
  },
  mixins: [imgListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [0, 1000, 2000, 3000],
      currentIndex: 0,
      isShowBackTop: false,
    };
  },
  created() {
    /* 保存传入的iid */
    this.iid = this.$route.params.iid;
    /* 1.根据iid请求详情数据 */
    getDetail(this.iid).then((res) => {
      const data = res.result;
      /* 2.获取顶部轮播图数据 */
      this.topImages = data.itemInfo.topImages;
      /* 3.获得商品信息 */
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      console.log(this.goods);
      /* 4.创建店铺信息的对象 */
      this.shop = new Shop(data.shopInfo);
      /* 5.保存商品的详情数据 */
      this.detailInfo = data.detailInfo;
      /* 6.获得参数信息 */
      this.paramInfo = new GoodsParams(
        data.itemParams.info,
        data.itemParams.rule
      );
      /* 7.取出评论信息 */
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
      this.$nextTick(() => {});
    });
    /* 请求推荐数据 */
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
  },
  mounted() {console.log(this.$props.match)},
  updated() {},
  methods: {
    imgLoad() {
      this.$refs.scroll.refresh();
      this.themeTopYs = [];

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      const positionY = -position.y;
      let length = this.themeTopYs.length;
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          this.currentIndex = i;
        }
      }
      this.isShowBackTop = Math.abs(position.y) > 1000;
    },
    backClick() {
      /* 1.scroll通过ref父访问子组件  2.scroll属性  3.调用scrollTo的方法 */
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    addCart() {
      /* 用vuex监听product对象 */
      //1.获取购物车需要的展示信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.newPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车里
      /* this.$store.commit("addCart", product); */
      this.$store.dispatch("addCart", product);
    },
  },
};
</script>

<style scoped>
#detail {
  height: 100vh;
  background-color: #fff;

  position: relative;
  z-index: 1;
}

.content {
  background-color: #fff;
  height: calc(100% - 44px);
}

.detailnavbar {
  position: relative;
  z-index: 1;
  background-color: #fff;
}
</style>