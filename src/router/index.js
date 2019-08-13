import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import User from '@/components/User.vue'
import Right from '@/components/right/Right.vue'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
const router = new Router({
  routes: [
    // 是component
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'user',
          component: User
        },
        {
          path: 'right/Right',
          component: Right
        }
      ]
    }
  ]
})
// 登陆拦截，导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
