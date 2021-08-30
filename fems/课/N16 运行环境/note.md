# 运行环境
运行环境：浏览器   
下载网页代码，渲染出页面，期间会执行若干JS   
保证代码在浏览器中：稳定且高效

# 页面加载过程

## 加载资源形式 
html，媒体文件（图片，视频等），js，css   

## 加载资源过程
- DNS解析：域名 -> IP地址
- 浏览器根据ip地址向服务器发起http请求
- 服务器处理http请求，返回给浏览器

## 渲染过程
- 根据html代码生成DOM Tree
- 根据css代码生成CSSOM（CSS Object Model）（css代码应该放在header中）
- DOM Tree和CSSOM整合成Render Tree
- 根据Render Tree渲染页面
- 遇到script标签暂停渲染，优先加载并执行JS代码（js应该放在body最后）
- 直至Render Tree渲染完成   

生成Render Tree后会发生回流和重绘
- Layout(回流):根据Render Tree，进行回流(Layout)，得到节点的几何信息（位置，大小）
- Painting(重绘):根据Render Tree和回流得到的几何信息，得到节点的绝对像素

何时发生回流重绘   
我们前面知道了，回流这一阶段主要是计算节点的位置和几何信息，那么当页面布局和几何信息发生变化的时候，就需要回流。比如以下情况：   
- 添加或删除可见的DOM元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
- 页面一开始渲染的时候（这肯定避免不了）
- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的） 
注意：回流一定会触发重绘，而重绘不一定会回流

window.onload：页面全部资源都加载完才会执行，包括图片视频   
DOMContentLoaded：DOM渲染完即可执行，图片视频可能没加载完  

# 性能优化

原则   
- 多使用内存，缓存或其他方法
- 减少cpu计算量，减少网络加载耗时
- 空间换时间

  
1，加载更快
- 减少资源体积：压缩代码，压缩js,css,图片，视频等
- 减少访问次数：合并代码（多个js,css,图片合并成一个文件），SSR服务器端渲染，缓存
- 更快的网络：CDN

缓存：静态资源加hash后缀，根据文件内容计算hash，文件内容不变，hash不变，url不变，url和文件不变，自动出发http缓存机制，返回304

SSR服务器端渲染：网页和数据一起加载渲染，原来的php，jsp就是服务器端渲染，现在的服务器端渲染是react，vue借助了node的实现


2，渲染更快
- css放在head，js放在body最下
- 尽早开始执行js，用DOMContentLoaded触发
- 懒加载
- 对DOM查询缓存（一次去除所有dom数据做操作例如循环，不要每次循环取一次dom）
- 频繁DOM操作合并到一起操作
- 节流throttle和防抖debounce

懒加载
```html
<!--列表里，图片没有到屏幕里，src是预览图，data-realsrc是真实地址-->
<img id='img1' src="preview.png" data-realsrc="abc.png" />
<!-- 列表滑动，图片滚动到屏幕里，data-realsrc 赋值给 src-->
<script type="text/javascript">
    var img1 = document.getElementById('img1')
    img1.src = img1.getAttribute('data-realsrc')
</script>
```

对DOM查询缓存
```javascript
// 不缓存DOM查询
for (let i=0; i < document.getElementByTagName('p').length; i++){
    // 每次循环，都会计算length，频繁进行DOM查询
}

// 缓存DOM查询结果
const pList = document.getElementsByTagName('p')
const length = pList.length
for (let i=0; i<length; i++){
    // 缓存length，只进行一次DOM查询
}
```

频繁DOM操作合并到一起操作
```javascript
const listNode=document.getElementById('list')

// 创建一个文档片段，此时还没有插入到DOM树中
const frag=document.createDocumnentFragment()

// 执行插入
for(let x=0; x<10; x++){
    const li=document.createElement("li")
    li.innerHtml="List item " + x
    frag.appendChild(li)
}

// 都完成只有，再插入到DOM树中
listNode.appendChild(frag)
```

### 防抖debounce
```javascript
const input1 = document.getElementById('input1')

// let timer = null
// input1.addEventListener('keyup', function () {
//     if (timer) {
//         clearTimeout(timer)
//     }
//     timer = setTimeout(() => {
//         // 模拟触发 change 事件
//         console.log(input1.value)

//         // 清空定时器
//         timer = null
//     }, 500)
// })

// 防抖
function debounce(fn, delay = 500) {
    // timer 是闭包中的
    let timer = null

    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}

input1.addEventListener('keyup', debounce(function (e) {
    console.log(e.target)
    console.log(input1.value)
}, 600))
```

### 节流throttle
```javascript
const div1 = document.getElementById('div1')

// let timer = null
// div1.addEventListener('drag', function (e) {
//     if (timer) {
//         return
//     }
//     timer = setTimeout(() => {
//         console.log(e.offsetX, e.offsetY)

//         timer = null
//     }, 100)
// })

// 节流
function throttle(fn, delay = 100) {
    let timer = null

    return function () {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}

div1.addEventListener('drag', throttle(function (e) {
    console.log(e.offsetX, e.offsetY)
}))

div1.addEventListener('drag', function(event) {

})
```

### xss,xsrf攻击

# 面试题
## 从输入url到渲染出页面的整个过程
加载资源形式   
html，媒体文件（图片，视频等），js，css   

加载资源过程  
- DNS解析：域名 -> IP地址
- 浏览器根据ip地址向服务器发起http请求
- 服务器处理http请求，返回给浏览器

渲染过程  
- 根据html代码生成DOM Tree
- 根据css代码生成CSSOM（CSS Object Model）（css代码应该放在header中）
- DOM Tree和CSSOM整合成Render Tree
- 根据Render Tree渲染页面
- 遇到script标签暂停渲染，优先加载并执行JS代码（js应该放在body最后）
- 直至Render Tree渲染完成  
- 
## window.onload 和 DOMContentLoaded的区别
window.onload：页面全部资源都加载完才会执行，包括图片视频   
DOMContentLoaded：DOM渲染完即可执行，图片视频可能没加载完  