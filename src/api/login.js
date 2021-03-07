import request from '@/utils/request'

const userApi = {
  Login: '/user/login',
  // get my info
  RoleMenus: '/user/roleMenus'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: ''
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}
export function getRoleMenus () {
  return request({
    url: userApi.RoleMenus,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
