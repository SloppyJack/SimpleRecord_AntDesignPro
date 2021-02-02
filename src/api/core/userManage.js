import request from '@/utils/request'

const api = {
  userByPage: '/user/page'
}

export default api

export function getUserByPage (parameter) {
  return request({
    url: api.userByPage,
    method: 'post',
    data: parameter
  })
}
