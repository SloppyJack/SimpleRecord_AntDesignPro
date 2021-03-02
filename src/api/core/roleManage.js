import request from '@/utils/request'

const api = {
  rolePage: '/role/page',
  addRole: '/role/add',
  ownedMenus: 'role/ownedMenus',
  editRole: '/role/edit',
  delRole: '/role/',
  resetRole: '/role/reset/'
}

export default api

export function getRolePage (parameter) {
  return request({
    url: api.rolePage,
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

export function delRole (id) {
  return request({
    url: api.delRole + id,
    method: 'delete'
  })
}

export function resetRole (id) {
  return request({
    url: api.resetRole + id,
    method: 'put'
  })
}
