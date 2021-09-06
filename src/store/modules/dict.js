import { getDictItems } from '@/api/core/dictManage'

const dict = {
  state: {
    accountType: [],
    recordType: []
  },

  mutations: {
    SET_LIST: (state, info) => {
      state[info.code] = info.list
    }
  },

  actions: {
    GetDictItems ({ commit }, code) {
      return new Promise((resolve, reject) => {
        getDictItems(code).then(ret => {
          commit('SET_LIST', { code, list: ret })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default dict
