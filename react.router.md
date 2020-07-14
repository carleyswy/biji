# React Router 5

## 安装

> npm install react-router-dom

## 路由组件 BrowserRouter 和 HashRouter
BrowserRouter（history模式） 和 HashRouter（hash模式）作为路由配置的最外层容器，是两种不同的模式，可根据需要选择。

### history 模式：
```javascript
class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <Header />
          <Route path='/' exact component={Home}></Route>
          <Route path='/login' exact component={Login}></Route>
          <Route path='/detail/:id' exact component={Detail}></Route>
      </BrowserRouter>
    )
  }
}
```

### hash 模式：
```javascript
class App extends Component {
  render() {
    return (
      <HashRouter>
          <Header />
          <Route path='/' exact component={Home}></Route>
          <Route path='/login' exact component={Login}></Route>
          <Route path='/detail/:id' exact component={Detail}></Route>
      </HashRouter>
    )
  }
}
```

## 路径匹配组件: Route 和 Switch

### Route: 用来控制路径对应显示的组件
有以下几个参数：

> path：指定路由跳转路径  
> exact：精确匹配路由  
> component：路由对应的组件  

```javascript
import About from './pages/about';

··· ···

<Route path='/about' exact component={About}></Route>
```

> render： 通过写render函数返回具体的dom

```javascript
<Route path='/about' exact render={() => (<div>about</div>)}></Route>
``` 

render 也可以直接返回 About 组件，像下面：
```javascript
<Route path='/about' exact render={() => <About /> }></Route>
```
这样写的好处是，不仅可以通过 render 方法传递 props 属性，并且可以传递自定义属性：
```javascript
<Route path='/about' exact render={(props) => {
    return <About {...props} name={'cedric'} />
}}></Route>
```

然后，就可在 About 组件中获取 props 和 name 属性：
```javascript
componentDidMount() {
    console.log(this.props) 
}


// this.props：
// history: {length: 9, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …}
// location: {pathname: "/home", search: "", hash: "", state: undefined, key: "ad7bco"}
// match: {path: "/home", url: "/home", isExact: true, params: {…}}
// name: "cedric"
```

render 方法也可用来进行权限认证：
```javascript
<Route path='/user' exact render={(props) => {
    // isLogin 从 redux 中拿到, 判断用户是否登录
    return isLogin ? <User {...props} name={'cedric'} /> : <div>请先登录</div>
}}></Route>
```
> location: 将 与当前历史记录位置以外的位置相匹配，则此功能在路由过渡动效中非常有用  
> sensitive：是否区分路由大小写  
> strict: 是否配置路由后面的 '/'  

### Switch

渲染与该地址匹配的第一个子节点 <Route> 或者 <Redirect>。

类似于选项卡，只是匹配到第一个路由后，就不再继续匹配：
```javascript
<Switch> 
    <Route path='/home'  component={Home}></Route>
    <Route path='/login'  component={Login}></Route> 
    <Route path='/detail'  component={detail}></Route> 
    <Redirect to="/home" from='/' /> 
</Switch>

// 类似于：
// switch(Route.path) {
//     case '/home':
//         return Home
//     case '/login':
//         return Login
//     ··· ···
// }
```

所以，如果像下面这样:
```javascript
<Switch> 
    <Route path='/home'  component={Home}></Route>
    <Route path='/login'  component={Login}></Route> 
    <Route path='/detail'  component={detail}></Route> 
    <Route path='/detail/:id'  component={detailId}></Route> 
    <Redirect to="/home" from='/' /> 
</Switch>
```

当路由为/detail/1时，只会访问匹配组件detail, 所以需要在detail路由上加上exact:
```javascript
<Switch> 
    <Route path='/home'  component={Home}></Route>
    <Route path='/login'  component={Login}></Route> 
    <Route path='/detail' exact  component={detail}></Route> 
    <Route path='/detail/:id'  component={detailId}></Route> 
    <Redirect to="/home" from='/' /> 
</Switch>
```

> 注意：如果路由 Route 外部包裹 Switch 时，路由匹配到对应的组件后，就不会继续渲染其他组件了。但是如果外部不包裹 Switch 时，所有路由组件会先渲染一遍，然后选择到匹配的路由进行显示。

## 导航组件: Link 和 NavLink

Link 和 NavLink 都可以用来指定路由跳转，NavLink 的可选参数更多。

### Link

两种配置方式：

1. 通过字符串执行跳转路由
```javascript
<Link to='/login'>
    <span>登录</span>
</Link>
```

2. 通过对象指定跳转路由
   
pathname: 表示要链接到的路径的字符串。  
search: 表示查询参数的字符串形式。  
hash: 放入网址的 hash，例如 #a-hash。  
state: 状态持续到 location。通常用于隐式传参（埋点），可以用来统计页面来源  
```javascript
<Link to={{
        pathname: '/login',
        search: '?name=cedric',
        hash: '#someHash',
        state: { fromWechat: true }
    }}>
    <span>登录</span>
</Link>
```

点击链接 进入 Login 页面后，就可以在this.props.location.state中看到 fromWechat: true:

### NavLink
可以看做 一个特殊版本的 Link，当它与当前 URL 匹配时，为其渲染元素添加样式属性。

