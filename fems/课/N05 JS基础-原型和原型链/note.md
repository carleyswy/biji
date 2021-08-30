# class
> constructor
> 属性
> 方法

# 继承
> extends
> super
> 扩展或重写方法

# 原型
```javascript
// class 实际上是函数，可见是语法糖
typeof People // 'function'
typeof Student // 'function'

// 隐式原型和显示原型
console.log( xialuo.__proto__)  // 隐式原型
console.log( Student.prototype)  // 显性原型
console.log( xialuo.__proto__ === Student.prototype )  //true
```

![Image text](./yx.png)
# 原型关系
> 每个class都有显示原型 portotype
> 每个实例都有隐式原型 __proto__
> 实例的 __proto__ 指向对应class的prototype

# 基于原型的执行规则
> 获取属性 xiaoluo.name 或执行方法 xiaoluo.sayhi() 时
> 先在自身属性和方法查找
> 如果找不到则自动去 __proto__ 中查找

# 原型链
```javascript
console.log(Student.prototype.__proto__)
console.log(People.prototype)
console.log(People.prototype === Student.prototype.__proto__)
```
![Image text](./yxl.jpg)
![Image text](./yxl2.jpg)

# 类型判断 instanceof
左边的可以顺着原型链找到右边的，就是true
```javascript
xialuo instanceof Student  // true
xialuo instanceof People  // true
xialuo instanceof Object  // true

[] instanceof Array  // true
[] instanceof Object  // true

{} instanceof Object  // true
```

# hasOwnProperty() 是否是自己的属性和方法
```javascript
xialuo.hasOwnProperty('name') // true
xialuo.hasOwnProperty('sayHi') // false
xialuo.hasOwnProperty('eat') // false
xialuo.hasOwnProperty('hasOwnProperty') // false

xialuo.__proto__ === Student.prototype //true
Student.prototype.hasOwnProperty('sayHi') //true
xialuo.__proto__.hasOwnProperty('sayHi') //true
```

# 题目
## 1.如何准确判断一个变量是不是数组？
a instanceof Array

## 2.手写一个简易的jQuery，考虑插件和扩展性

## 3.class的原型本质，怎么理解
原型和原型链的图示
属性和方法的执行规则，就是顺着原型链找到可以属性和方法


