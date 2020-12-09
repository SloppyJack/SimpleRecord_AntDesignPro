import Vue from 'vue'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  tips：此处已根据后台返回值做了修改
 */
const action = Vue.directive('action', {
  inserted: function (el, binding, vnode) {
    const actionName = binding.arg
    // 当前用户菜单列表，含权限
    const permissions = vnode.context.$route.meta.permission
    let hasPermission = false
    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i] && permissions[i] === actionName) {
        hasPermission = true
        break
      }
    }
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default action
