Function.prototype.customCall = function (context, ...args) {
  if (context == null) context = globalThis;
  if (typeof context !== "object") context = new Object(context); // 值类型，变为对象
  const fnKey = Symbol(); // 不会出现属性名称的覆盖
  context[fnKey] = this; // this 就是当前的函数
  const res = context[fnKey](...args); // 绑定了 this
  delete context[fnKey]; // 清理掉 fn ，防止污染
  return res;
};

Function.prototype.customApply = function (context, args) {
  if (context == null) context = globalThis;
  if (typeof context !== "object") context = new Object(context); // 值类型，变为对象
  const fnKey = Symbol(); // 不会出现属性名称的覆盖
  context[fnKey] = this; // this 就是当前的函数
  const res = context[fnKey](...args); // 绑定了 this
  delete context[fnKey]; // 清理掉 fn ，防止污染
  return res;
};

Function.prototype.customBind = function (context) {
  if (typeof this !== "function") {
    throw TypeError("Error");
  }

  let args = [...arguments].slice(1);
  fn = this;
  return function Fn() {
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};

function fn(a, b, c) {
  console.info(this, a, b, c);
}

// fn.customCall({ x: 100 }, 10, 20, 30)

fn.customApply({ x: 200 }, [100, 200, 300]);

let bindFn = fn.customBind({ x: 300 });
bindFn(100, 200, 300);
