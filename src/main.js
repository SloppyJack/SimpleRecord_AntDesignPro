// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

// 刷新保存状态
// if (sessionStorage.getItem('store')) {
//   store.replaceState(
//     Object.assign(
//       {},
//       store.state,
//       JSON.parse(sessionStorage.getItem('store'))
//     )
//   )
//   sessionStorage.removeItem('store')
// }
//
// // 监听，在页面刷新时将vuex里的信息保存到sessionStorage里
// window.addEventListener('beforeunload', () => {
//   sessionStorage.setItem('store', JSON.stringify(store.state))
// })

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
