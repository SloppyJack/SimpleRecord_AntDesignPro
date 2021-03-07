import storage from 'store'
import { login, getRoleMenus } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    userInfo: {
      id: '',
      username: '',
      nickname: '',
      email: '',
      sex: '',
      avatarUrl: ''
    },
    roles: [],
    menus: {}
  },

  mutations: {
    SET_USERINFO: (state, userInfo) => {
      state.userInfo.id = userInfo.id
      state.userInfo.username = userInfo.username
      state.userInfo.nickname = userInfo.nickname
      state.userInfo.email = userInfo.email
      state.userInfo.sex = userInfo.sex
      state.userInfo.avatarUrl = userInfo.avatarUrl
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(result => {
          storage.set(ACCESS_TOKEN, result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户菜单
    GetRoleMenus ({ commit }) {
      return new Promise((resolve, reject) => {
        getRoleMenus().then(ret => {
          // 如成功获取角色及菜单
          if (ret.roles.length > 0 && ret.menus.length > 0) {
            commit('SET_ROLES', ret.roles)
            commit('SET_MENUS', ret.menus)
            commit('SET_USERINFO', ret.user)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          resolve(ret.menus)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
