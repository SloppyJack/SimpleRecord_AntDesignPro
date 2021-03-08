import request from '@/utils/request'

const api = {
  baseSetting: '/account/baseSetting'
}

export default api

export function baseSetting (parameter) {
  return request({
    url: api.baseSetting,
    method: 'put',
    data: parameter
  })
}
