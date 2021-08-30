# ajax

## XMLHttpRequest
xhr.readyState
- 0 未初始化，还没调用send()方法
- 1 载入，已调用send方法，正在发送
- 2 载入完成，send方法执行完成，已经收到全部相应内容
- 3 交互，正在解析相应内容
- 4 完成，相应内容解析完成，可以在客户端调用

xhr.status
- 2XX 请求成功，200
- 3XX 重定向，301(永久) 302(临时) 304(资源未修改)
- 4XX 客户端错误，404(资源未找到) 403（没有权限）
- 5XX 服务端错误，500（服务器错误） 504（网关超时）
```javascript
const xhr=new XMLHttpRequest()
xhr.open('GET', '/api', true) //异步true，同步false
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(xhr.status === 200){
            console.log(xhr.responseText)
        } else {
            console.log('其他情况')
        }
    }
}
xhr.send(null)
```

```javascript
const xhr=new XMLHttpRequest()
xhr.open('POST', '/api', false) //异步true，同步false
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(xhr.status === 200){
            console.log(xhr.responseText)
        } else {
            console.log('其他情况')
        }
    }
}
const postData = {
    u:'a',
    p:'x'
}
xhr.send(JSON.stringify(postData))
```

## 同源策略
### ajax请求时，浏览器要求当前网页和server必须同源（安全）
同源：协议，域名，端口 三者必须一致
### 加载图片，css，js可无视同源策略
- <img src=跨域的图片地址>
- <link href=跨域的css地址>
- <script src=跨域的js地址></script>
作用
- <img /> 可用于统计打点，可使用第三方统计服务
- <link /><script> 可使用cdn，cdn一般都是外域
- <script> 可实现JSONP

## 跨域
- 所有的跨域，必须经过server端允许和配合
- 未经server端允许就实现的跨域，说明浏览器有漏洞，危险信号

## jsonp
原理
- <script> 可绕过跨域限制
- 服务器可以任意动态拼接数据返回
- <script> 就可以获得跨域的数据，只要服务器愿意返回
```html
<!--函数的定义-->
<script>
window.callback = function (data){
    console.log(data)
}
</script>
<!--
返回函数的执行callback({x:100, y:200})
-->
<script src="http://***?a=1"></script>


```

## cors - 服务器设置http header
```javascript
response.setHeader("Access-Control-Allow-Origin", "http://***");
response.setHeader("Access-Control-Allow-Header", "X-Reruested-With");
response.setHeader("Access-Control-Allow-Medthods", "PUT,POST,GET,DELETE,OPTIONS");

// 接受跨域的cookie
response.setHeader("Access-Control-Allow-Credentials", "true")

```

## ajax的常用插件
- jQuery的ajax
- Fetch
- axios



# 面试题

## 手写一个简易的ajax
```javascript
function ajax(url) {
    const p = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    )
                } else if (xhr.status === 404 || xhr.status === 500) {
                    reject(new Error('404 not found'))
                }
            }
        }
        xhr.send(null)
    })
    return p
}

const url = '/data/test.json'
ajax(url)
.then(res => console.log(res))
.catch(err => console.error(err))
```

## 跨域常用的方式
- JSONP
- CORS
