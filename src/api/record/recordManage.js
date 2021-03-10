import request from '@/utils/request'

const api = {
  recordType: '/v1/recordType',
  spendCategory: '/v1/spendCategory/recordTypeId/',
  createRecord: '/v1/record'
}

export default api

export function getRecordTypes () {
  return request({
    url: api.recordType,
    method: 'get'
  })
}

export function getSpendCategory (id) {
  return request({
    url: api.spendCategory + id,
    method: 'get'
  })
}

export function createRecord (data) {
  return request({
    url: api.createRecord,
    method: 'post',
    data: data
  })
}
