const mySetInterval = (func, timeout) => {
  let timer = null
  const interval = () => {
    timer = setTimeout(() => {
      func()
      interval()
    }, timeout)
  }
  interval()
  return () => clearTimeout(timer)
}

const cancel = mySetInterval(() => {
  console.log('kkk')
}, 300)

setTimeout(() => {
  cancel()
  console.log('1秒关闭定时器')
}, 1000)
