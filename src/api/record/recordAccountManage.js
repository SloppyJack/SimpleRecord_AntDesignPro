import request from '@/utils/request'

const api = {
  add: '/recordAccount',
  getList: '/recordAccount',
  edit: '/recordAccount/',
  del: '/recordAccount/',
  getStatistics: '/recordAccount/statistics'
}

export default api

export function addRecordAccount (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

/**
 * 获取资产账户列表
 */
export function getRecordAccounts () {
  return request({
    url: api.getList,
    method: 'get'
  })
}

export function editRecordAccount (id, data) {
  return request({
    url: api.edit + id,
    method: 'put',
    data
  })
}

export function delRecordAccount (id) {
  return request({
    url: api.del + id,
    method: 'delete'
  })
}

/**
 * 获取资产账户统计
 */
export function getRecordAccountStatistics () {
  return request({
    url: api.getStatistics,
    method: 'get'
  })
}
