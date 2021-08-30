# 宏任务macroTask 微任务microTask
宏任务：setTimeout，setInterval，ajax，DOM事件
微任务：Promise，async await
微任务比宏任务执行时机早
微任务：DOM渲染前触发，es6语法规定
宏任务：DOM渲染后触发，浏览器规定


# eventloop 事件循环/事件轮询
- js是单线程运行的
- 异步（setTimeout，setInterval，ajax）使用回调来，基于event loop
- DOM事件使用回调，基于event loop
- event loop是异步回调和DOM事件回调的实现原理

# js如何执行
- 从前到后，一行一行执行
- 如果某一行执行报错，停止后面代码的执行
- 先执行完同步代码，再执行异步代码
Call Stack 执行栈
Web APIs 放宏任务
Callback Queue 回调函数队列
micro task queue
Event Loop

1，同步代码，每执行一行代码，代码放入Call Stack，执行完，清空Call Stack，再放入第二行代码。。。
2，发现有宏任务，放入Web APIs里，等待时机（setTimeout定时，ajax网络请求，dom操作用户点击等）时机到了，宏任务移动到Callback Queue
3，发现有微任务，放到micro task queue里
4，同步代码执行完，Call Stack清空
5，执行micro task queue里的微任务
6，尝试DOM渲染
7，Event Loop开始工作
8，轮询查找Callback Quene，如果有则移动到Call Stack执行，执行完，清空Call Stack
9，尝试DOM渲染
10，继续轮询查找，重复8，9，10

# Promise
三种状态：pedding，resolved，rejected
```javascript
// 刚定义时，状态默认为 pending
const p1 = new Promise((resolve, reject) => {

})

// 执行 resolve() 后，状态变成 resolved
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve()
    })
})

// 执行 reject() 后，状态变成 rejected
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject()
    })
})

```
- pedding 不会触发任何then catch回调
- pedding->resolved 触发then 回调
- pedding->rejected 触发catch 回调
- 状态不可逆  

```javascript
const p1 = Promise.resolve(100)
p1.then(data=>{
    console(data)
}).catch(err => {
    console.log(err)
})
// 100
const p2 = Promise.reject('err')
p1.then(data=>{
    console(data)
}).catch(err => {
    console.log(err)
})
// err
```

## then 和 catch 改变状态
- then正常返回resolved状态的promise，里面有报错返回rejected状态的promise
- catch正常返回resolved状态的promise（重点！！！！！！！！！），里面有报错返回rejected状态的promise
```javascript
// then() 一般正常返回 resolved 状态的 promise
Promise.resolve().then(() => {
    return 100
})

// then() 里抛出错误，会返回 rejected 状态的 promise
Promise.resolve().then(() => {
    throw new Error('err')
})

// catch() 不抛出错误，会返回 resolved 状态的 promise
Promise.reject().catch(() => {
    console.error('catch some error')
})

// catch() 抛出错误，会返回 rejected 状态的 promise
Promise.reject().catch(() => {
    console.error('catch some error')
    throw new Error('err')
})
```


# async/await
用同步语法写异步代码，没有回调  
见 async1.js

# async/await 和 Promise 的关系
- 执行async函数，返回Promise对象
- await相当于Promise的then  
await 后面跟 Promise 对象：会阻断后续代码，等待状态变为 resolved ，才获取结果并继续执行  
await 后续跟非 Promise 对象：相当 await Promise.resolve(100)，会直接返回
- try...catch可捕获异常，代替了Promise的catch

```javascript
async function fn2() {
    return new Promise(() => {})
}
console.log( fn2() )

async function fn1() {
    return 100
}
console.log( fn1() ) // 执行fn1() 相当于 Promise.resolve(100)

async function fn3() {
    return Promise.resolve(200)
}
console.log( fn3() ) // promise对象


(async function () {
    const p1 = new Promise(() => {})
    await p1
    console.log('p1') // 不会执行
})()

(async function () {
    const p2 = Promise.resolve(100)
    const res = await p2   // await 相当于Promise的then
    console.log(res) // 100
})()

(async function () {
    const res = await 100  // 相当 await Promise.resolve(100)
    console.log(res) // 100
})()

(async function () {
    const p3 = Promise.reject('some err')
    const res = await p3
    console.log(res) // 不会执行
})()

(async function () {
    const p4 = Promise.reject('some err')
    try {           // try...catch可捕获异常，代替了Promise的catch
        const res = await p4
        console.log(res)
    } catch (ex) {
        console.error(ex)
    }
})()
```

await 是同步写法，但本质还是异步调用。 只要遇到了 await ，后面的代码都相当于放在 callback 里，是微任务
- 执行async函数会立即执行
- await的后面函数或变量会马上执行，直到遇到后面函数内的等待
- await的下面内容都可以看作callback里的内容
```javascript
async function async1 () {
  console.log('async1 start')  //2
  await async2()
  console.log('async1 end') // 5 关键在这一步，它相当于放在 callback 中，最后执行
}

async function async2 () {
  console.log('async2') //3
}

console.log('script start')  //1
async1()
console.log('script end')//4
```

