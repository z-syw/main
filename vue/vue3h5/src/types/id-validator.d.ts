// 身份证号验证的类型声明文件，由于此包比较老，所以没有@types/id-validator，不能安装此类型声明文件
// 如何解决？自己写一个类型声明文件给身份证号校验使用
// 如何写？declare module 'id-validator'

// 只写这行代码，虽然可以，但是使用时没有提示。如何解决？
// 根据使用方式得知此包默认导出一个构造函数或者是类
// 如何声明ES6中的类并使用？
// class Person {
//   name = '刘德华'
//   say() {}
// }
// const p = new Person()
// p.say()

// 如何手动给身份证号声明类型声明文件
// 使用的时候是默认导入，所以这里就是默认导出
declare module 'id-validator' {
  export default class {
    // 为什么这里有这两个方法？因为逻辑页面使用了这两个方法
    isValid(id: tring): boolean
    getInfo(id: tring): {
      sex: number
    }
  }
}
