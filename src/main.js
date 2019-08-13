// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
// 配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 每次请求之前执行即请求拦截器
axios.interceptors.request.use(function(config) {
  if (!config.url.endsWith('/login')) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  return config
})

// 每次响应之后执行即响应拦截器
axios.interceptors.response.use(function(response) {
  const { meta } = response.data
  // 如果无效token，跳转登录页
  if (meta.status === 401) {
    router.push('/login')
    localStorage.removeItem('token')
  }
  return response
})

// 为了不再个个组件导入axios  交给vue原型
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
