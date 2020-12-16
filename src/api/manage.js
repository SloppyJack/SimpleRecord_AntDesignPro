import request from '@/utils/request'

const api = {
  user: '/user',
  roleList: '/role/list',
  addRole: '/role/add',
  ownedMenus: 'role/ownedMenus',
  editRole: '/role/edit'
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

export function getOwnedMenus (roleId) {
  return request({
    url: api.ownedMenus + '/' + roleId,
    method: 'get'
  })
}

export function editRole (parameter) {
  return request({
    url: api.editRole,
    method: 'put',
    data: parameter
  })
}
