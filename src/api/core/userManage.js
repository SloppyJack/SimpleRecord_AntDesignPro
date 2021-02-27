import request from '@/utils/request'

const api = {
  userByPage: '/user/page',
  getUser: '/user/',
  edit: '/user/edit'
}

export default api

export function getUserByPage (parameter) {
  return request({
    url: api.userByPage,
    method: 'post',
    data: parameter
  })
}

export function getUser (id) {
  return request({
    url: api.getUser + id,
    method: 'get'
  })
}

export function editUser (parameter) {
  return request({
    url: api.edit,
    method: 'put',
    data: parameter
  })
}
