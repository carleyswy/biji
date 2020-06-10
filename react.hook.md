# react hook

React 16.8.0 是第一个支持 Hook 的版本。

Hook 是什么？ Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。

## State Hook

### 声明 State 变量

```javascript
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量
  const [count, setCount] = useState(0);

```
useState 方法  
声明一个叫 “count” 的 state 变量  
参数: 初始 state  
返回值: 有两个值的数组，当前 state 以及更新 state 的函数  
数组解构  
我们声明了一个叫 count 的 state 变量，然后把它设为 0。React 会在重复渲染时记住它当前的值，并且提供最新的值给我们的函数。我们可以通过调用 setCount 来更新当前的 count。

### 读取 State
```javascript
  <p>You clicked {count} times</p>
```
在函数中，我们可以直接用 count

### 更新 State
```javascript
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## 使用多个 state 变量
将 state 变量声明为一对 [something, setSomething] 也很方便，因为如果我们想使用多个 state 变量，它允许我们给不同的 state 变量取不同的名称：
```javascript
function ExampleWithManyStates() {
  // 声明多个 state 变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
```

## Effect Hook
Effect Hook 可以让你在函数组件中执行副作用操作  
数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用。

useEffect告诉 React 组件需要在渲染后执行某些操作。

如果你熟悉 React class 的生命周期函数，你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

### 无需清除的 effect

```javascript
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```
我们声明了 count state 变量，并告诉 React 我们需要使用 effect。紧接着传递函数给 useEffect Hook。此函数就是我们的 effect。然后使用 document.title 浏览器 API 设置 document 的 title。

每次重新渲染，都会生成新的 effect，替换掉之前的。

将 useEffect 放在组件内部让我们可以在 effect 中直接访问 count state 变量（或其他 props）。

默认情况下，useEffect 在第一次渲染之后和每次更新之后都会执行。

### 需要清除的 effect

```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

每个 effect 都可以返回一个清除函数。

React组件在  
1. 第一次渲染后，每次要重新渲染时  
2. 卸载时  

都会清除操作  

```javascript
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

下面按时间列出一个可能会产生的订阅和取消订阅操作调用序列：  
```javascript
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // 运行第一个 effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // 运行下一个 effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // 运行下一个 effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 清除最后一个 effect
```



### 使用多个 Effect 实现关注点分离
Hook 允许我们按照代码的用途分离他们

```javascript
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
  }
  ```

  ### 通过跳过 Effect 进行性能优化
  传递数组作为 useEffect 的第二个可选参数  

  ```javascript
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 仅在 count 更改时更新
  ```
  ```javascript
  useEffect(() => {
    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  }, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
  ```

  如果你要使用此优化方式，请确保数组中包含了所有外部作用域中会随时间变化并且在 effect 中使用的变量，否则你的代码会引用到先前渲染中的旧变量。

  如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。







