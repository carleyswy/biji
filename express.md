
# Express

## 安装

### 不使用生成器安装

1. 新建项目目录：myexpress
进入 myexpress
2. 运行 npm init   
初始化，出现 package.json
3. 安装 express  
npm install express --save 

### 使用生成器安装
1. 安装 express-generator
   > npm install -g express-generator
2. 用生成器生成express项目结构
   > express --view=ejs myexpress2
3. 进入生成的express项目
   > cd myexpress2
4. 然后安装所有依赖包  
   > npm install
5. 启动项目
在 MacOS 或 Linux 中，通过如下命令启动此应用：
   > DEBUG=myexpress2:* npm start

   在 Windows 中，通过如下命令启动此应用：
   > set DEBUG=myexpress2:* & npm start
6. 在浏览器输入 http://localhost:3000/ 可以看到这个应用


## 中间件  middleware
一个请求发送到服务器后，它的生命周期是 

先收到request（请求）-> 然后服务端处理 -> 处理完了以后发送response（响应）回去  

而这个服务端处理的过程就有文章可做了，想象一下当业务逻辑复杂的时候，为了明确和便于维护，需要把处理的事情分一下，分配成几个部分来做，而每个部分就是一个中间件  

app.use 加载用于处理http请求的middleware（中间件），当一个请求来的时候，会依次被这些 middlewares处理。中间件执行的顺序是你定义的顺序  

#### 中间件
中间件是一个函数，在响应发送之前对请求进行一些操作

```javascript 
function middleware(req,res,next){
    // 做该干的事
       。。。。。。
    // 做完后调用下一个函数
    next();
}
```  

这个函数有些不太一样，它还有一个next参数，而这个next也是一个函数，它表示函数数组中的下一个函数

#### 函数数组

express内部维护一个函数数组，这个函数数组表示在发出响应之前要执行的所有函数，也就是中间件数组使用app.use(fn)后，传进来的fn就会被扔到这个数组里，执行完毕后调用next()方法执行函数数组里的下一个函数，如果没有调用next()的话，就不会调用下一个函数了，也就是说调用就会被终止

#### Express中间件的使用
理论部分简单的说了一下，现在来用代码验证一下，注意需要安装一下express

```javascript
/**
 * express中间件的实现和执行顺序
 *
 * Created by BadWaka on 2017/3/6.
 */
var express = require('express');

var app = express();
app.listen(3000, function () {
    console.log('listen 3000...');
});

function middlewareA(req, res, next) {
    console.log('middlewareA before next()');
    next();
    console.log('middlewareA after next()');
}

function middlewareB(req, res, next) {
    console.log('middlewareB before next()');
    next();
    console.log('middlewareB after next()');
}

function middlewareC(req, res, next) {
    console.log('middlewareC before next()');
    next();
    console.log('middlewareC after next()');
}

app.use(middlewareA);
app.use(middlewareB);
app.use(middlewareC);
```

输出结果：  
middlewareA before next()   
middlewareB before next()  
middlewareC before next()  
middlewareC after next()  
middlewareB after next()  
middlewareA before next()

实现简单的Express中间件
```javascript
/**
 * 仿照express实现中间件的功能
 *
 * Created by BadWaka on 2017/3/6.
 */

var http = require('http');

/**
 * 仿express实现中间件机制
 *
 * @return {app}
 */
function express() {

    var funcs = []; // 待执行的函数数组

    var app = function (req, res) {
        var i = 0;

        function next() {
            var task = funcs[i++];  // 取出函数数组里的下一个函数
            if (!task) {    // 如果函数不存在,return
                return;
            }
            task(req, res, next);   // 否则,执行下一个函数
        }

        next();
    }

    /**
     * use方法就是把函数添加到函数数组中
     * @param task
     */
    app.use = function (task) {
        funcs.push(task);
    }

    return app;    // 返回实例
}

// 下面是测试case

var app = express();
http.createServer(app).listen('3000', function () {
    console.log('listening 3000....');
});

function middlewareA(req, res, next) {
    console.log('middlewareA before next()');
    next();
    console.log('middlewareA after next()');
}

function middlewareB(req, res, next) {
    console.log('middlewareB before next()');
    next();
    console.log('middlewareB after next()');
}

function middlewareC(req, res, next) {
    console.log('middlewareC before next()');
    next();
    console.log('middlewareC after next()');
}

app.use(middlewareA);
app.use(middlewareB);
app.use(middlewareC);
```

JS是一门神奇的语言，这里用到了两个闭包，并且给app这个函数添加了一个use方法，函数也是可以有属性的原理就是每调用一次use，就把传进来的函数扔到express内部维护的一个函数数组中去测试结果   
middlewareA before next()  
middlewareB before next()  
middlewareC before next()  
middlewareC after next()  
middlewareB after next()  
middlewareA before next()  

## 路由

#### 路由方法
Express 支持对应于 HTTP 方法的以下路由方法：get、post、put、head、delete、options、trace、copy、lock、mkcol、move、purge、propfind、proppatch、unlock、report、mkactivity、checkout、merge、m-search、notify、subscribe、unsubscribe、patch、search 和 connect。   

```javascript
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});
```

有一种特殊路由方法：app.all()，它并非派生自 HTTP 方法。该方法用于在所有请求方法的路径中装入中间件函数。  

在以下示例中，无论您使用 GET、POST、PUT、DELETE 还是在 http 模块中支持的其他任何 HTTP 请求方法，都将为针对“/secret”的请求执行处理程序。

```javascript
app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});
```

#### 路由路径
此路由路径将请求与根路由 / 匹配。
```javascript
app.get('/', function (req, res) {
  res.send('root');
});
```

