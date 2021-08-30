# 单线程和异步

- JS是单线程语言，只能同时做一件事儿
- 浏览器和nodejs已支持JS启动进程，如Web Worker
- JS和DOM渲染共用一个线程，因为JS可修改DOM结构
JS执行的时候DOM渲染停止，DOM渲染的时候JS停止
- 遇到等待（网络请求，定时任务）不能卡住
- 需要异步，解决单线程等待这种为题
- 异步是基于回调callback函数调用的

# 同步和异步
- 基于JS是单线程语言
- 异步不会阻塞代码执行
- 同步会阻塞代码执行
- alert也会卡顿异步代码

```javascript
// 异步 （callback 回调函数） 不停止运行
console.log(100)
setTimeout(() => {
    console.log(200)
}, 1000)
alert(2000)
console.log(300)
console.log(400)

/*
100
弹窗2000 卡顿，点击确定，显示300，400，200 
300
400
200
*/

// 同步  alert会阻塞代码执行
console.log(100)
alert(200)
console.log(300)
/*
100
弹窗200 卡顿，点击确定，显示300
*/
```

# 异步的应用场景
- 网络请求，如ajax图片加载
- 定时任务，如setTimeout

# callback hell

# Promise
Promise解决了回调地狱的问题

# 面试题
## 同步和异步的区别是什么？
异步和同步基于JS是单线程语言，异步不会阻塞代码执行，同步会阻塞代码执行

## 手写用promise加载一张图片
promise-demo.js

## 前端异步的使用场景
- 网络请求，ajax，图片加载
- 定时任务，setTimeout，setInterval  
  
## setTimeout笔试题
```javascript
console.log(1)
setTimeout(function() {
    console.log(2)
}, 1000)
console.log(3)
setTimeout(function(){
    console.log(4)
}, 0)
console.log(5)
/*
1
3
5
4
2
*/
```
