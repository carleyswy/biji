
### 全局安装create-react-app
npm install -g create-react-app

### 创建一个react项目
create-react-app payh
cd payh
npm start payh

### react简单结构
```html
<div id="root"></div>
```
```javascript
ReactDOM.render(
    <App />, document.getElementById('root')
);
```
```javascript
function App(){
    return (
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
            Edit <code>src/App.js</code> and save to reload.
            </p>
        </header>
        </div>
    )
}
```

### key
```javascript
// 位置
const alitag = ali.map((v)=><li key={v}>{v+'2'}</li>)  
const alitag2 = ali.map((v) => <ListItem iv={v} key={v} />)

// 需要保证，在同一个数组中的兄弟元素之间的 key 是唯一的
// 不需要在整个应用程序甚至单个组件中保持唯一
```

### 阻止事件冒泡
```javascript
//e.stopPropagation()
e.nativeEvent.stopImmediatePropagation();
```

### React-Redux
Redux的实现流程   
用户页面行为触发一个Action，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action。Reducer 会返回新的 State 。每当state更新之后，view会根据state触发重新渲染。   

react-redux的实现原理   
react-redux是一个轻量级的封装库，它主要通过两个核心方法实现：  
Provider：从最外部封装了整个应用，并向connect模块传递store。
Connect：    
    1、包装原组件，将state和action通过props的方式传入到原组件内部。   
    2、监听store tree变化，使其包装的原组件可以响应state变化   


store文件夹
action.js
```javascript
import * as constants from './constants';

export const _setLang = (value) => ({
    type: constants.SET_LANG,
    lang: value
})

export const _setLanguage = (value) => ({
    type: constants.SET_LANGUAGE,
    language: value
})
```
constants.js
```javascript
export const SET_LANG = 'setLang';
export const SET_LANGUAGE = 'setLANGUAGE';
```
reducer.js  state
```javascript
import * as constants from './constants';

const defaultState = {
	lang: 0,
	language: 'en_US'
}

export default (state=defaultState, action)=>{
    switch (action.type) {
        case constants.SET_LANG:
            state.lang = action.lang;
            return state;
        case constants.SET_LANGUAGE:
            state.language = action.language
            return state;
        default:
            return state;
    }

}
```
index.js  
```javascript
import reducer from './reducer';
import * as action from './action';
import * as constants from './constants';
import { createStore, compose, applyMiddleware } from "redux";

let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware()));

export {
    store,
    action,
    constants
}
```

最外层
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as store from "./store";
import { Provider } from "react-redux";


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store.store}>
    <App c="er" f="fr" />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

具体使用
```javascript
import { useSelector, useDispatch } from "react-redux";
import * as storeredux from "./store";

const storestate = useSelector(state => state);
console.log(storestate);
const dispatch = useDispatch();

dispatch(storeredux.action._setLang(1));
  
```

### 生命周期
#### 挂载阶段
##### constructor   useState
##### static getDerivedStateFromProps
##### render   函数本身
##### componentDidMount  useEffect

#### 更新阶段
##### static getDerivedStateFromProps
##### shouldComponentUpdate   useMemo
##### render
##### getSnapshotBeforeUpdate
##### componentDidUpdate  useEffect

#### 卸载阶段
##### componentWillUnmount    useEffect 里面返回的函数


### 虚拟dom和diff算法

虚拟DOM是由state数据和JSX模板结合生成的，它的本质是一个JS对象，用它来描述真实的DOM。react会把这个虚拟DOM抽象成一个DOM树，当state数据改变，state数据和JSX模板 会生成新的虚拟DOM，通过Diff算法来对比新旧两个虚拟DOM，找到其中的不同，进而改变真实的DOM结构，来渲染页面的。

```javascript
// 真实dom
<div id="text">
    <span>hello word</sapn>
</div>

//虚拟dom
['div',{'id':'abc'},['span',{},'hello word']]


//在render函数中
redder(){
    return <div>Hello Word</div>
    //等同于
    return React.createElement('div',{},'item');
}

```

传统 Diff 算法通过循环递归对节点进行依次对比，效率低下 ,自然达不到我们追求的性能高效的效果，react对Diff重新算法进行了优化。

react的Diff算法是将拥有相同类的两个组件生成相似的树形结构，然后对DOM树进行逐层的节点比较，并且是只会比较同一层次的节点。如图所示，它只会对相同颜色的节点经行比对。如果某一个节点发生了改变，那么它和它的子节点都会被删除，重新生成新的DOM树节点。

其中，对于同一层级的一组子节点，通过唯一id进行区分，也就是我们经常用到的key，新旧两个虚拟DOM通过这唯一的标识进行匹配对比。所以在项目中，我们尽量不要去用index去作为key值，因为在进行一些增加和删除操作中，index会随之变化，不是唯一的标识，这就给Diff算法带来了不便，不但在性能上增加了损耗，还可能带来一些bug。

https://blog.51cto.com/12885303/2155227

### setState
1, setState就出现了，它帮助我们更改数据的同时并且通知视图进行渲染。
2, 性能优化，可以认为setState是异步的，React在setState之后，会经对state进行diff，判断是否有改变，然后去diff dom决定是否要更新UI。如果这一系列过程立刻发生在每一个setState之后，就可能会有性能问题。在短时间内频繁setState。React会将state的改变压入栈中，在合适的时机，批量更新state和视图，达到提高性能的效果。