此路由路径将请求与 /about 匹配。
```javascript
app.get('/about', function (req, res) {
  res.send('about');
});
```

此路由路径将请求与 /random.text 匹配。
```javascript
app.get('/random.text', function (req, res) {
  res.send('random.text');
});
```

此路由路径将匹配 acd 和 abcd。
```javascript
app.get('/ab?cd', function(req, res) {
  res.send('ab?cd');
});
```

此路由路径将匹配 abcd、abbcd、abbbcd 等。
```javascript
app.get('/ab+cd', function(req, res) {
  res.send('ab+cd');
});
```

此路由路径将匹配 abcd、abxcd、abRABDOMcd、ab123cd 等。
```javascript
app.get('/ab*cd', function(req, res) {
  res.send('ab*cd');
});
```

此路由路径将匹配 /abe 和 /abcde。
```javascript
app.get('/ab(cd)?e', function(req, res) {
 res.send('ab(cd)?e');
});
```

基于正则表达式的路由路径的示例：  
此路由路径将匹配名称中具有“a”的所有路由。
```javascript
app.get(/a/, function(req, res) {
  res.send('/a/');
});
```

此路由路径将匹配 butterfly 和 dragonfly，但是不匹配 butterflyman、dragonfly man 等。
```javascript
app.get(/.*fly$/, function(req, res) {
  res.send('/.*fly$/');
});
```

#### 路由处理程序
您可以提供多个回调函数，以类似于中间件的行为方式来处理请求。唯一例外是这些回调函数可能调用 next('route') 来绕过剩余的路由回调。

单个回调函数可以处理一个路由。例如：
```javascript
app.get('/example/a', function (req, res) {
  res.send('Hello from A!');
});
```

多个回调函数可以处理一个路由（确保您指定 next 对象）。例如：
```javascript
app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from B!');
});
```

一组回调函数可以处理一个路由。例如：
```javascript
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

var cb2 = function (req, res) {
  res.send('Hello from C!');
}

app.get('/example/c', [cb0, cb1, cb2]);
```

独立函数与一组函数的组合可以处理一个路由。例如：
```javascript
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from D!');
});
```
#### 响应方法
下表中响应对象 (res) 的方法可以向客户机发送响应，并终止请求/响应循环。如果没有从路由处理程序调用其中任何方法，客户机请求将保持挂起状态。

| 方法	| 描述 |   
| --------    | ----- | 
| res.download()	| 提示将要下载文件。 |   
| res.end()	| 结束响应进程。 |   
| res.json()	| 发送 JSON 响应。 |   
| res.jsonp()	| 在 JSONP 的支持下发送 JSON 响应。 |   
| res.redirect()	| 重定向请求。 |   
| res.render()	| 呈现视图模板。 |   
| res.send()	| 发送各种类型的响应。 |   
| res.sendFile()	| 以八位元流形式发送文件。 |   
| res.sendStatus()	| 设置响应状态码并以响应主体形式发送其字符串表示。 | 

#### app.route()
您可以使用 app.route() 为路由路径创建可链接的路由处理程序。 因为在单一位置指定路径，所以可以减少冗余和输入错误。有关路由的更多信息，请参阅 Router() 文档。

以下是使用 app.route() 定义的链式路由处理程序的示例。

```javascript
app.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });
```

#### express.Router
使用 express.Router 类来创建可安装的模块化路由处理程序。Router 实例是完整的中间件和路由系统；因此，常常将其称为“微型应用程序”。

以下示例将路由器创建为模块，在其中装入中间件，定义一些路由，然后安装在主应用程序的路径中。

在应用程序目录中创建名为 birds.js 的路由器文件，其中包含以下内容：

```javascript
var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;
```

接着，在应用程序中装入路由器模块：

```javascript
var birds = require('./birds');
...
app.use('/birds', birds);
```

此应用程序现在可处理针对 /birds 和 /birds/about 的请求，调用特定于此路由的 timeLog 中间件函数。


#### 路由中间件router实现路由实例
入口routeapp.js
```javascript
var express=require('express');
//引入模块
var admin=require('./routes/admin.js');//路由，后台
var index=require('./routes/index.js');//路由，首页
var   app=express();
 
app.use('/',index);//挂在路由，如果没有路由，或者只有/ ,映射到index路由；
app.use('/admin',admin);//挂在路由，/admin映射到admin
 
 
var server =app.listen(8081,'192.168.99.149',function(req,res,next){
  var host = server.address().address
  var port = server.address().port
  console.log(__dirname);//这里的目录就是/Users/wofu/Desktop/node，其中node文件夹我是直接放在了桌面
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
```

****admin.js
```javascript
/**
******后台
*/
var express=require('express');
var router=express.Router();//
var  login=require('./admin/login.js');//路由，登陆
var  product=require('./admin/product.js');//路由，商品
var  user=require('./admin/user.js');//路由，用户
 
router.use('/login',login);//   /login 映射到login这个路由
router.use('/product',product);//   /product  映射到product这个路由
router.use('/user',user);
//如果login  product user  不存在，则会走下面这个
router.use("/",function(req,res){
  res.send("admin/");
})
 
module.exports =router;//暴露模块
```

******index.js
```javascript
// 首页，默认页
var express=require('express');
var router=express.Router();
 
router.get('/',function(req,res){
  res.send('index');
})
 
router.get('/product',function(req,res){
  res.send('product页面');
})
 
module.exports = router;
```

*****login.js
```javascript
var express=require('express');
 
var router=express.Router();
 
router.get('/',function(req,res,next){
  res.send("登陆页面");
})
module.exports=router;
```

******product.js
```javascript
var express=require('express');
 
var router=express.Router();
 
router.get('/',function(req,res,next){
  res.send("商品页面");
})
module.exports=router;
```
