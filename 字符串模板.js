function render(template, data) {
  const reg = /\{\{(\w+)\}\}/;
  if (reg.test(template)) {
    const name = reg.exec(template)[1];
    console.log(reg.exec(template));
    template = template.replace(reg, data[name]);
    return render(template, data);
  }
  return template;
}

let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let person = {
  name: "扑街",
  age: 18,
  sex: "你猜",
};

console.log(render(template, person));
