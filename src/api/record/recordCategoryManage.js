import request from '@/utils/request'

const api = {
  getRecordCategoryList: '/recordCategory'
}

export default api

export function getRecordCategoryList () {
  return request({
    url: api.getRecordCategoryList,
    method: 'get'
  })
}
