import request from '@/utils/request'

const api = {
  addRecordDetail: '/recordDetail',
  monthBookList: '/recordDetail/monthBookList',
  delRecord: '/recordDetail/',
  editRecord: '/recordDetail/',
  recoverableList: '/recordDetail/recoverable',
  recoverRecords: '/recordDetail/recover'
}

export default api

export function addRecordDetail (data) {
  return request({
    url: api.addRecordDetail,
    method: 'post',
    data: data
  })
}

export function getMonthBookList (params) {
  return request({
    url: api.monthBookList,
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

export function getRecoverableList (params) {
  return request({
    url: api.recoverableList,
    method: 'post',
    data: params
  })
}

export function recoverRecords (arr) {
  return request({
    url: api.recoverRecords,
    method: 'put',
    data: arr
  })
}
