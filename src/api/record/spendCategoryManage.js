import request from '@/utils/request'

const api = {
  spendCategory: '/v1/spendCategory/recordTypeId/',
  getSpendCategoryList: '/v1/spendCategory'
}

export default api

export function getSpendCategory (id) {
  return request({
    url: api.spendCategory + id,
    method: 'get'
  })
}

export function getSpendCategoryList () {
  return request({
    url: api.getSpendCategoryList,
    method: 'get'
  })
}
