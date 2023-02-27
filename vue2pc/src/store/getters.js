// 建立对于state的快捷访问
// 注意：此getters是根级别的getters，所以在使用时不需要加上模块名

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  staffPhoto: state => state.user.userInfo.staffPhoto
}

// const getters = {
//   token(state) {
//     return state.app.token;
//   },
// };

// 如何获取
// this.$store.state.user.token
// this.$store.getters.token

export default getters
