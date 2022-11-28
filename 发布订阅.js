function EventEmitter() {
  this._events = {}
}

EventEmitter.prototype.on = function (eventName, callback) {
  if (!this._events) {
    this._events = {}
  }
  if (this._events[eventName]) {
    this._events[eventName].push(callback)
  } else {
    this._events[eventName] = [callback]
  }
}
EventEmitter.prototype.emit = function (eventName, ...args) {
  this._events[eventName].forEach((fn) => {
    fn(...args)
  })
}
EventEmitter.prototype.off = function (eventName, callback) {
  if (this._events && this._events[eventName]) {
    this._events[eventName] = this._events[eventName].filter(
      (fn) => fn !== callback && fn.l !== callback
    )
  }
}
EventEmitter.prototype.once = function (eventName, callback) {
  const one = () => {
    callback()
    this.off(eventName, one)
  }
  one.l = callback
  this.on(eventName, one)
}

module.exports = EventEmitter

const util = require('util')

function Girl() {}
util.inherits(Girl, EventEmitter) // 原型继承 需要通过实例来调用继承的方法

let girl = new Girl()

const cry = (a, b) => {
  console.log('哭')
}
girl.on('女生失恋', cry)
girl.on('女生失恋', (a, b) => {
  console.log('吃')
})
const fn = () => {
  console.log('逛街')
}
girl.once('女生失恋', fn)

setTimeout(() => {
  girl.off('女生失恋', fn)
  girl.emit('女生失恋', 'a', 'b')
  girl.off('女生失恋', cry)
  girl.emit('女生失恋', 'a', 'b')
}, 1000)
