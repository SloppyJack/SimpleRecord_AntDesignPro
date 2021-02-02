import request from '@/utils/request'

const api = {
  menuTree: '/menu/allTree',
  allMenus: '/menu/all',
  addMenu: '/menu/add',
  delMenu: '/menu/del',
  resetMenu: '/menu/reset',
  editMenu: '/menu/edit'
}

export default api

export function getOwnedMenus (roleId) {
  return request({
    url: api.ownedMenus + '/' + roleId,
    method: 'get'
  })
}

export function getTreeMenus () {
  return request({
    url: api.menuTree,
    method: 'get'
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

export function editMenu (parameter) {
  return request({
    url: api.editMenu,
    method: 'put',
    data: parameter
  })
}
