function flatten(arr, level) {
  var result = []
  for (var i = 0; i < arr.length; i++) {
    let level1 = level
    if (Array.isArray(arr[i]) && level1 > 0) {
      level1--
      result = result.concat(flatten(arr[i], level1))
    } else {
      result.push(arr[i])
    }
  }
  return result
}

function flatten1(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

console.log(flatten([1, [2, [3]]], 0))
