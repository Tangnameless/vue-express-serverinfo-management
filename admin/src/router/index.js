import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'

import ServerEdit from '../views/ServerEdit.vue'
import ServerList from '../views/ServerList.vue'
import ServerSearch from '../views/ServerSearch.vue'


import VmEdit from '../views/VmEdit.vue'
import VmList from '../views/VmList.vue'
import VmSearch from '../views/VmSearch.vue'

import AdminUserEdit from '../views/AdminUserEdit.vue'
import AdminUserList from '../views/AdminUserList.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/login', name:"login", component: Login, meta:{isPublic: true}}, // 目前只有login页面可以不登陆而访问

  {
    path: '/',
    name: 'main',
    component: Main,
    children:[
      // 服务器相关路由
      {path: '/servers/create', component: ServerEdit},
      {path: '/servers/edit/:id', component: ServerEdit, props:true},
      {path: '/servers/list', component: ServerList},
      {path: '/servers/search', component: ServerSearch},


      // 虚拟机相关路由
      {path: '/vms/create', component: VmEdit},
      {path: '/vms/edit/:id', component: VmEdit, props:true},
      {path: '/vms/list', component: VmList},
      {path: '/vms/search', component: VmSearch},

      // 管理员相关路由
      {path: '/admin_users/create', component: AdminUserEdit},
      {path: '/admin_users/edit/:id', component: AdminUserEdit, props:true},
      {path: '/admin_users/list', component: AdminUserList},
    ]
  },
  
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
// 每个守卫方法接收三个参数：
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
//  next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
router.beforeEach((to, from, next) =>{
  if(!to.meta.isPublic && !localStorage.token){
    console.log('试图访问一个非公开的页面，请先登录！')
    return next('/login');
  }
  next()
})


export default router

