import request from '@/utils/request'

const api = {
  getRecordCategoryList: '/recordCategory',
  getByPage: '/recordCategory/page',
  reset: '/recordCategory/reset',
  edit: '/recordCategory/',
  add: '/recordCategory',
  del: '/recordCategory/'
}

export default api

export function getRecordCategoryList () {
  return request({
    url: api.getRecordCategoryList,
    method: 'get'
  })
}

export function getRecordCategoryByPage (data) {
  return request({
    url: api.getByPage,
    method: 'post',
    data: data
  })
}

/**
 * 初始化类别
 */
export function resetRecordCategory () {
  return request({
    url: api.reset,
    method: 'put'
  })
}

// 编辑
export function editRecordCategory (id, data) {
  return request({
    url: api.edit + id,
    method: 'put',
    data: data
  })
}

export function addRecordCategory (data) {
  return request({
    url: api.add,
    method: 'post',
    data: data
  })
}

export function delRecordCategory (id) {
  return request({
    url: api.edit + id,
    method: 'delete'
  })
}
