import request from '@/utils/request'
import store from '@/store'

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
  store.dispatch('ResetRecordCategoryList')
  return request({
    url: api.reset,
    method: 'put'
  })
}

// 编辑
export function editRecordCategory (id, data) {
  store.dispatch('ResetRecordCategoryList')
  return request({
    url: api.edit + id,
    method: 'put',
    data: data
  })
}

export function addRecordCategory (data) {
  store.dispatch('ResetRecordCategoryList')
  return request({
    url: api.add,
    method: 'post',
    data: data
  })
}

export function delRecordCategory (id) {
  store.dispatch('ResetRecordCategoryList')
  return request({
    url: api.edit + id,
    method: 'delete'
  })
}
