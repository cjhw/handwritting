const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

function executeFn(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (error) {
    reject(error)
  }
}

class CPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          this.onFulfilledFns.forEach((fn) => {
            fn(this.value)
          })
        })
      }
    }

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          this.onRejectedFns.forEach((fn) => {
            fn(this.reason)
          })
        })
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    const defaultOnFulfulled = (value) => {
      return value
    }
    onFulfilled = onFulfilled || defaultOnFulfilled
    const defaultOnRejected = (err) => {
      throw err
    }
    onRejected = onRejected || defaultOnRejected
    return new CPromise((resolve, reject) => {
      if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        executeFn(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
        executeFn(onRejected, this.reason, resolve, reject)
      }
      if (this.status === PROMISE_STATUS_PENDING) {
        if (onFulfilled) {
          this.onFulfilledFns.push(() => {
            executeFn(onFulfilled, this.value, resolve, reject)
          })
        }
        if (onRejected) {
          this.onRejectedFns.push(() => {
            executeFn(onRejected, this.reason, resolve, reject)
          })
        }
      }
    })
  }
}

const promise = new CPromise((resolve, reject) => {
  console.log('状态pending')
  // resolve(1111) // resolved/fulfilled
  reject(2222)
  // throw new Error("executor error message")
})

// 调用then方法多次调用
promise
  .then(
    (res) => {
      console.log('res1:', res)
      return 'aaaa'
      // throw new Error("err message")
    },
    (err) => {
      console.log('err1:', err)
      return 'bbbbb'
      // throw new Error("err message")
    }
  )
  .then(
    (res) => {
      console.log('res2:', res)
    },
    (err) => {
      console.log('err2:', err)
    }
  )
