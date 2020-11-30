import storage from 'store'
import { login, getRoleMenus } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    userInfo: {
      id: '',
      name: '',
      nike: '',
      token: '',
      email: '',
      sex: '',
      avatarUrl: '',
      openId: ''
    },
    roles: [],
    menus: {}
  },

  mutations: {
    SET_USERINFO: (state, userInfo) => {
      state.userInfo.id = userInfo.id
      state.userInfo.name = userInfo.name
      state.userInfo.nike = userInfo.nike
      state.userInfo.email = userInfo.email
      state.userInfo.sex = userInfo.sex
      state.userInfo.avatarUrl = userInfo.avatarUrl
      state.userInfo.openId = userInfo.openId
      state.userInfo.token = userInfo.token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(result => {
          storage.set(ACCESS_TOKEN, result.token)
          commit('SET_USERINFO', result)
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
          console.log(ret)
          if (ret.roles && ret.menus.length > 0) {
            // const role = result.role
            // role.permissions = result.role.permissions
            // role.permissions.map(per => {
            //   if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            //     const action = per.actionEntitySet.map(action => { return action.action })
            //     per.actionList = action
            //   }
            // })
            // role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', ret.roles)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          resolve(ret)
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
