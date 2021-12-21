import { getRecordCategoryList } from '@/api/record/recordCategoryManage'
import { getRecordAccounts } from '@/api/record/recordAccountManage'
import { getRecordBooks } from '@/api/record/recordBookManage'
import { EXPEND_TYPE } from '@/store/mutation-types'

const record = {
  state: {
    recordCategoryList: {}, // 记账类别
    recordAccounts: [], // 记账账户列表,
    recordBooks: []
  },

  mutations: {
    SET_RECORD_CATEGORY_LIST: (state, ret) => {
      state.recordCategoryList = ret
    },
    SET_RECORD_ACCOUNTS: (state, list) => {
      state.recordAccounts = list
    },
    SET_RECORD_BOOKS: (state, list) => {
      state.recordBooks = list
    }
  },

  actions: {
    async GetRecordCategoryList ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        if (rootState.record.recordCategoryList[EXPEND_TYPE]) {
          console.log('record 中已有recordCategoryList')
          resolve()
        } else {
          getRecordCategoryList().then(list => {
            const ret = {}
            // 获取结果后分类
            list.forEach((item, index) => {
              if (item.typeValue in ret) {
                ret[item.typeValue].push(item)
              } else {
                ret[item.typeValue] = [item]
              }
            })
            commit('SET_RECORD_CATEGORY_LIST', ret)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    GetRecordAccounts ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        if (rootState.record.recordAccounts.length > 1) {
          console.log('record 中已有recordAccounts')
          resolve()
        } else {
          getRecordAccounts().then(ret => {
            commit('SET_RECORD_ACCOUNTS', ret)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    GetRecordBooks ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        if (rootState.record.recordBooks.length > 1) {
          console.log('record 中已有recordBooks')
          resolve()
        } else {
          getRecordBooks().then(ret => {
            commit('SET_RECORD_BOOKS', ret)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 初始化的一些操作
    ResetRecordCategoryList ({ commit }) {
      commit('SET_RECORD_CATEGORY_LIST', {})
    },
    ResetRecordAccounts ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_RECORD_ACCOUNTS', [])
        resolve()
      })
    },
    ResetRecordBooks ({ commit }) {
      commit('SET_RECORD_BOOKS', [])
    }
  }
}

export default record
