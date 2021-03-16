import request from '@/utils/request'

const api = {
  spendTotalInMonth: '/home/spendTotalInMonth/',
  topThreeSpendCategoryTotal: '/home/topThreeSpendCategoryTotal/'
}

export function getSpendTotalInMonth (date) {
  return request({
    url: api.spendTotalInMonth + date,
    method: 'get'
  })
}

export function getTopThreeSpendCategoryTotal (date) {
  return request({
    url: api.topThreeSpendCategoryTotal + date,
    method: 'get'
  })
}
