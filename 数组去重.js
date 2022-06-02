function unique(arr) {
  var res = arr.filter((item, index, array) => {
    return array.indexOf(item) === index
  })
  return res
}

var unique1 = (arr) => [...new Set(arr)]

console.log(unique([1, 1, 1, 2, 3]))
