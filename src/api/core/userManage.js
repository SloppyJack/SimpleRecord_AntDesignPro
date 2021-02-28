import request from '@/utils/request'

const api = {
  userByPage: '/user/page',
  getUser: '/user/',
  edit: '/user/edit',
  add: '/user/add',
  del: '/user/',
  reset: '/user/reset/'
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

export function addUser (parameter) {
  return request({
    url: api.add,
    method: 'post',
    data: parameter
  })
}

export function delUser (id) {
  return request({
    url: api.del + id,
    method: 'delete'
  })
}

export function resetUser (id) {
  return request({
    url: api.reset + id,
    method: 'put'
  })
}
