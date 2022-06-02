function objectFactory() {
  var obj = new Object()
  Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  var res = Constructor.apply(obj, arguments)
  // res || obj 这里这么写考虑了构造函数显示返回 null 的情况
  return typeof res === 'object' ? res || obj : obj
}

function person(name, age) {
  this.name = name
  this.age = age
}
let p = objectFactory(person, '扑街', 12)
console.log(p)
