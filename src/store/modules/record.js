import { getRecordCategoryList } from '@/api/record/recordCategoryManage'
import { getRecordAccounts } from '@/api/record/recordAccountManage'
import { getRecordBooks } from '@/api/record/recordBookManage'

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
    async GetRecordCategoryList ({ commit }) {
      return new Promise((resolve, reject) => {
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
      })
    },
    GetRecordAccounts ({ commit }) {
      return new Promise((resolve, reject) => {
        getRecordAccounts().then(ret => {
          commit('SET_RECORD_ACCOUNTS', ret)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetRecordBooks ({ commit }) {
      return new Promise((resolve, reject) => {
        getRecordBooks().then(ret => {
          commit('SET_RECORD_BOOKS', ret)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default record
