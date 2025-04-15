# React 基础部分

## react 的特征

react概念：用于构建用户界面的 JavaScript 库，提供了 UI 层面的解决方案

react有几个特征：虚拟dom树，jsx语法，组件化，单向数据流
- jsx：语法 1.只能有一个根节点；但是可以相互嵌套
        2.换行或者多标签最好加括号,防止js自动分号不往后执行；
- 虚拟dom：
1.虚拟DOM是在DOM的基础上建立了一个抽象层，对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟DOM，最后再批量同步到DOM中。
2.在React中，render执行的结果得到的并不是真正的DOM节点，而仅仅是JavaScript对象，称之为虚拟DOM。
- 组件化：
1.每一个React文件都是一个组件，含视图、逻辑操作、数据
2.组件可以被嵌套到其他组件之中
3.注意组件声明需要首字母大写，如`<TodoList />`
- 单向数据流
1.子组件对于父组件传递过来的数据是【只读】的
2.子组件不可直接修改父组件中的数据，只能通过调用父组件传递过来的方法，来间接修改父组件的数据，形成了单向清晰的数据流
- 声明式编程
1.声明式编程表明想要实现什么目的，应该做什么，但是不指定具体怎么做。
2.声明式点一杯酒，只要告诉服务员：我要一杯酒即可；

react的优势：
 - 高效灵活
 - 声明式的设计，简单使用
 - 组件式开发，提高代码复用率
 - 单向响应的数据流会比双向绑定的更安全，速度更快

react有函数组件和类组件：类组件有this指向，状态和生命周期，函数组件没有，只有hooks，Hooks是16.8版本才新增的，给函数组件用的，让函数组件拥有类组件的功能

## jsx 语法


JSX是React的核心组成部分，它使用XML标记的方式去直接声明界面，界面组件之间可以互相嵌套。可以理解为在JS中编写与XML类似的语言,一种定义带属性树结构（DOM结构）的语法
可以通过各种编译器将这些标记编译成标准的JS语言。
可以定义包含属性的树状结构的语法，类似HTML标签那样的使用，而且更便于代码的阅读。

使用JSX语法后，你必须要引入babel的JSX解析器，把JSX转化成JS语法，这个工作会由babel自动完成。同时引入babel后，你就可以使用新的es6语法，babel会帮你把es6语法转化成es5语法，兼容更多的浏览器。


## 函数组件和 class 组件区别


函数组件纯函数，输入 props，输出 jsx
函数组件没有实例，没有生命周期，没有 state
函数组件不能扩展其他方法
class 创建的组件,有自己的私有数据(this.state)和生命周期


## MVC 和 MVVM 的区别

- MVC 和 MVVM 都是常见的软件架构思想
- MVC
  - model: 数据层
  - view: 视图层
  - controller: 控制层
- MVC 的通信方式： view -> controller -> model -> view
- MVVM
  - model: 数据层
  - view: 视图层
  - viewModel: 视图模型层
- MVVM 的通信方式： view <-> viewmodel -><- model

## 生命周期

- **初始化阶段**
constructor 是一个特殊的函数，当这个类被实例化的时候，自动执行，最先执行，只执行一次
初始化 props 和 state
- **挂载阶段**
UNSAFE\_ 前面有这个的就是被废弃了 带 Will 的一般都被废弃了 16.3 版本
_UNSAFE_componentWillMount()_
_render()_ - return 标签渲染页面
_componentDidMount()_
数据请求 这里面基本上什么都可以写了
只能在 componentDidMount 里面请求数据 由于 fiber 算法的存在 在别的生命周期里每个片都会请求一次数据多次请求
- **数据更新阶段**
    - _shouldComponentUpdate()_
    作用：使用 shouldComponentUpdate 就是为了减少 render 不必要的渲染
    一定要返回一个布尔值
    里面手动判断页面是否需要渲染
    shouldComponentUpdate 提供了两个参数 nextProps 和 nextState，表示下一次 props 和一次 state 的值，当函数返回 false 时候，render()方法不执行，组件也就不会渲染，返回 true 时，组件照常重渲染
    当传递的是一个复杂对象时由于地址不相同所以就没用了
    解决：
    1. 使用 setState 改变数据之前，先采用 es6 中 assgin 进行拷贝，但是 assgin 只深拷贝的数据的第一层，所以说不是最完美的解决办法。
    2. 使用 JSON.parse(JSON.stringfy())进行深拷贝，但是遇到数据为 undefined 和函数时就会错。
    3. 使用 immutable.js 进行项目的搭建。immutable 中讲究数据的不可变性，每次对数据进行操作前，都会自动的对数据进行深拷贝，项目中数据采用 immutable 的方式，可以轻松解决问题，但是又多了一套 API 去学习
   immutable.js
   Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象
   Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享
   - _UNSAFE_componentWillUpdate() {}_
   - _componentWillReceiveProps_
   - _componentWillUpdate()_
   - _render()_
   - _componentDidUpdate()_

- **销毁阶段**
_componentWillUnmount_
清除定时器，断开 websocket，取消事件监听，卸载第三方插件

## 深浅拷贝

- 浅拷贝,拷贝一级，如果是对象里面还有对象,无法解决
    1. for… in… 循环
    2. Object.assgin() 缺点：非常消耗性能 比如一个对象中某一个数据改变 会导致整个数据的地址改变 消耗内存 所以有了 immutable
    3. ...扩展运算符
- 深拷贝
    1. JSON.parse(JSON.stringify( )) 缺点：当对象的 value 是函数 或者 undefined 时会失效
    2. 用 for…in…+递归
- 递归实现深拷贝代码
思路：
1. 创建一个空对象  一个if条件判断一下这个传进来的是不是个对象
2. 然后遍历对象 用一个obj.hasOwnProperty(key)判断这个key是不是自身的属性
3. 如果obj[key]还是一个对象就递归调用这个函数 如果不是对象就把他赋值给新对象
```JavaScript
    function deepCopy(obj) {
    let objArray = Array.isArray(obj) ? [] : {}; //定义空数组或者空对象
    if (obj && typeof obj === "object") {
    //判断是否是对象
    for (key in obj) {
        //遍历数组或者对象e
        if (obj.hasOwnProperty(key)) {
        //判断当前key是不是对象自身的属性。不包括原型链
        if (obj[key] && typeof obj[key] === "object") {
            objArray[key] = deepCopy(obj[key]);
        } else {
            objArray[key] = obj[key];
        }
        }
    }
    }
    return objArray;
}
```


