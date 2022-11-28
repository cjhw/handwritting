Array.prototype.customSort = function (fn) {
  let arr = this // this就是原数组
  let len = arr.length
  let cur, preIndex
  // 采用插入排序的方式
  for (let i = 1; i < len; i++) {
    cur = arr[i]
    preIndex = i - 1
    // fn不存在，将数字会转换为字符串，对比unicode位
    // fn 存在，执行fn，将结果与0做比较
    while (
      preIndex >= 0 &&
      (fn
        ? fn(cur, arr[preIndex]) < 0
        : cur.toString() < arr[preIndex].toString())
    ) {
      arr[preIndex + 1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex + 1] = cur
  }
  return arr
}

// test 1
let arrTest = [
  { name: 'b', age: 11 },
  { name: 'aa', age: 61 },
  { name: 'a', age: 16 },
  { name: 'c', age: 8 },
]
arrTest.customSort((a, b) => b.age - a.age)
console.log(arrTest) // 按年龄倒序
// test 2
// let arrTest = [12, 3, 43, 5, 21, 111]
// arrTest.customSort((a, b) => b - a)
// console.log(arrTest) // 倒序 [111, 43, 21, 12, 5, 3]
// // test 3
// let arrTest = [12, 3, 43, 5, 21, 111]
// arrTest.customSort()
// console.log(arrTest) // unicode排序 [111, 12, 21, 3, 43, 5]
// // test 4
// let arrTest = [12, 3, 43, 5, 21, 111]
// arrTest.customSort(() => -1)
// console.log(arrTest) //  参数固定返回-1，所以颠倒原数组 [111, 21, 5, 43, 3, 12]
