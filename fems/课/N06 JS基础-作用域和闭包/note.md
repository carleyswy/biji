# 作用域
作用域：变量合法使用范围
```javascript
// a 作用域 start
let a=0   
function fn1() {
    // a1 作用域 start
    let a1 = 100  

    function fn2() {
        // a2 作用域 start
        let a2=200  

        function fn3() {
            // a3 作用域 start
            let a3=300  
            return a + a1 + a2 + a3
            // a3 作用域 end
        }  
        fn3()
        // a2 作用域 end
    }  
    fn2()
    // a1 作用域 end
}  
fn1()
// a 作用域 end
```
> 全局作用域
> 函数作用域
> 块级作用域 let const有块级作用域，var没有
```javascript
// 块级作用域
if (true) {
    let x = 100
}
console.log(x) // 会报错
```

# 自由变量
> 一个变量在当前作用域没有定义，但被使用了
> 向上级作用域，一层一层依次寻找，直到找到为止
> 如果到全局作用域都没有找到，则报错*** is not defined

# 闭包
- 函数作为参数被传递
- 函数作为返回值被返回  
自由变量的查找，是在函数定义的地方，向上级作用域查找，不是在执行的时候向上级作用域查找

```javascript
function print(fn){
    let a=200
    fn()
}
let a=100
function fn(){
    console.log(a)
}
print(fn)
// 100
```

```javascript
function create(){
    let a=100
    return function(){
        console.log(a)
    }
}

let fn=create()
let a=200
fn()
// 100
```

# this
1 作为普通函数 (window)  
2 使用call apply bind (传入什么绑定什么)   
3 作为对象方法被调用 （对象本身）  
4 在class方法中调用 （当前实例本身）   
5 箭头函数 （上级作用域this的值）  
this取值由函数执行的时候确定，不是在函数定义的时候确定，谁调用指向谁  
特殊：箭头函数里this是定义时的上级作用域的this
```javascript
// 1 作为普通函数 
function fn1(){
    console.log(this)
}
fn1() // window
// 相当于 
window.fn1();

// 2 使用call apply bind
fn1.call({x: 100}) // {x: 100}
const fn2=fn1.bind({x: 200})
fn2() // {x: 200}
```

```javascript
// 3 作为对象方法被调用  
const zhangsan = {
    name: 'zhangsan',
    sayHi() {
        console.log(this)
    },
    wait(){
        setTimeout(function(){
            // 这个function是setTimeout触发执行
            console.log(this)
        })
    }
}
zhangsan.sayHi() //zhangsan
zhangsan.wait() //window

const zhangsan = {
    name: 'zhangsan',
    sayHi() {
        console.log(this)
    },
    wait(){
        setTimeout(() => {
            console.log(this)
        })
    }
}
zhangsan.sayHi() //zhangsan
zhangsan.wait() //zhangsan
```

```javascript
class People{
    constructor(name) {
        this.name= name
        this.age=20
    }
    sayHi(){
        console.log(this)
    }
}
const zhangsan = new People('zhangsan')
zhangsan.sayHi() // zhangdan
```



# 题目
## 1.this的不用应用场景，如何取值
见上

## 2 手写bind函数
## 3 实际开发中闭包的应用
应用:闭包隐藏数据，只提供api
```javascript
function createCache(){
    const data = {} // 闭包中的数据被隐藏，外界无法访问
    return {
        set: function (key, val){
            data[key] = val;
        },
        get: function (key){
            return data[key]
        }
    }
}

const c = createCache()
c.set('a', 100)
console.log(c.get(a)) //100 
// 这个a只能通过set get改变和获得，不能通过其他方式
```

## 4 创建10个a标签，点击的时候弹出对应的序号
```javascript
let a;
for (let i=0; i<10; i++) {
    a = document.createElement('a');
    let t = document.createTextNode(i)
    a.setAttribute('id', i);
    a.setAttribute('href', "#");
    a.addEventListener('click', (e)=>{
        console.log(i,e)
    })
    a.appendChild(t)
    document.body.appendChild(a)
}
```
