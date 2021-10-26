import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import dict from './modules/dict'
import record from './modules/record'

// 动态路由
import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    dict,
    record
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
