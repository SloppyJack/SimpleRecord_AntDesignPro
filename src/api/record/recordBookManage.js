import request from '@/utils/request'

const api = {
  add: '/recordBook',
  del: '/recordBook/',
  edit: '/recordBook/'
}

export default api

export function addRecordBook (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function delRecordBook (id) {
  return request({
    url: api.del + id,
    method: 'delete'
  })
}

export function editRecordBook (id, data) {
  return request({
    url: api.del + id,
    method: 'delete',
    data
  })
}
