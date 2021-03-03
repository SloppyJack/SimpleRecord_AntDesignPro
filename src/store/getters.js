const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab
}

export default getters
