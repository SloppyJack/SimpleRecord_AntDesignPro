import request from '@/utils/request'

const api = {
  getDictByPage: '/dict/page',
  addDict: '/dict/add',
  editDict: '/dict/edit',
  delDict: '/dict/',
  getDictItemByPage: '/dict/dictItem/page',
  resetDict: '/dict/reset/',
  addDictItem: '/dictItem/add',
  editDictItem: '/dictItem/edit',
  delDictItem: '/dictItem/'
}

/**
 * 查询系统字典值
 */
export function getDictByPage (parameter) {
  return request({
    url: api.getDictByPage,
    method: 'post',
    data: parameter
  })
}

/**
 * 添加系统字典值
 */
export function addDict (parameter) {
  return request({
    url: api.addDict,
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑系统字典值
 */
export function editDict (parameter) {
  return request({
    url: api.editDict,
    method: 'put',
    data: parameter
  })
}

/**
 * 删除系统字典值
 */
export function delDict (id) {
  return request({
    url: api.delDict + id,
    method: 'delete'
  })
}

/**
 * 获取字典项
 */
export function getDictItemByPage (parameter) {
  return request({
    url: api.getDictItemByPage,
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑系统字典值
 */
export function resetDict (id) {
  return request({
    url: api.resetDict + id,
    method: 'put'
  })
}

/**
 * 添加字典项
 */
export function addDictItem (parameter) {
  return request({
    url: api.addDictItem,
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑系统字典项
 */
export function editDictItem (parameter) {
  return request({
    url: api.editDictItem,
    method: 'put',
    data: parameter
  })
}

/**
 * 删除系统字典项
 */
export function delDictItem (id) {
  return request({
    url: api.delDictItem + id,
    method: 'delete'
  })
}
