Promise.all = function (promiseArr) {
  let index = 0,
    result = []
  return new Promise((resolve, reject) => {
    promiseArr.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (val) => {
          index++
          result[index] = val
          if (index === promiseArr.length) {
            resolve(result)
          }
        },
        (err) => {
          reject(err)
        }
      )
    })
  })
}

Promise.alltwo = function (promiseArr) {
  let result = []
  return new Promise((resolve, reject) => {
    promiseArr.forEach((promise) => {
      promise.then(
        (res) => {
          result.push(res)
          if (result.length === promiseArr.length) {
            resolve(result)
          }
        },
        (err) => {
          reject(err)
        }
      )
    })
  })
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 3000)
})

Promise.all([p2, p1, p3])
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log('err:', err)
  })