## 引入样式的三种方法
1. style
   react 里面的 style 只允许写对象
   外面的括号表示 jsx 的括号，里面的括号是对象的括号
   单位是 px 的时候，单位是可以省略的
2. className
   引入外部 css 文件
   react 里面所有的 class 都要改成 className
3. 引入 classnames，用于条件性地加入类名
   import classNames from "classnames/bind"; 引入 classNames
   import styles from "./06-style2.css";引入 css
   定义一个 cx
   let cx = classNames.bind(styles);
   定义一个 className 变量
   let className = cx({
   左边是类名，右边是条件
   red: count === 1,
   green: count === 2,
   });
   最后就可以在组件的标签上写 className = {className}

## 组件通信有哪些方法？

1. 父组件向子组件通信

- 父组件通过向子组件传递 props，子组件得到 props 后进行相应的处理。

2. 子组件向父组件通信

- 利用回调函数，实现子组件向父组件通信：父组件将一个函数作为 props 传递给子组件，子组件调用该回调函数.即可

3. redux
4. createContext
- createContext 用于依赖注入
  context APi 是有响应式的
  父组件的 Provider 和子组件的 Consumer 要来自于同一个对象
  执行以后返回的是一个对象
  const { Provider, Consumer } = createContext();
  提供者 消费者
5. useReducer 一个小型的仓库
  reducer 函数的写法和 redux 一样 defaultState 也一样 state 不用写等于 defaultState 调用的时候引入 useuseReducer 有两个参数
  第一个参数就是 reducer 函数 第二个是 defaultState 从 useReducer 中解构出 state 和 dispatch 调用就调用 state.count dispatch 中传入 type
  const [state, dispatch] = useReducer(reducer, defaultState);
  useReducer 里面没有中间键 不能写异步操作 如果要写异步可以写 useEffect 先请求数据 在吧请求到的数据放到仓库里面

