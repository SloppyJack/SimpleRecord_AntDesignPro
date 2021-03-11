import request from '@/utils/request'

const api = {
  recordType: '/v1/recordType',
  createRecord: '/v1/record',
  monthList: '/v1/record/listByMonth',
  delRecord: '/v1/record/',
  editRecord: '/v1/record/'
}

export default api

export function getRecordTypes () {
  return request({
    url: api.recordType,
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

export function getMonthList (params) {
  return request({
    url: api.monthList,
    method: 'post',
    data: params
  })
}

export function delRecord (id) {
  return request({
    url: api.delRecord + id,
    method: 'delete'
  })
}

export function editRecord (id, params) {
  return request({
    url: api.editRecord + id,
    method: 'put',
    data: params
  })
}
