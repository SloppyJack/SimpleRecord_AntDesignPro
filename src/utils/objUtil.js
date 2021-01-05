/**
 * 去除对象中空值
 */
export function rmNullItem (obj) {
  Object.keys(obj).forEach(n => {
    if (!obj[n]) {
      delete obj[n]
    }
  })
  return obj
}
