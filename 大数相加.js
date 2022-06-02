function addStrings(num1, num2) {
  let res = ''
  let flag = 0
  while (num1.length < num2.length) {
    num1 = '0' + num1
  }
  while (num2.length < num1.length) {
    num2 = '0' + num2
  }
  let i = num1.length - 1
  while (i >= 0) {
    flag = Number(num1[i]) + Number(num2[i]) + flag
    res = (flag % 10) + res
    flag = flag >= 10 ? 1 : 0
    i--
  }
  return flag === 1 ? '1' + res : res
}

console.log(addStrings('1255', '456'))
