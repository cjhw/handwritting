function Animal(name) {
  this.name = name
  this.colors = ['black', 'white']
}
Animal.prototype.getName = function () {
  return this.name
}
function Dog(name, age) {
  Animal.call(this, name)
  this.age = age
}

Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog
let dog1 = new Dog('奶昔', 2)
dog1.colors.push('brown')
console.log(dog1)
let dog2 = new Dog('哈赤', 1)
console.log(dog2)

function object(o) {
  function F() {}
  F.prototype = o
  return new F()
}

function inheritPrototype(child, parent) {
  let prototype = object(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}