```javascript
<Link to='/login' activeClassName="selected">
    <span>登录</span>
</Link>
<NavLink
  to="/login"
  activeStyle={{
    fontWeight: 'bold',
    color: 'red'
   }}
>
    <span>登录</span>
</NavLink>
```
exact: 如果为 true，则仅在位置完全匹配时才应用 active 的类/样式。  
strict: 当为 true，要考虑位置是否匹配当前的URL时，pathname 尾部的斜线要考虑在内。  
location 接收一个location对象，当url满足这个对象的条件才会跳转  
isActive: 接收一个回调函数，只有当 active 状态变化时才能触发，如果返回false则跳转失败  

```javascript
const oddEvent = (match, location) => {
  if (!match) {
    return false
  }
  const eventID = parseInt(match.params.eventID)
  return !isNaN(eventID) && eventID % 2 === 1
}

<NavLink
  to="/login"
  isActive={oddEvent}
>
login
</NavLink>
```

## Redirect

<Redirect> 将导航到一个新的地址。即重定向。

```javascript
<Switch> 
    <Route path='/home' exact component={Home}></Route>
    <Route path='/login' exact component={Login}></Route> 
    <Redirect to="/home" from='/' exact /> 
</Switch>
```

上面，当访问路由‘/’时，会直接重定向到‘/home’。

<Redirect> 常在用户是否登录：

```javascript
class Center extends PureComponent {
    render() {
        const { loginStatus } = this.props;
        if (loginStatus) {
            return (
                <div>个人中心</div>
            )
        } else {
            return <Redirect to='/login' />
        }
    }
}
```
也可使用对象形式：
```javascript
<Redirect
  to={{
    pathname: "/login",
    search: "?utm=your+face",
    state: { referrer: currentLocation }
  }}
/>
```

## withRouter
withRouter 可以将一个非路由组件包裹为路由组件，使这个非路由组件也能访问到当前路由的match, location, history对象。
```javascript
import { withRouter } from 'react-router-dom';

class Detail extends Component {
    render() {
        ··· ···
    } 
}
 
const mapStateToProps = (state) => {
    return {
        ··· ···
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ··· ···
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detail));
```

1. 编程式导航 - history 对象
例如，点击img进入登录页：
```javascript
class Home extends PureComponent {

    goHome = () => {
        console.log(this.props);
        
        this.props.history.push({
            pathname: '/login',
            state: {
                identityId: 1
            }
        })
    }

    render() {
        return (
            <img className='banner-img' alt='' src="img.png" onClick={this.goHome} />
        )
    } 
}
```

history 对象通常会具有以下属性和方法：

length - (number 类型) history 堆栈的条目数  
action - (string 类型) 当前的操作(PUSH, REPLACE, POP)  
location - (object 类型) 当前的位置。location 会具有以下属性：  
pathname - (string 类型) URL 路径  
search - (string 类型) URL 中的查询字符串  
hash - (string 类型) URL 的哈希片段  
state - (object 类型) 提供给例如使用 push(path, state) 操作将 location 放入堆栈时的特定 location 状态。只在浏览器和内存历史中可用。  
push(path, [state]) - (function 类型) 在 history 堆栈添加一个新条目  
replace(path, [state]) - (function 类型) 替换在 history 堆栈中的当前条目  
go(n) - (function 类型) 将 history 堆栈中的指针调整 n  
goBack() - (function 类型) 等同于 go(-1)  
goForward() - (function 类型) 等同于 go(1)  
block(prompt) - (function 类型) 阻止跳转。   
注意，只有通过 Route 组件渲染的组件，才能在 this.props 上找到 history 对象  
所以，如果想在路由组件的子组件中使用 history ，需要使用 withRouter 包裹:  
```javascript
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

class 子组件 extends PureComponent {

    goHome = () => {
        this.props.history.push('/home')
    }


    render() {
        console.log(this.props)
        return (
            <div onClick={this.goHome}>子组件</div>
        )
    }
}

export default withRouter(子组件);
```

## 路由过渡动画
```javascript
import { TransitionGroup, CSSTransition } from "react-transition-group";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Fragment> 
          <BrowserRouter>
            <div>
              <Header />
              
              {/* 最外部的<Route></Route>不进行任何路由匹配，仅仅是用来传递 location */}
              
              <Route render={({location}) => {
                console.log(location);
                return (
                  <TransitionGroup>
                    <CSSTransition
                      key={location.key}
                      classNames='fade'
                      timeout={300}
                    >
                      <Switch>
                        <Redirect exact from='/' to='/home' />
                        <Route path='/home' exact component={Home}></Route>
                        <Route path='/login' exact component={Login}></Route>
                        <Route path='/write' exact component={Write}></Route>
                        <Route path='/detail/:id' exact component={Detail}></Route>
                        <Route render={() => <div>Not Found</div>} />
                      </Switch>
                    </CSSTransition>
                  </TransitionGroup>
                )
              }}>
              </Route>
            </div>
          </BrowserRouter>
        </Fragment>
      </Provider>
    )
  }
}

.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}
```

## 打包部署的路由配置
项目执行npm run build后，将打包后的build文件当大 Nginx 配置中。

如果 react-router 路由 使用了 history 模式（即<BrowserRouter>），那么在 Nginx 配置中必须加上:

```javascript
location / {
        ··· ···
        try_files $uri /index.html;
        ··· ···
        }
    }
```
如果 react-router 路由 使用了 hash 模式(即<HashRouter>)，那么在 Nginx 中不需要上面的配置。