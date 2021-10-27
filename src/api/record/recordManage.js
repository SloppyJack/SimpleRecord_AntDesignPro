import request from '@/utils/request'

const api = {
  createRecord: '/recordDetail',
  monthList: '/record/listByMonth',
  delRecord: '/record/',
  editRecord: '/record/'
}

export default api

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
