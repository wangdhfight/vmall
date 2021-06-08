/* 全局引入Vue,App */
import Vue from 'vue'
import App from './App'
/* 全局导入vant */
import Vant from 'vant';
import 'vant/lib/index.css';
/* 全局引入基本样式 */
import "assets/css/base.css";
/* 全局导入路由 */
import router from './router';
/* 全局导入vuex */
import store from './store';

Vue.use(Vant)
Vue.prototype.$bus = new Vue()
new Vue({
  el:'#app',
  router,
  store,
  render: h => h(App)
})
