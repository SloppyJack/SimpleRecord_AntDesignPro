import request from '@/utils/request'

const api = {
  getSpendCategoryList: '/spendCategory'
}

export default api

export function getSpendCategoryList () {
  return request({
    url: api.getSpendCategoryList,
    method: 'get'
  })
}
