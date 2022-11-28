// const PROMISE_STATUS_PENDING = 'pending'
// const PROMISE_STATUS_FULFILLED = 'fulfilled'
// const PROMISE_STATUS_REJECTED = 'rejected'

// function executeFn(execFn, value, resolve, reject) {
//   try {
//     const result = execFn(value)
//     resolve(result)
//   } catch (error) {
//     reject(error)
//   }
// }

// class CPromise {
//   constructor(executor) {
//     this.status = PROMISE_STATUS_PENDING
//     this.value = undefined
//     this.reason = undefined
//     this.onFulfilledFns = []
//     this.onRejectedFns = []

//     const resolve = (value) => {
//       if (this.status === PROMISE_STATUS_PENDING) {
//         queueMicrotask(() => {
//           this.status = PROMISE_STATUS_FULFILLED
//           this.value = value
//           this.onFulfilledFns.forEach((fn) => {
//             fn(this.value)
//           })
//         })
//       }
//     }

//     const reject = (reason) => {
//       if (this.status === PROMISE_STATUS_PENDING) {
//         queueMicrotask(() => {
//           if (this.status !== PROMISE_STATUS_PENDING) return
//           this.status = PROMISE_STATUS_REJECTED
//           this.reason = reason
//           this.onRejectedFns.forEach((fn) => {
//             fn(this.reason)
//           })
//         })
//       }
//     }

//     try {
//       executor(resolve, reject)
//     } catch (error) {
//       reject(error)
//     }
//   }

//   then(onFulfilled, onRejected) {
//     const defaultOnFulfulled = (value) => {
//       return value
//     }
//     onFulfilled = onFulfilled || defaultOnFulfilled
//     const defaultOnRejected = (err) => {
//       throw err
//     }
//     onRejected = onRejected || defaultOnRejected
//     return new CPromise((resolve, reject) => {
//       if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
//         executeFn(onFulfilled, this.value, resolve, reject)
//       }
//       if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
//         executeFn(onRejected, this.reason, resolve, reject)
//       }
//       if (this.status === PROMISE_STATUS_PENDING) {
//         if (onFulfilled) {
//           this.onFulfilledFns.push(() => {
//             executeFn(onFulfilled, this.value, resolve, reject)
//           })
//         }
//         if (onRejected) {
//           this.onRejectedFns.push(() => {
//             executeFn(onRejected, this.reason, resolve, reject)
//           })
//         }
//       }
//     })
//   }
// }

// const promise = new CPromise((resolve, reject) => {
//   console.log('状态pending')
//   // resolve(1111) // resolved/fulfilled
//   reject(2222)
//   // throw new Error("executor error message")
// })

// // 调用then方法多次调用
// promise
//   .then(
//     (res) => {
//       console.log('res1:', res)
//       return 'aaaa'
//       // throw new Error("err message")
//     },
//     (err) => {
//       console.log('err1:', err)
//       return 'bbbbb'
//       // throw new Error("err message")
//     }
//   )
//   .then(
//     (res) => {
//       console.log('res2:', res)
//     },
//     (err) => {
//       console.log('err2:', err)
//     }
//   )

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(promise2, x, reslove, reject) {
  if (promise2 === x) {
    return reject(new TypeError('直接扑街'))
  }
  // 我可能写的promise 要和别人的promise兼容，考虑不是自己写的promise情况
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 有可能是promise
    // 别人的promise可能调用成功后 还能调用失败~~~  确保了别人promise符合规范
    let called = false
    try {
      // 有可能then方法是通过defineProperty来实现的 取值时可能会发生异常
      let then = x.then
      if (typeof then === 'function') {
        // 这里我就认为你是promise了  x.then 这样写会触发getter可能会发生异常
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, reslove, reject)
          },
          (r) => {
            // reason
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        reslove(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    reslove(x) // 说明返回的是一个普通值 直接将他放到promise2.resolve中
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING // promise默认的状态
    this.value = undefined // 成功的原因
    this.reason = undefined // 失败的原因
    this.onResolvedCallbacks = [] // 存放成功的回调方法
    this.onRejectedCallbacks = [] // 存放失败的回调方法
    const reslove = (value) => {
      if (value instanceof Promise) {
        return value.then(reslove, reject)
      }
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
        // 发布
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    try {
      executor(reslove, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err
          }
    // 用于实现链式调用
    let promise2 = new Promise((resolve, reject) => {
      // 订阅模式
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            // 此x 可能是一个promise， 如果是promise需要看一下这个promise是成功还是失败 .then ,如果成功则把成功的结果 调用promise2的resolve传递进去，如果失败则同理

            // 总结 x的值 决定是调用promise2的 resolve还是reject，如果是promise则取他的状态，如果是普通值则直接调用resolve
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }

  static reslove(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  catch(errorFn) {
    return this.then(null, errorFn)
  }

  static all = function (promises) {
    return new Promise((resolve, reject) => {
      let result = []
      let times = 0
      const processSuccess = (index, val) => {
        result[index] = val
        if (++times === promises.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < promises.length; i++) {
        // 并发 多个请求一起执行的
        let p = promises[i]
        if (p && typeof p.then === 'function') {
          p.then((data) => {
            processSuccess(i, data)
          }, reject) // 如果其中某一个promise失败了 直接执行失败即可
        } else {
          processSuccess(i, p)
        }
      }
    })
  }
}

Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功')
    }, 2000)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('失败')
    }, 1000)
  }),
  1,
  2,
  3,
])
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err, 'errr')
  })

module.exports = Promise
