import request from '@/utils/request'

const api = {
  spendCategoryTotalInYear: '/analysis/spendCategoryTotal/',
  LatestSixMonthList: '/analysis/latestSixMonthList'
}

export default api

export function getSpendCategoryTotalInYear (year, recordType) {
  return request({
    url: api.spendCategoryTotalInYear + year + '/' + recordType,
    method: 'get'
  })
}

export function getLatestSixMonthList (data) {
  return request({
    url: api.LatestSixMonthList,
    method: 'post',
    data: data
  })
}
