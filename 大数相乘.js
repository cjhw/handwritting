function multiply(num1, num2) {
  if (num1 == '0' || num2 == '0') return '0'
  const arr = []
  let l1 = num1.length - 1
  let l2 = num2.length - 1
  for (let i = l1; i >= 0; i--) {
    for (let j = l2; j >= 0; j--) {
      arr[i + j] = (arr[i + j] || 0) + num1[i] * num2[j]
    }
  }
  let carry = 0
  let i = arr.length - 1
  while (i >= 0) {
    let cur = carry + arr[i]
    arr[i] = cur % 10
    carry = Math.floor(cur / 10)
    i--
  }
  if (carry) {
    arr.unshift(carry)
  }
  return arr.join('')
}