```javascript

async function async1 () {
  console.log('async1 start') //2
  await async2() 
  console.log('async1 end') //6
}

async function async2 () {
  console.log('async2')//3
}

console.log('script start')  //1

setTimeout(function () { 
  console.log('setTimeout')
}, 0) //7

async1()

new Promise (function (resolve) { 
  console.log('promise1') //4
  resolve()
}).then (function () { 
  console.log('promise2') //7
})

console.log('script end') //5
```

# for ... of
```javascript
// 定时算乘法
function multi(num) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(num * num)
        }, 1000)
    })
}

// // 使用 forEach ，是 1s 之后打印出所有结果，即 3 个值是一起被计算出来的
// function test1 () {
//     const nums = [1, 2, 3];
//     nums.forEach(async x => {
//         const res = await multi(x);
//         console.log(res);
//     })
// }
// test1();

// 使用 for...of ，可以让计算挨个串行执行
async function test2 () {
    const nums = [1, 2, 3];
    for (let x of nums) {
        // 在 for...of 循环体的内部，遇到 await 会挨个串行计算
        const res = await multi(x)
        console.log(res)
    }
}
test2()
```

# 面试题
## 请描述event loop（事件循环/事件轮询）的机制，可画图
1，同步代码，每执行一行代码，代码放入Call Stack，执行完，清空Call Stack，再放入第二行代码。。。
2，发现有宏任务，放入Web APIs里，等待时机（setTimeout定时，ajax网络请求，dom操作用户点击等）时机到了，宏任务移动到Callback Queue
3，发现有微任务，放到micro task queue里
4，同步代码执行完，Call Stack清空
5，执行micro task queue里的微任务
6，尝试DOM渲染
7，Event Loop开始工作
8，轮询查找Callback Quene，如果有则移动到Call Stack执行，执行完，清空Call Stack
9，尝试DOM渲染
10，继续轮询查找，重复8，9，10

## 什么是宏任务和微任务，两者有什么区别
宏任务：setTimeout，setInterval，ajax，DOM事件，es6语法规定
微任务：Promise，async await，浏览器规定
微任务比宏任务执行时机早
微任务：DOM渲染前触发
宏任务：DOM渲染后触发

## Promise有哪三种状态？如何变化？
- pedding 不会触发任何then catch回调
- pedding->resolved 触发then 回调
- pedding->rejected 触发catch 回调
- 状态不可逆 
  
## promise then 和 catch 的连接
```javascript
// 第一题
Promise.resolve().then(() => {
    console.log(1)
}).catch(() => {
    console.log(2)
}).then(() => {
    console.log(3)
})
//1 3

// 第二题
Promise.resolve().then(() => { // 返回 rejected 状态的 promise
    console.log(1)
    throw new Error('erro1')
}).catch(() => { // 返回 resolved 状态的 promise
    console.log(2)
}).then(() => {
    console.log(3)
})
//1 2 3


// 第三题
Promise.resolve().then(() => { // 返回 rejected 状态的 promise
    console.log(1)
    throw new Error('erro1')
}).catch(() => { // 返回 resolved 状态的 promise
    console.log(2)
}).catch(() => {
    console.log(3)
})
//1 2
```

## async/await 语法
```javascript
async function fn() {
    return 100
}
(async function () {
    const a = fn() // ??               // promise
    const b = await fn() // ??         // 100
})()

(async function () {
    console.log('start')
    const a = await 100
    console.log('a', a)   //100
    const b = await Promise.resolve(200)
    console.log('b', b)   //200
    const c = await Promise.reject(300)
    // 以下不会执行
    console.log('c', c)   
    console.log('end')
})() // 执行完毕，打印出那些内容？

```

## promise和setTimeout的顺序
```javascript
console.log(100)
setTimeout(() => {
    console.log(200)
})
Promise.resolve().then(() => {
    console.log(300)
})
console.log(400)
// 100 400 300 200
```

## 外加 async/await 的顺序问题
```javascript
async function async1 () {
  console.log('async1 start')   //2
  await async2() // 这一句会同步执行，返回 Promise ，其中的 `console.log('async2')` 也会同步执行
  console.log('async1 end') //6 // 上面有 await ，下面就变成了“异步”，类似 cakkback 的功能（微任务）
}

async function async2 () {
  console.log('async2')  //3
}

console.log('script start')   //1

setTimeout(function () { // 异步，宏任务
  console.log('setTimeout')  //8
}, 0)

async1()

new Promise (function (resolve) { // 返回 Promise 之后，即同步执行完成，then 是异步代码
  console.log('promise1')  //4 // Promise 的函数体会立刻执行
  resolve()
}).then (function () { // 异步，微任务
  console.log('promise2')  //7
})

console.log('script end')  //5

// 同步代码执行完之后，屡一下现有的异步未执行的，按照顺序
// 1. async1 函数中 await 后面的内容 —— 微任务
// 2. setTimeout —— 宏任务
// 3. then —— 微任务
```


