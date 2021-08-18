import request from '@/utils/request'

const api = {
  getDictByPage: '/dict/page',
  add: '/dict/add',
  edit: '/dict/edit',
  del: '/dict/',
  getDictItemByPage: '/dict/dictItem/page',
  resetDict: '/dict/reset/'
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
    url: api.add,
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑系统字典值
 */
export function editDict (parameter) {
  return request({
    url: api.edit,
    method: 'put',
    data: parameter
  })
}

/**
 * 删除系统字典值
 */
export function delDict (id) {
  return request({
    url: api.del + id,
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
