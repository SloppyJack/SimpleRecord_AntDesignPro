import request from '@/utils/request'

const api = {
  user: '/user',
  roleList: '/role/list',
  addRole: '/role/add',
  ownedMenus: 'role/ownedMenus',
  editRole: '/role/edit',
  menuTree: '/menu/tree',
  allMenus: '/menu/all',
  addMenu: '/menu/add',
  delMenu: '/menu/del',
  resetMenu: '/menu/reset'
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

export function getTreeMenus (parameter) {
  return request({
    url: api.menuTree,
    method: 'post',
    data: parameter
  })
}

export function getAllMenus () {
  return request({
    url: api.allMenus,
    method: 'get'
  })
}

export function addMenu (parameter) {
  return request({
    url: api.addMenu,
    method: 'post',
    data: parameter
  })
}

export function delMenu (id) {
  return request({
    url: api.delMenu + '/' + id,
    method: 'get'
  })
}

export function resetMenu (id) {
  return request({
    url: api.resetMenu + '/' + id,
    method: 'get'
  })
}
