import request from '@/utils/request'

const loginApi = {
  Login: '/user/login',
  // get my info
  RoleMenus: '/user/roleMenus',
  UUID: '/qrcode/uuid',
  MinAppQrcode: '/qrcode',
  QrcodeInfo: '/qrcode/info'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: ''
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: loginApi.Login,
    method: 'post',
    data: parameter
  })
}
export function getRoleMenus () {
  return request({
    url: loginApi.RoleMenus,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// get uuid
export function getUUID () {
  return request({
    url: loginApi.UUID,
    method: 'get'
  })
}

// get wechat min app qrcode
export function getMinAppQrcode (params) {
  return request({
    url: loginApi.MinAppQrcode,
    method: 'get',
    params: params,
    responseType: 'arraybuffer'
  })
}

// get qrcode info
export function getQrcodeInfo (params) {
  return request({
    url: loginApi.QrcodeInfo,
    method: 'get',
    params: params
  })
}
