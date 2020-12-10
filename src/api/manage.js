import request from '@/utils/request'

const api = {
  user: '/user',
  roleList: '/role/list',
  addRole: '/role/add'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.roleList,
    method: 'post',
    data: parameter
  })
}

export function addRole (parameter) {
  return request({
    url: api.addRole,
    method: 'post',
    data: parameter
  })
}