6. useContext
  context 是上下文的意思
  useContext 的使用方法分三步走： - 使用 const x = createContext(null) 创建上下文，在创建时一般不设置初始值，因此为 null，一 般是在指定上下文作用域时初始化。 - 使用 <x.Provider value={}></x.Provider> 圈定上下文的作用域 - 在作用域中使用 const value = useContext(x) 使用上下文的数据
  接收一个 context 对象(React.createContext 的返回值）并返回该 context 的当前值 6. 状态提升 - 就是将子组件的 state 提示到父组件，然后这个父组件的任何子组件就都能使用这个 state，从而达到多个组件之间共享 state 的目的。 - 子传父用自定义事件 - 父传子用自定义属性 - 使用 this.props.onGetCount 触发父组件事件 - bind 可以返回一个新函数，会将 bind 方法的第二个参数作为新函数的第一个参数，并且不会自执行
- 总结：
  父组件向子组件通信：使用 props
  子组件向父组件通信：使用 props 回调
  跨级组件间通信：使用 context 对象，Provider 要写在所有的组件公共的父元素的外面，Provider 必要要有一个 value 属性，Consumer 用于做注入, 里面需要写函数, 接收一个参数是 value
  利用状态管理工具：useReducer redux
  非嵌套组件间通信：使用事件订阅，
  原理就是：即一个发布者，一个或多个订阅者，引入 events,通过 emit 事件触发方法，发布订阅消息给订阅者,通过 emitter.addListener(事件名称,函数名)方法，进行事件监听(订阅)。
  通过 emitter.removeListener(事件名称,函数名)方法 ，进行事件销毁(取消订阅)

## 父子组件传参

父传子是用到自定义属性 在父组件中的子组件标签上写一个自定义属性 子组件通过 props 去获取数据 类组件是通过 this.props 函数组接收一个 props

子传父的话就是用到了自定义事件 在父组件中的子组件标签上写一个自定义事件 在父组件通过 props 去触发子组件的事件

跨级通信就是通过 context 上下文，Context 的执行结果是一个对象 里面有个 Provide 和 Consumer 类似于 vue 中的依赖注入 在公共的父组件的最外层嵌套 Provide 标签并且加上一个 value 属性 这个 value 属性就是传递的数据 子组件呢需要在最外面套上 Consumer 标签 Consumer 里面写函数 可以也有一个形参去接收父组件传递的数据

当然比较复杂的全局组件通信肯定是要用到第三方状态管理工具的像
redux 我之前的项目一般都是用 redux。

## 设计模式 - 发布订阅模式 - 单例模式

发布 — 订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
单例模式
单例模式就是一个实例在整个网页的生命周期里只创建一次，后续再调用实例创建函数的时候，返回的仍是之前创建的实例。在实际开发中应用十分广泛，例如页面中的登录框，显示消息的提示窗

## 发布订阅的实现（基础版）
具体实现场景思路是，有这么一个楼盘正在开发中，小明和小绿（订阅者）要买房，就先订阅了各自的心仪的房间平米数，开发商（发布者）会在楼盘开发完毕后将房间信息发布到对应的买家手机上（发布到对应的事件中）
```JavaScript

//定义发布者
let houseObj = {};// 定义花名册  缓存列表// 如果list是一个数组的话，可读性差，后面取key值（相当于索引值）会进行深拷贝，深拷贝是非常消耗性能的。
houseObj.list = {};// 增加订阅者
houseObj.listen = function (key,fn) {  
    (this.list[key] || (this.list[key] = [])).push(fn); // 订阅消息添加到数组里面  。      	   console.log(this.list);
}// 遍历数组，定向将消息发布给订阅者
houseObj.trigger = function () {    // 取出消息类型  
let key = Array.prototype.shift.call(arguments); // 将arguments由类数组变成了数组，使他具有了数	组的方法，并使用shift取出了数组第一位。    
// 取出对应回调函数的集合    let fns = this.list[key];  
if (!fns || fns.length === 0) {
            return;    
}  
for(let i = 0,fn;fn = fns[i++];){        
    fn.apply(this,arguments); // arguments 是发布消息附带的参数；apply()是将指针从第一个参数转向第二个参数的作用。    }}
/* 订阅 */
// 小明的要求
houseObj.listen('big',function (size) {    console.log('小明：' + size + '平米');})
// 小绿的要求
houseObj.listen('small',function (size) {    console.log('小绿：' + size + '平米');})//发布
houseObj.trigger('big',100);houseObj.trigger('small',80);

```

## 事件处理
- this指向问题
    1．在事件内联的地方bind(this)不推荐，占内存，bind都会产生新函数
    2．在constructor里面this.xxx = this.xxx.bind(this);推荐的写法，可以将每次产生的新函数用变量存起来,不会占用太多内存
    3.   使用箭头函数
    - 事件传参问题
    1．内联地使用bind onclick={this.fn.bind(this, item.id)}不推荐的
    2．内联地使用箭头函数onclick={() => this.fn(item.id)}
    3. 函数柯里化(闭包)
    - 函数柯里化传参：1.事件的括号里面传的值，一般写在外面，2.event对象一般是在里面的

## 受控组件与非受控组件

受控组件与非受控组件 都是基于表单组件的
受控组件: 表单由我们自己来控制的组件
就是包含 value 属性和 onChange 事件的组件 onChange 里面写 setState 改变当前点击的 value 的值赋值给 input 绑定的 value
非受控组件就是，表单交给 react 去控制
只有文件上传一定要使用非受控组件，其他时候都尽量使用受控组件

1. 引入 createRef
2. 定义 ipt = createRef();
3. 表单上加 ref 属性 <input type="text" ref={this.ipt}/>
4. 获取时用 this.ipt.current.value

## hoc 高阶组件


高阶组件是一个函数，这个函数要传入一个组件，并且返回一个新组件
高阶组件的取名一般用 with 开头，后面加功能
作用增强组件的功能,并且可以做复用
传入一个组件 return 一个功能更多的组件

高阶组件-加版权号
```JSX
const withCopy = (Comp) => {
return class extends Component {
    render() {
    return (
            <>
                {/_ {...this.props}是将接收到的 props 全部传递给子组件 _/}
                <Comp num={20} {...this.props}></Comp>
                {/_ <div>&copy;版权所有 千锋教育 2019 </div> _/}
            </>
            );
        }
    };
};
```

## diff 算法 React Fiber 虚拟 dom

- diff 算法
用 js 对象模拟真实的 DOM 结构 当页面更新的时候比对虚拟 dom 和真实 dom 区别 然后在进行更新 只需要更改部分不需要将页面全部重新渲染
但是标准的的 Diff 算法复杂度需要 O(n^3)
虚拟 dom：将真实 dom 转换成变量存到内存中
diff 算法是一种通过同层的树节点进行比较的高效算法
特点：

1. 同级比较
2. key 值比较
3. 类的比较
   拥有相同类的两个组件 生成相似的树形结构，
   拥有不同类的两个组件 生成不同的树形结构。
   React 里结合 Web 界面的特点做出了两个简单的假设来降低算法的复杂度
   1. 两个相同组件产生类似的 DOM 结构，不同的组件产生不同的 DOM 结构；
   2. 对于同一层次的一组子节点，它们可以通过唯一的 id 进行区分

- React Fiber
渲染的时候将一个大的进程拆分成小的片 在每个片结束后查看一下其他的进程 然后运行小一点的进程 再去执行下一个片 例子星巴克
虚拟 DOM
虚拟 dom 相当于在 js 和 真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异把所记录的差异渲染再真实 dom 上，从而提高性能。

## 时间复杂度 空间复杂度

时间复杂度：是指执⾏当前算法所消耗的时间；
空间复杂度：是指执⾏当前算法需要占⽤多少内存空间
常⻅的量级有：常数阶 O(1)，对数阶 O(logN)，线性阶 O(n)，线性对数阶 O(nlogN)，平⽅阶 O(n²)，⽴⽅阶 O(n³)，K
次⽅阶 O(n^k)，指数阶

## protal 将组件放到页面中任意你想放的位置
有时需要将元素渲染到 DOM 中的不同位置上去，这是就用到的 portal 的方法 protal 可以将组件放到页面中任意你想放的位置
引入
import { createPortal } from "react-dom";
第一个参数 child 是可渲染的 react 子项，比如元素，字符串或者片段等。第二个参数 container 是一个 DOM 元素。
例子：对话框 模态框 轻提示
模态框例子
```jsx
// App.jsx
import React, { Component } from "react";
import Modal from "./Modal";
// import { createPortal } from "react-dom";

class App extends Component {
  state = {
    show: false,
  };

  open = (e) => {
    e.stopPropagation();
    this.setState({
      show: true,
    });
  };

  ok = (e) => {
    e.stopPropagation();
    this.setState({
      show: false,
    });
  };

  fn = () => {
    console.log(123);
  };

  render() {
    return (
      // portal的事件冒泡依旧会冒到原先的父元素上面
      <main onClick={this.fn}>
        <h3>对话框</h3>
        <button onClick={this.open}>Open Modal</button>
        {/* {this.state.show && <Modal />} */}
        {/* {createPortal(<Modal />, document.querySelector("body"))} */}

        <Modal
          visible={this.state.show}
          title="Basic Modal"
          okText="确定"
          onOk={this.ok}
        />
      </main>
    );
  }
}

export default App;

```
```jsx
import React, { Component } from "react";
import withPortal from "./withPortal";
import "./style.css";
import { bool, string } from "prop-types";

class Modal extends Component {
  render() {
    // console.log(this.props);
    // return (
    // <div className="modal">
    //   <div className="center">
    //     <h4>Basic Modal</h4>
    //   </div>
    // </div>;
    // );

    return (
      this.props.visible && (
        <div className="modal">
          <div className="center">
            <h4>{this.props.title}</h4>
            <button onClick={this.props.onOk}>{this.props.okText}</button>
          </div>
        </div>
      )
    );
  }
}

Modal.defaultProps = {
  visible: false,
  title: "标题",
};
Modal.propTypes = {
  visible: bool,
  title: string,
};

export default withPortal(Modal);

```

```js
import { Component } from "react";
import { createPortal } from "react-dom";

// 添加portal的高阶组件，很多的对话框都需要加到body上，所以将createPortal提出来
const withPortal = (Comp) => {
  return class extends Component {
    render() {
      return createPortal(
        // 将接收到的所有的props，传递给子组件
        <Comp {...this.props} />,
        document.querySelector("body")
      );
    }
  };
};

export default withPortal;
```

- createPortal 的优点

    1.使用Portal后，界面定制比较灵活，Portlet是一个容器，通过console可以更改Portlet的位置，尺寸，级别，外观等，Portlet内部显示的内容也会随着改变。
    2.Portal有内部安全机制，可以在Portal上面定制角色、组及用户，可以指定哪些资源可以被哪些用户（组、角色）访问，对于那些不符合安全条件的用户登录，则看不到相关的资源。
    3.Portal允许自己利用已经开发好的资源（portlet或者网页）按照自己的喜好定制自己的首页或者网站。提升了网站的可维护性。
    4.Portal软件里面都内置了很多其他方面的组件，比如全文检索，内容管理等。
    5.Portal支持多渠道访问，比如：同一个Portal可以不用修改就可以支持手机、PDA访问。

- createPortal 的缺点

    1.Portal是标准的Web应用，不同厂商的实现不同，有学习曲线和时间成本。
    2.Portal的性能也是一个需要考虑的因素，如果一个页面上Portlet数量比较多，则显示速度会比普通的页面慢很多，如果启用了Portlet的页面级cache，则速度会快很多，但使用Portal后，性能肯定是个问题。
    3.Portal的开发要比普通的开发步骤多，周期长，另外还要考虑一些引入了Portal后带来的技术细节，比如多个Portlet内容来自于多个独立的系统，如果使用iFrame带来的多Session的问题等等。
    4.Portal需要自己做很多工作才能完成的，比如SSO（Single Sign-On 单点登录）。（后面可以不说）
    5.Portal有时候满足不了复杂项目的需要，需要自己二次开发，需要使用更专业的组件或者软件替代，比如内容管理，安全认证等领域。
    6.使用Portal后，对于架构设计及开发过程都会产生很大影响，比如使用特定厂商的Portal产品后，需要使用特特定的IDE才能开发、部署，自动化的测试脚本的作用就会被削弱。

## React 路由

### React5

五版本路由总结 yarn add react-router-dom@5 ( 一般都用 5 版本 6 版本为新版本)
解构出的东西大写的是组件 小写的是方法 with 开头的是高阶组件 hoc 以 use 开头的是 Hocks


1.  如果项目要使用路由，那么项目的最外面要加上 BrowserRouter 组件 直接在出口文件给总的最大的组件套一个 BrowserRouter 标签
    import { BrowserRouter } from "react-router-dom";
2.  在组件中想使用路由的话在父组件引入 Link 这个 link 标签就相当于 a 标签做跳转 link 标签有一个 to 属性做跳转 to= "路径"
    写法:
    import { NavLink, Route, Switch } from "react-router-dom";
3.  对应的每一个 link 标签应该对应一个 Route 标签 Route 标签有两个属性 path="路径" componen = {要渲染的组件名}
4.  Route 标签的渲染属性有四个：

    1. componen = {要渲染的组件名}
    2. render ={
       (props) =>{
       return < 要渲染的组件名 （如果要传递 props 加 {...props}）/>
       }
       }
    3. children={Mine}
    4. 
    ```jsx
        <Route path="/detail">
            <Detail />
        </Route>
    ```
    - _区别_
    路由里面最常见的渲染组件的属性是 component
    component 可以渲染类组件和函数组件

           render属性页可以渲染组件，render属性只能渲染函数组件
           render后面是可以写函数的, 那么就可以去加入逻辑判断

           children属性也可以渲染组件，也只能渲染函数组件
           不管url是否匹配，都会渲染
           如果加了Switch，那么就和render的效果一摸一样

           在Route组件的里面，直接写组件， 可以渲染类组件和函数组件
           这种方式默认是拿不到路由信息的, 除非配合withRouter高阶组件

5.  react 的路由是包容性路由 (vue 的路由是排他性路由)
    用 Switch标签套在Route标签外面，如果你要匹配多个路由，你得在外面加一个盒子，确保唯一子元素，读取时从上往下读，只要有一个匹配就不往下匹配了

    exact 表示精准匹配
    Switch 表示 分支匹配， 将包容性路由变成排他性路由

    注意：

    - Vue 是排他性路由，react 默认是包容性路由
    - react 默认是 history 模式
    - exact 表示精准匹配
    - Switch 表示 分支匹配， 将包容性路由变成排他性路由
    - 如果要做二级路由的时候，一级路由不能用精准匹配
    - 路由信息要全部来自于 props

6.  路由嵌套 - 二级/多级路由
    在嵌套的子组件 也就是二级路由里面在写一个路由 link 标签 对应的 route 标签 这个组件的 props 里面就会有路由信息
    // ?. 可选链操作符 - 如果有这个属性就打印如果没有就不打印
    console.log(this.props.match?.params?.id);

7.  路由重定向
    import { Link, Route, Switch, Redirect } from "react-router-dom";
    从 react-router-dom 中解构出 Redirect 在和Route标签平级的地方写重定向标签
    ```jsx
        <Redirect from="要改变的路径" to="要改成什么路径" exact></Redirect>
    ```

8.  路由鉴权
    基础原理：
    把 Route 标签里面的渲染属性换成 render 里面就可以写逻辑判断了 判断 localstorage 里面是否存在 token 如果有就是登陆过 然后 return 一个要渲染成的组件 不过不存在 token 渲染登录页的组件
    写法：
    ```jsx
        <Route
        path="/mine"
        render={() => {
        if (localStorage.getItem("token")) {
        return <Mine />;
        } else {
        return <Redirect from="/mine" to="/login"></Redirect>;
        }
        }} >
        </Route>
    ```
    封装组件：
    原理：自定义一个组件 用这个组件去替换 route 标签 这个组件 return 一个 Route 标签
    写法：
    ```jsx
        // 标签部分：
        <Auth path="/mine">
        <Mine />
        </Auth>
        // 组件部分：
        const Auth = (props) => {
                return (
                <Route
                    path={props.path}
                    render={() => {
                        if (localStorage.getItem("token")) {
                        return props.children;
                        } else {
                            return (
                            <Redirect
                            from={props.path}
                            to={`/login?from=${props.path}`} ></Redirect>
                            );
                        }
                }} ></Route>
            );
        };
    ```

9.  404 页面
    404 页面一定要写在 Route 的最下面， Switch 不能少
    在所有 route 的最下面写 404 页面的 route 标签
    ```jsx
    <Route path="*" component={Not}></Route>
    ```

10. link 标签高亮
    // NavLink 具有 Link 所有的功能，并且会多一个高亮的效果
    引入的时候引入 NavLink，去替换 Link
    NavLink 标签会多一个类名 active 为这个类名添加样式即可
    添加样式尾元素写法：
    .active::before {
    content: ">";
    }

11. 让函数组件有类组件的功能 Hocks
    引入 useHistory，useParams，useLocation
    import {
    Link,
    Route,
    Switch,
    useHistory,
    useParams,
    useLocation,
    } from "react-router-dom";
    在组件里直接打印 Hocks 调用的结构就有了
    hooks 是 react16.8 版本新增的， 只能给函数组件使用
    帮助函数组件拥有类组件的功能
    所有的 hooks 都是函数
    hooks 的调用必须在函数组件的顶层

12. 路由模块化
路由分为前端路由和后端路由，后端路由是服务器根据用户发起的请求而返回不同内容，前端路由是客户端根据不同的 URL 去切换组件；在 web 应用前端开发中，路由系统是最核心的部分，当页面的 URL 发生改变时，页面的显示结果可以根据 URL 的变化而变化，但是页面不会刷新。


- BrowserRouter 与 HashRouter 的区别：
（1）底层原理不一样：BrowserRouter 使用的是 H5 的 history API，不兼容 IE9 及以下版本；HashRouter 使用的是 URL 的哈希值；
（2）path 表现形式不一样：BrowserRouter 的路径中没有#,例如：localhost:3000/demo/test；HashRouter 的路径包含#,例如：localhost:3000/#/demo/test；
（3）刷新后对路由 state 参数的影响：BrowserRouter 没有任何影响，因为 state 保存在 history 对象中；HashRouter 刷新后会导致路由 state 参数的丢失；

### React-Router6

六版本路由和五版本区别总结 yarn add react-router-dom
解构出的东西大写的是组件 小写的是方法 with 开头的是高阶组件 hoc 以 use 开头的是 Hocks

1. Switch 组件没有了 改成了 Routes， 并且 Routes 是不能少的， 会变成排他性路由 Routes 里面只能放 Route

2. 渲染组件只剩 element 一种了，里面写的是实例化的结果或者元素
   不需要加 exact，也是精准匹配
   用 element 渲染出来的组件全都是没有路由信息的
   想要有路由信息就要用 hocks
   <!-- <Route path="/" element={<Home />}></Route> -->

3. 路由嵌套 需要引入 Outlet 组件 相当于 props.children 在 Routes 里面直接做嵌套

4. link 标签里面可以传 pathname search hash state(看不见的数据传递 不显示在地址栏上面)
```jsx
   <Link
        to={{
        pathname: "/about",
        search: "?a=3&b=4",
        hash: "#abc",
        state: {
            x: 10,
            y: 20,
        },
        }}
    >
        about
    </Link>
```

5. 编程式导航
   在组件里写一个单击事件 引入 useNavigate
   const navigate = useNavigate();
   const jump = () => {
   // 直接写路径相当于 push
   // navigate("/detail/888");

   // 相当于 replace
   // navigate("/home", { replace: true });

   // 直接写数字相当于 go 方法
   navigate(-2);
   };

6. 重定向
   Navigate 组件用于做重定向
   ```jsx
   <Route path="/" element={<Navigate to="/home"></Navigate>}></Route>
   ```

### hash 和 history
- hash
是指 url 中#后面的部分，虽然出现在 URL 中，但不会被包括在 HTTP 请求中，这部分在服务器中会自动被忽略，但是在浏览器中可以通过 location.hash 来获取。主要是用到了，window.hashchange 事件，这个事件可以监听 url 中的 hash 值变化来进行 dom 操作。
onhashchange 事件触发的条件：
改变 url 地址，在最后面增加或者改变 hash 值
改变 location.herf 或者 location.hash
点击带有锚点的链接
浏览器前进后退可能会导致 hash 的变化，就是两个网页地址的 hash 值不同
实现思路：当浏览器地址栏 URl 的 hash 值发生改变时，就会触发 onhashchange 事件，这是需要通过 window.location.hash 可以拿到当前浏览器的 url 的 hash 值，执行不同的回调函数，加载不同的组件。
- history
利用 window.history 的 api：
主要使用到了 history.pushState()和 history.replaceState()这两个接口。二者均接收三个参数，分别是 state，title，url，
state 用来存放将要插入 history 实体的相关信息，是一个 json 格式的参数； title 是传入 history 实体的标题，firefox 现在会自动忽略掉这个属性；
url 用来传递新的 history 实体的相对路径，如果其值为 null 则表示当前要插入的 history 实体与前一个实体一致，没有改变。
两者唯一的区别在于 replaceState()方法会将最新一条的 history 实体覆盖掉，而不是直接添加。
这两个方法都不会主动触发浏览器页面的刷新，只是 history 对象包括地址栏的内容会发生改变，当触发前进后退等 history 事件时才会进行相应的响应
- 区别：
Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

### 路由鉴权

可以在 route 中的 render 上直接做判断
定义一个 auth 的函数组件，传入一个 props，里面 path 就是 props.path
里面 render 的时候做判断 一般都是判断登没登陆过 判断 localStorage 是否有 token，如果有的话就渲染组件，如果没有的话就重定向到登录页面。

### 路由懒加载

- 从react中解构出lazy和Suspense
- lazy函数传入回调函数，回调函数用import
    例：const Child = lazy(() => import("./Child"));
- lazy方法要和Suspense组件一起使用
- Suspense组件需要有一个fallback属性，里面写组件，当这个要引得组件还没有引来得时候渲染
- suspense要放在要做懒加载的组件外面
    例：<Suspense fallback={<div>loading...</div>}>
        {this.state.isShow && <Child />}
        </Suspense>

### 自定义标签代替 a 标签跳转
- 自定义一个组件，这个组件要去做编程式导航
- 在组件中添加list，渲染出来
- 将要做跳转的标签加上点击事件
- 如果要做跳转，首先要拿到路由信息的history对象
- 编程式导航 go/push/replace/goBack

## fetch 和 axios 的区别

1. axios 是一个基于 Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生 XHR 的封装，只不过它是 Promise 的实现版本，符合最新的 ES 规范，它本身具有以下特征：

- 自动转换 JSON 数据 fetch 不可以 这也就是为什么 axios 只需要一步.then
- axios 是一个基于 Promise 封装的一个 ajax 库 可以避免回调地狱 可以使用 async + await 实现同步代码
- axios 可以做拦截 请求数据之前可以做一些业务逻辑的判断 比如说判断有没有 token 如果没有 token 就取消这次请求 请求后也可以进行拦截
- 从浏览器中创建 XMLHttpRequest
- 客户端支持防止 CSRF
- 提供了一些并发请求的接口（重要，方便了很多的操作）
- 从 node.js 创建 http 请求
- 拦截请求和响应
- 转换请求和响应数据
- 超时取消请求

2. fetch 优势：
   语法简洁，更加语义化
   基于标准 Promise 实现，支持 async/await
   同构方便，使用 isomorphic-fetch
   更加底层，提供的 API 丰富（request, response）
   脱离了 XHR，是 ES 规范里新的实现方式 3. fetch 存在问题

- fetch 只对网络请求报错，对 400，500 都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
- fetch 默认不会带 cookie，需要添加配置项： fetch(url, {credentials: 'include'})
- fetch 不支持 abort，不支持超时控制，使用 setTimeout 及 Promise.reject 的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
- fetch 没有办法原生监测请求的进度，而 XHR 可以

## redux 具体流程 saga


1.  创建一个仓库文件夹
2.  从 redux 里面解构出来 createStore 定义一个 store 常量等于 createStore(reducer) 把仓库暴露出去
3.  在 createStore 里面要写一个参数 reducer 一般 reducer 都是建一个单独的 reducer 文件
4.  reducer 里面定义一个 reducer 函数并暴露出去 定义一个 defaultstate 作为 reducer 第一个参数的默认值 reducer = (state = defaultstate , action)
5.  reducer reducer 为纯函数 （一个函数的返回结果只依赖其参数，并且执行过程中没有副作用。）
    有两个参数 第一个参数是 state = defaultstate 是状态里面存放数据 第二个参数是 action 用于接收组件传递的参数
    写法：
    ```js
    const reducer = (state = defaultState, action) => {
        // type 的不同表示我们要做不同的事情
        switch (action.type) {
            case "increment":
            // 返回出来的对象会去覆盖以前的 state 对象
            return {
            // 将没有进行修改的数据全部保留下来
            ...state,
            count: state.count + 1,
            };
            case "decrement":
            // 返回出来的对象会去覆盖以前的 state 对象
            return {
            // 将没有进行修改的数据全部保留下来
            ...state,
            count: state.count - action.num,
            };
            default:
            return state;
        }
    };
    ```
6.  在入口文件引入 react-redux 并解构出 Provide 引入 store 然后 用```<Provide store = {store}></Provide>```将引入的标签包起来 然后再在组件中从 react-redux 中解构出 { connect } 组件因为他的执行结果是一个高阶组件所以暴露的时候用 connect(mapStateToProps, mapDispatchToProps)(App)

7.  connect 中有两个参数 mapStateToProps 和 mapDispatchToProps 意思是把仓库中的数据映射到 props 里面 用 this.props 可以调用
    也可以不用 connect 可以使用 react-redux 提供的两个 hocks useSelector 和 useDispatch 这两个分别是获取仓库数据和调用仓库的方法的
    **怎么使用：**
    useSelector：
    定义一个变量去接收 useSelector 的参数是一个函数 这个函数的参数就是仓库中的 state 就可以获取数据了
    const list = useSelector((state) => state.list);
    useDispatch：
    定义一个 dispatch 实例 dispatch 调用的时候可以传一个对象作为参数 这个对象就是 reducer 的第二个参数 action 就可以传 type 和数据给仓库

8.  mapStateToProps
    写法 ：
    ```jsx 
    const mapStateToProps = (state) => {
        return {
        // 将仓库的 count，变成组件的 props 的 count
        count: state.count,
        };
    };
    ```
9.   mapDispatchToProps dispatch 方法就相当于调用 reducer 函数
    写法 ：
```jsx
const mapDispatchToProps = (dispatch) => {
    return {
    add(num) {
    dispatch({ type: "increment", num });
    },
};
```
10. 异步请求数据
    store.js
    在 store 中从 redux 中引入 applyMiddleware
    然后下载 thunk 异步库 import thunk from "redux-thunk";
    创建仓库 createStore(reducer, applyMiddleware(thunk))
    建一个 actionCreators.js 文件 在这个文件中写一个函数去 return 一个对象 然后再组件中在引入这个函数去调用他 这样虽然是一样的但是在这个 actionCreators.js 中写的这个函数 return 这个对象之前就可以去请求数据 但是请求到之后还是要写一个同步方法去改变仓库数据 写的这个函数就是个异步函数用这个异步方法去调同步方法改变仓库数据
    写法：
```jsx
    const initAction = (list) => {
    return { type: "init", list: list };
    };
    export const initAsyncAction = () => {
    // 请求数据
    // Actions must be plain objects
    return (dispatch) => {
    fetch(
    "https://www.fastmock.site/mock/15579798b9f988acd4d04ff978a2bd7c/api/list"
    )
    .then((response) => response.json())
    .then((res) => {
    // return { type: "init", list: res.list };
    dispatch(initAction(res.list));
    });
    };
    };
```
11. 异步请求数据 -saga 异步库
    思路：
    首先在 store 的 index 中改变写法 引 saga 异步库
    里面引入 sagas 文件
    组件中用 useEffect 去调用 dispatch 但是这里的 dispatch 被 sagas 文件拦截了 在 saga 里面进行一些操作 在 saga 里面调用 reducer 函数 请求到数据之后 将请求到的数据传递给 reducer 然后 reducer 去改变里面的数据 最后在组件中再去调用一下仓库中的数据就有请求过后的数据了
    组件中有两个 hocks 从 redux 中解构出来的 一个是调用仓库中的数据 一个是调用仓库中的 reducer 函数传入的是 action
    1. 组件中用 useEffect 去调用 dispatch 但是这里的 dispatch 被 sagas 文件拦截了
       useEffect(() => {
       dispatch({
       type: "init2",
       });
       // eslint-disable-next-line
       }, []);
       2.--_ 在 saga 里面请求数据 在 saga 里面调用 reducer 函数 请求到数据之后 将请求到的数据传递给 reducer
       import { takeEvery, put, call } from "redux-saga/effects";
       import axios from "axios";
       function_ loadFn() {
       // 先请求数据
       // call 用来请求数据
       const res = yield call(() => {
       return axios
       .get("http://www.pudge.wang:3080/api/rated/list")
       .then((res) => {
       return res.data;
       });
       });
       yield put({
       type: "init",
       list: res.result,
       });
       }
       function\* mySaga() {
       yield takeEvery("init2", loadFn);
       }
       export default mySaga;
    2. reducer 去改变里面的数据
       const reducer = (state = defaultstate, action) => {
       switch (action.type) {
       case "init":
       // console.log(action);
       // return {
       // ...state,
       // list: action.list,
       // };
       return state.set("list", action.list); //immutable 写法
       default:
       return state;
       }
       】
       最后在组件中再去调用一下仓库中的数据就有请求过后的数据了
       这里注意 组件中有两个 hocks 从 redux 中解构出来的 一个是调用仓库中的数据 一个是调用仓库中的 reducer 函数传入的是 action
       import { useSelector, useDispatch } from "react-redux";
       const list = useSelector((state) => state.get("list"));
12. 配置 saga sagas 文件里面请求数据 请求到数据之后调用 put 方法相当于
    下载 saga
    1. yarn add redux-saga
    2. 在 store 中从 redux 中引入 applyMiddleware
    3. 创建一个 sagas.js 文件 引入到 store 的 index 中
       import mySaga from "./sagas";
    4. 从 react-saga 中引入 createSagaMiddleware
       import createSagaMiddleware from "redux-saga";
    5. createSagaMiddleware 是个函数 将他的执行结果定义为一个变量
       const sagaMiddleware = createSagaMiddleware();
    6. 创建仓库 createStore(reducer, applyMiddleware(sagaMiddleware))
    7. 最后在暴露之前执行 sagaMiddleware.run(mySaga);
       **sagas 文件中写什么**
       从 redux-saga/effects 中解构 takeEvery 和 put
       import { takeEvery, put } from "redux-saga/effects";
       takeEvery:用来监听的 只要在组件里面去调用 dispatch，会优先进入 mySaga 函数
       第一个参数是函数名，对应的是组件的 dispatch 的 type
       第二个参数是回调函数
       put：用来调用 reducer 的函数
       call：用来做数据请求的
       里面写一个生成器函数 调用 takeEvery 函数 里面有两个参数 第一个参数是组件调用 dispatch 时候的名字 第二个参数是一个函数可以接收一个参数相当于 reducer 中的 action 第二个参数对应的函数中写 put 函数 put 就相当于调用 dispatch
       执行的时候会先到 sagas 这个文件里面来执行过之后再到 reducer
       import { takeEvery, put ,call } from "redux-saga/effects";
       function* addFn(action) {
       yield put({
       type: "add",
       payload: action.payload,
       });
       }
       function* mySaga() {
       yield takeEvery("add2", addFn);
       }
       export default mySaga;
13. actionTypes 写法就是用一个文件里面定义一个常量大写并暴露出去 替换 reducer 里面的 case 的条件
14. 模块化


### thunk 和 saga 的区别

redux-thunk 和 redux-saga 处理异步任务的时机不一样。对于 redux-saga，相对于在 redux 的 action 基础上，重新开辟了一个 async action 的分支，单独处理异步任务
saga 自己有一套监听机制 saga 会比 thunk 难一点

## redux 本来是同步的，为什么它能执行异步代码（这句话就是中间件的作用）？中间件的实现原理是什么？都有哪些中间件？


redux 本来是同步的，为什么它能执行异步代码
当我们需要修改 store 中值的时候，我们是通过 dispatch(action)将要修改的值传到 reducer 中的，这个过程是同步的，如果我们要进行异步操作的时候，就需要用到中间件；中间件其实是提供了一个分类处理 action 的机会，在 middleware 中，我们可以检阅每一个流过的 action，并挑选出特定类型的 action 进行相应操作，以此来改变 action；
···
applyMiddleware 是个三级柯里化的函数。它将陆续的获得三个参数：第一个是 middlewares 数组，第二个是 Redux 原生的 createStore，最后一个是 reducer；然后 applyMiddleware 会将不同的中间件一层一层包裹到原生的 dispatch 之上；
redux-thunk 中间件的作用就是让我们可以异步执行 redux，首先检查参数 action 的类型，如果是函数的话，就执行这个 action 这个函数，并把 dispatch, getState, extraArgument 作为参数传递进去，否则就调用 next 让下一个中间件继续处理 action。
···
中间件的实现原理是什么？
中间键的原理就是将原来的 dispatch 存起来然后改变他的指向 重命名
···
都有哪些中间件？
redux-thunk
redux-saga


## React 按需加载


从 react 中解构 lazy 引入的时候用 lazy 去替换原本模块化的 import 引入 结合 Router 可以做到组件懒加载的效果
const Home = lazy(() => import('./routes/Home'))


## immutable


用于解决 JavaScript 数据修改的问题
引用数据类型之间传递的是地址 所以当修改其中一个一起改变
为了解决这个问题可以用 深 浅拷贝
JSON.parse JSON.stringfy 当对象的 value 是函数 或者 undefined 时会失效
Object.assign
但是这样会非常消耗性能 比如一个对象中某一个数据改变 会导致整个数据的地址改变 消耗内存 所以有了 immutable
**例子 ：D:\htlm5\代码\html5-3\React.js\react-basic-2110\src\19-immutable\App.jsx**

immutable 不可变数据
安装 - yarn add immutable
引入 import { Map, List, Seq, fromJS } from "immutable";

定义 immutableData

1.  Map
    import { Map } from "immutable";
    const obj = Map({
    a: 1,
    });
    获取数据用 get 方法
    obj.get('a') // 1

2.  Seq
    Seq 可以定义数组和对象
    seq 是具有惰性的, 从结果出发，不用的东西是不会执行的

3.  fromJS
    fromJS 定义的对象具有深度 里面的对象也是 immutable 对象 formJS 会递归的, 数组和对象都能用

改变数据需要新建一个变量 用 set 方法定义
const obj2 = obj.set("a", 2);

obj 于 obj2 比较的时候由于是赋值的所以是需要比较里面的数据相不相同

对象合并 - merge

定义数组 引入 List
import { List } from "immutable";
immutable 数组有一些 api，这些 api 很多和原生 api 相同
const list1 = List([1, 2]);
const list2 = list1.push(3, 4, 5); //1 2 3 4 5
const list3 = list2.unshift(0); //0 1 2 3 4 5
const list4 = list1.concat(list2, list3);
console.log(list4);
size 表示数组长度
console.log(list4.size === 13);

数组合并 immutable 数组可以使用数组的方法 所以直接 concat 就可以


## WebPack

WebPack 可以看做是静态资源打包机，它做的事情是，分析你的项目结构，因为浏览器很多文件都不认识，所以要转换成浏览器认识的文件，将其打包为合适的格式以供浏览器使用。
前端环境分为
开发环境:无法在服务器环境中运行（本地做开发的时候）
生产环境:将开发环境的代码经过打包压缩编译之后的文件，放在测试环境服务器中运行
核心概念：
wepack 管控打包转化的控制工具，将源码转成目标格式
entry：入口文件，它是一个数组，因为它有很多个入口，
output：出口文件，打包出的文件所在目录
loader：转换器，用于对模块的源代码进行转换。（将不是 js 文件转成 js 文件经行打包压缩 8）
样式：style-loader、css-loader、less-loader、sass-loader 等
文件：raw-loader、file-loader 、url-loader 等
编译：babel-loader、coffee-loader 、ts-loader 等
校验测试：mocha-loader、jshint-loader 、eslint-loader 等
Plugin：插件，本质是构造函数，给工程化提供额外的功能
webpack 内置 UglifyJsPlugin，压缩和混淆代码。
webpack 内置 CommonsChunkPlugin，提高打包效率，将第三方库和业务代码分开打包。
ProvidePlugin：自动加载模块，代替 require 和 import
···
底层：
是由 node.js 来开发的--也就是说 webpack 配置文件都是 node.js 文件，
环境支持 node.js8 版本以上
书写规范：common.js 规范
···
source-map 把错误映射到源码的位置
···
热更新
在应用程序的开发环境，方便开发人员在不刷新页面的情况下，就能修改代码，并且直观地在页面上看到变化的机制，提升开发效率。
···
webpack 如何实现热部署
通过 webpack-dev-server 来实现，它是 webpack 官方提供的一个小型 Express 服务器，使用它可以为 webpack 打包生成的资源文件提供 web 服务。可以使用它来实时监听代码文件变化。
项目中只需要在配置文件 package.json 配置 hot: true, // 是否热更新即可开启 Hot Module Replacemen 即热模块替换


## webpack 与 grunt、gulp


相同点：都是前端构建⼯具，grunt、gulp 以前流⾏，现在 webpack 流⾏，轻量化的任务还是可以⽤ gulp 来实现。
grunt 和 gulp 是基于任务和流的：找到⼀个⼜⼀个⽂件，做链式操作更新流上的数据，这个为⼀个任务，多个任务组成整个 web 构建流程。
webpack 是一个打包模块化 javascript 的工具，在 webpack 里一切文件皆模块，通过 loader 转换文件，通过 plugin 注入钩子，最后输出由多个模块组合成的文件，webpack 专注构建模块化项目。loader 用于加载某些资源文件，plugin 用于扩展 webpack 的功能。
webpack 四个组成：⼊⼝，出⼝，loader，plugin


## 类型检查和默认值


函数式组件的默认值只能写成
App.defaultProps = {
msg : "zhangsan"
}
类组件的默认值可以在外面写
App.defaultProps = {
msg : "zhangsan"
}
也可以在类里面加一个 static 表示私有属性
static defaultProps = {
name : "wangwu"
}
static propTypes = {
name: PropTypes.string,
};
类型检查
import PropTypes from 'prop-types';
写法同默认值


## Ts 和 JS 的区别 使用 typescript 的好处


区别
Typescript 是 JavaScript 的超集，它支持所有 JavaScript 的语法，并在此基础上添加静态类型定义和面向对象的思想。最终编译成 JavaScript 运行。 TypeScript 它不是一门新的语言，而是用来规范 js 的，js 始终是一门弱类型语言 ，ts 它是 js 的超集 js 分成 EcmaScript(js 的语法规范),Dom(文档对象模型),Bom(浏览器对象模型)ts 实际上是 EcmaScript 的超集, ts 是强类型版的 js

使用 typescript 的好处

1.开源，跨平台。它本身不需要考虑运行环境的问题，所有支持 JavaScript 的地方都可以使用 typescript；
2.引入静态类型声明，减少不必要的类型判断和文档注释；
3。及早发现错误，静态类型检查 1 或编译时发现问题，不用等到运行；
4.类、接口的使用更易于构建和维护组件；
5.重构更方便可靠，适合大型项目；


## react 中的 key 有什么作用 key 发生变化会发生什么 key 值发生改变后会执行哪些生命周期函数

- react 中的 key 有什么作用

1.简单的来说就是为了提高 diff 的同级比较的效率，避免原地复用带来的副作用
2.react 利用 key 来识别组件，它是一种身份标识标识，就像我们的身份证用来辨识一个人一样。每个 key 对应一个组件，相同的 key react 认为是同一个组件，这样后续相同的 key 对应组件都不会被创

key 发生变化会发生什么

key 值不同组件会销毁再重新创建

key 值发生改变后会执行哪些生命周期函数

1.componentWillUnmount
2.constructor
3.componentWillMount（可以不说）
4.render
5.componentDidMount