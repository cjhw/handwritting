Array.prototype.reduce2 = function (callback, initialValue) {
  if (this === null) {
    throw new TypeError('this is null or not defined')
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }
  const O = Object(this)
  const len = O.length >>> 0
  let k = 0,
    account
  if (arguments.length > 1) {
    account = initialValue
  } else {
    // 没传入初始值的时候，取数组中第一个非 empty 的值为初始值
    while (k < len && !(k in O)) {
      k++
    }
    if (k > len) {
      throw new TypeError('Reduce of empty array with no initial value')
    }
    account = O[k++]
  }
  while (k < len) {
    if (k in O) {
      account = callback(account, O[k], k, O)
    }
    k++
  }
  return account
}

const a = [1, 2, 3, 4]
console.log(a.reduce2((pre, item) => pre + item, 9))
