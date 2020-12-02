// eslint-disable-next-line
// eslint-disable-next-line
import {BasicLayout, BlankLayout, PageView, RouteView} from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/views/dashboard/Workplace'),
  'Analysis': () => import('@/views/dashboard/Analysis'),

  // form
  'BasicForm': () => import('@/views/form/basicForm'),
  'StepForm': () => import('@/views/form/stepForm/StepForm'),
  'AdvanceForm': () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  'TableList': () => import('@/views/list/TableList'),
  'StandardList': () => import('@/views/list/BasicList'),
  'CardList': () => import('@/views/list/CardList'),
  'SearchLayout': () => import('@/views/list/search/SearchLayout'),
  'SearchArticles': () => import('@/views/list/search/Article'),
  'SearchProjects': () => import('@/views/list/search/Projects'),
  'SearchApplications': () => import('@/views/list/search/Applications'),
  'ProfileBasic': () => import('@/views/profile/basic'),
  'ProfileAdvanced': () => import('@/views/profile/advanced/Advanced'),

  // result
  'ResultSuccess': () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  'ResultFail': () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // account
  'AccountCenter': () => import('@/views/account/center'),
  'AccountSettings': () => import('@/views/account/settings/Index'),
  'BaseSettings': () => import('@/views/account/settings/BaseSetting'),
  'SecuritySettings': () => import('@/views/account/settings/Security'),
  'CustomSettings': () => import('@/views/account/settings/Custom'),
  'BindingSettings': () => import('@/views/account/settings/Binding'),
  'NotificationSettings': () => import('@/views/account/settings/Notification')

  // 'TestWork': () => import(/* webpackChunkName: "TestWork" */ '@/views/dashboard/TestWork')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  menuName: 'index',
  menuTitle: '首页',
  path: '/',
  component: 'BasicLayout',
  redirect: '/dashboard/workplace',
  children: []
}

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (ret) => {
  return new Promise((resolve, reject) => {
    console.log('res', ret)
    const menuNav = []
    rootRouter.children = ret
    menuNav.push(rootRouter)
    console.log('menuNav', menuNav)
    const routers = generator(menuNav)
    routers.push(notFoundRouter)
    console.log('routers', routers)
    resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  const children = []
  routerMap.forEach(item => {
    // 如果为按钮，则终止此次循环
    if (item.menuType !== 'F') {
      // 判断是否为目录
      if (item.menuType === 'M') {
        item.component = 'RouteView'
      }
      const currentRouter = {
        //  动态拼接路由地址
        path: item.outerChain ? `${item.path}` : `${parent && parent.path || ''}/${item.path}`,
        // 路由名称
        name: item.menuName,
        // 动态加载该路由对应页面的组件
        component: item.outerChain ? undefined : (constantRouterComponents[item.component]) || (() => import(`@/views/${parent && parent.path || ''}/${item.component}`)),
        meta: {
          title: item.menuTitle,
          icon: item.iconName || undefined,
          hiddenHeaderContent: false,
          target: item.outerChain ? '_blank' : undefined,
          permission: item.permissionSign
        }
      }
      // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
      if (!currentRouter.path.startsWith('http')) {
        currentRouter.path = currentRouter.path.replace('//', '/')
      }
      // 重定向
      // item.redirect && (currentRouter.redirect = item.redirect)
      if (item.outerChain === 1) {
        currentRouter.redirect = item.path
      }
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        const t = generator(item.children, currentRouter)
        // 如果没有孩子，则不赋值
        if (t.length > 0) currentRouter.children = t
      }
      children.push(currentRouter)
    }
  })
  return children
}
