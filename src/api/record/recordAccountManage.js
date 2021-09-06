import request from '@/utils/request'

const api = {
  addRecordAccount: '/recordAccount',
  getList: '/recordAccount/list'
}

export default api

export function addRecordAccount (data) {
  return request({
    url: api.addRecordAccount,
    method: 'post',
    data
  })
}

/**
 * 获取字典项
 */
export function getRecordAccounts () {
  return request({
    url: api.getList,
    method: 'get'
  })
}
