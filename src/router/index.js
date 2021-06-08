/* 引入路由 */
import Vue from 'vue'
import VueRouter from 'vue-router'
/* 安装VueRouter插件 */
Vue.use(VueRouter)
/* 路由懒加载 */
const Cart = () => import('views/cart/Cart')
const Category = () => import('views/category/Category')
const Home = () => import('views/home/Home')
const Profile = () => import('views/profile/Profile')
const Detail = () => import('views/detail/Detail')
/* 配置路由映射关系 */
const routes = [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    meta:{
      title:'首页'
    },
    component: Home,
  },
  {
    path: '/cart',
    component: Cart,
  },
  {
    path: '/category',
    component: Category,
  },
  {
    path: '/profile',
    component: Profile,
  },{
    path:'/detail/:iid',
    component:Detail
  }
]
/* 创建路由对象 */
const router = new VueRouter({
  routes,
  mode: 'history'
})
/* 全局导航守卫 */
router.beforeEach((to,from,next)=>{
  document.title = to.meta.title
  next('/profile')
})
router.afterEach((to,from)=>{

})
export default router