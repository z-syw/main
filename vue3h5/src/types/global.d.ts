interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }

  QC: {
    Login: {
      check(): bollean // 检查QQ是否登录
      // check: () => bollean // 检查QQ是否登录
      getMe(cb: (openId: string) => void): void // 获取个人信息
    }
  }
}
