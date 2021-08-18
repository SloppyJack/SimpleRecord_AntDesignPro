/**
 * 公用业务方法
 */

const statusMap = {
  0: {
    status: 'success',
    text: '已启用'
  },
  1: {
    status: 'default',
    text: '已停用'
  }
}

export function statusFilter (id = 1) {
  return statusMap[id].text
}

export function statusTypeFilter (id = 1) {
  return statusMap[id].status
}
