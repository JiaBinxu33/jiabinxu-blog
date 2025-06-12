# HTML+Css 概述

## HTML 的概述

HTML 是一门超文本标记语言而不是编程语言，其包括诸多标签可以用于构建基本的网页，而浏览器可以通过其内核去解析这些标签，将其界面正确的展示出来；
HTML 的标签是由尖括号包围的关键词;
HTML 的标签一般是成对出现的，如 div 标签,类似这种的称为双标签；当然也有单标签，如 br 换行标签；

```Html
<div></div>
<br>
```

标签的关系有包含关系和并列关系,如下所示：

- 包含关系：html 标签里包含着 head 标签，因此可以称为是包含关系（父子关系）
- 并列关系：head 标签和 body 标签不存在包含关系，而是并列在一起的，因此称为并列关系（兄弟关系）

```Html
<html>
    <head></head>
    <body></body>
</html>
```

### 块元素，行内元素，行内块元素

- 块元素（div、p、hr、h1-h6、header、footer、ul>li 、 dl dt dd）：可设宽高，padding，border，margin，line-height。

  - 块级元素以块的形式显示在页面上，它们会独占一行或多行空间，并且默认情况下会在前后创建换行。块级元素可以设置宽度、高度、内外边距等样式属性。

  - 注意：块级元素的宽度默认是自动撑开到容器的宽度，而不是默认为 100%
    可以容纳内联元素和其他块元素。
    默认情况下会在前后创建换行。
    可以设置宽度、高度、内外边距等样式属性。

- 行内元素（span 、i、b-strong、u、s、a）： 不可设置宽高、可设置水平方向的 padding，border，margin，垂直方向不行，多个行内在同一行显示，里面一般仅放文本，但 a 标签除外。

  - 行内元素
    行内元素不会独占一行，它们会在同一行内显示，并且大小由内容决定，无法设置宽度和高度，其宽度随着内容增加，高度随字体大小而改变。通常情况下，行内元素不能设置上下内外边距，只能设置左右内外边距。

  - 特点
    多个行内在同一行内显示，里面一般仅放文本，但 a 标签除外。相邻的行内元素会排列在同一行里，直到一行排不下，才会换行。行内元素的宽度由其中包含的内容决定，内容越多，宽度越大，可以随内容自动扩展，不需要设置宽度属性。
    行内元素只能容纳文本或者其他行内元素。
    由于行内元素是在同一行内显示的，所以通常只能设置左右内外边距，上下内外边距在默认情况下是不起作用的。
    示例行内元素

- 行内块元素（input、button、select、img）：可设置宽高，padding，border，margin，line-height，多个行内块在一行显示。行内块级元素

  - 行内块级元素在同一行内显示，但是它们可以设置宽度和高度，并且可以像块级元素一样设置内外边距。它们不会强制换行，可以在一行内显示多个行内块级元素。

  - 特点
    在同一行内显示。
    可以设置宽度和高度。
    可以设置内外边距。
    不会强制换行。
    示例行内块级元素

- 如何转换，通过 display 设置：display: block | inline-block | line

- 区别
  - 显示方式：块级元素和行内块级元素会独占一行或多行空间，而行内元素会在同一行内显示。
  - 尺寸设置：块级元素和行内块级元素可以设置宽度和高度，而行内元素的尺寸由其内容决定。
  - 内外边距：块级元素和行内块级元素可以设置上下内外边距，而行内元素通常只能设置左右内外边距。
  - 换行行为：块级元素和行内块级元素会在其前后创建换行，而行内元素不会。

通过深入理解这三种元素类型的特性、区别以及转换方法，我们能够更有效地管理页面的结构和外观，从而实现更具丰富性和灵活性的网页设计。

### 渲染帧

由于现在广泛使用的屏幕都有固定的刷新率（比如最新的一般在 60Hz）， 在两次硬件刷新之间浏览器进行两次重绘是没有意义的只会消耗性能。 浏览器会利用这个间隔 16ms（1000ms/60）适当地对绘制进行节流， 因此 16ms 就成为页面渲染优化的一个关键时间。 尤其在异步渲染中，要利用 流式渲染 就必须考虑到这个渲染帧间隔。

为方便查阅源码和相关资料，本文以 Chromium 的 Blink 引擎为例分析。如下是一些分析结论：

一个渲染帧内 commit 的多次 DOM 改动会被合并渲染；
耗时 JS 会造成丢帧；
渲染帧间隔为 16ms 左右；
避免耗时脚本、交错读写样式以保证流畅的渲染。
渲染帧的流程
渲染帧是指浏览器一次完整绘制过程，帧之间的时间间隔是 DOM 视图更新的最小间隔。 由于主流的屏幕刷新率都在 60Hz，那么渲染一帧的时间就必须控制在 16ms 才能保证不掉帧。 也就是说每一次渲染都要在 16ms 内页面才够流畅不会有卡顿感。 这段时间内浏览器需要完成如下事情：

- 脚本执行（JavaScript）：脚本造成了需要重绘的改动，比如增删 DOM、请求动画等
- 样式计算（CSS Object Model）：级联地生成每个节点的生效样式。
- 布局（Layout）：计算布局，执行渲染算法
- 重绘（Paint）：各层分别进行绘制（比如 3D 动画）
  合成（Composite）：合成各层的渲染结果
  最初 Webkit 使用定时器进行渲染间隔控制， 2014 年时开始 使用显示器的 vsync 信号控制渲染（其实直接控制的是合成这一步）。 这意味着 16ms 内多次 commit 的 DOM 改动会合并为一次渲染。

耗时 JS 会造成丢帧
JavaScript 在并发编程上一个重要特点是“Run To Completion”。在事件循环的一次 Tick 中， 如果要执行的逻辑太多会一直阻塞下一个 Tick，所有异步过程都会被阻塞。 一个流畅的页面中，JavaScript 引擎中的执行队列可能是这样的：

执行 JS -> 空闲 -> 绘制（16ms）-> 执行 JS -> 空闲 -> 绘制（32ms）-> ...
如果在某个时刻有太多 JavaScript 要执行，就会丢掉一次帧的绘制：

执行很多 JS...（20ms）-> 空闲 -> 绘制（32ms）-> ...
例如下面的脚本在保持 JavaScript 忙的状态（持续 5s）下每隔 1s 新增一行 DOM 内容。

```Html
<div id="message"></div>
<script>
var then = Date.now()
var i = 0
var el = document.getElementById('message')
while (true) {
  var now = Date.now()
  if (now - then > 1000) {
    if (i++ >= 5) {
      break;
    }
    el.innerText += 'hello!\n'
    console.log(i)
    then = now
  }
}
</script>
```

可以观察到虽然每秒都会写一次 DOM，但在 5s 结束后才会全部渲染出来，明显耗时脚本阻塞了渲染。

测量渲染帧间隔
浏览器的渲染间隔其实是很难测量的。即使通过 clientHeight 这样的接口也只能强制进行 Layout，是否 Paint 上屏仍未可知。

幸运的是，最新的浏览器基本都支持了 requestAnimationFrame 接口。 使用这个 API 可以请求浏览器在下一个渲染帧执行某个回调，于是测量渲染间隔就很方便了：

```JavaScript
var then = Date.now();
var count = 0;
function nextFrame(){
requestAnimationFrame(function(){
      count ++
      if(count % 20 === 0){
      var time = (Date.now() - then) / count
      var ms = Math.round(time\*1000) / 1000
      var fps = Math.round(100000/ms) / 100
      console.log(`count: ${count}\t${ms}ms/frame\t${fps}fps`)
    }
    nextFrame()
  })
  }
nextFrame()
```

每次 requestAnimationFrame 回调执行时发起下一个 requestAnimationFrame，统计一段时间即可得到渲染帧间隔，以及 fps。逼近 16.6 ms

渲染优化建议
现在我们知道浏览器需要在 16ms 内完成整个 JS->Style->Layout->Paint->Composite 流程，那么基于此有哪些页面渲染的优化方式呢？

避免耗时的 JavaScript 代码
耗时超过 16ms 的 JavaScript 可能会丢帧让页面变卡。如果有太多事情要做可以把这些工作重新设计，分割到各个阶段中执行。并充分利用缓存和懒初始化等策略。不同执行时机的 JavaScript 有不同的优化方式：

初始化脚本（以及其他同步脚本）。对于大型 SPA 中首页卡死浏览器也是常事，建议增加服务器端渲染或者应用懒初始化策略。
事件处理函数（以及其他异步脚本）。在复杂交互的 Web 应用中，耗时脚本可以优化算法或者迁移到 Worker 中。Worker 在移动端的兼容性已经不很错了，可以生产环境使用。
避免交错读写样式
在编写涉及到布局的脚本时，常常会多次读写样式。比如：

```JavaScript
// 触发一次 Layout
var h = div.clientHeight
div.style.height = h + 20
// 再次触发 Layout
var w = div.clientWidth
div.style.width = w + 20
```

因为浏览器需要给你返回正确的宽高，上述代码片段中每次 Layout 触发都会阻塞当前脚本。 如果把交错的读写分隔开，就可以减少触发 Layout 的次数：

```JavaScript
// 触发一次 Layout
var h = div.clientHeight
var w = div.clientWidth
div.style.height = h + 20
div.style.width = w + 20
```

小心事件触发的渲染
我们知道 DOM 事件的触发 是异步的，但事件处理器的执行是可能在同一个渲染帧的， 甚至就在同一个 Tick。例如异步地获取 HTML 并拼接到当前页面上， 通过监听 XHR 的 onprogress 事件 来模拟流式渲染：

```JavaScript
  var xhr = new XMLHttpRequest(),
  method = 'GET',
  url = 'https://harttle.land'

  xhr.open(method, url, true)
  xhr.onprogress = function () {
    div.innerHTML = xmlhttp.responseText
  };
xhr.send()
```

上述渲染算法在网络情况较差时是起作用的，但不代表它是正确的。 比如当 https://harttle.land 对应的 HTML 非常大而且网络很好时， onprogress 事件处理器可能碰撞在同一个渲染帧中，或者干脆在同一个 Tick。 这样页面会长时间空白，即使 onprogress 早已被调用过。

## 常见问题

### 弹性盒

display:flex;

- flex-direction: row 横 | column | 主轴⽅向
- flex-wrap: nowrap 不换⾏ | wrap | wrap-reverse 是否⾃动换⾏
- justify-content: flex-start 左或上 | flex-end | center |space-between | space-around 主轴对⻬⽅式
- align-items: stretch ⾼度不设置则占满 | flex-start | flex-end | center | baseline 交叉轴对⻬⽅式
- flex-shrink: 默认 1，空间不⾜按⽐缩⼩，设为 0 不缩⼩
- flex-basis: 默认 auto，占据主轴多少空间
- flex-grow：默认为 0，属性定义项⽬的放⼤⽐例，即如果存在剩余空间，也不放⼤。
- flex: 0 1 auto，

### **如何让元素⽔平垂直居中（最多问到）**

1. 定位偏移 top，left 为 50%，margin-left，margin-top 为⼩元素的-50%
2. 定位平均 top，left，bottom，right 为 0，margin 为 auto
3. 定位平移 top，left 为 50%，transform：translate(⼩元素的 50%)
4. 弹性盒 主轴与交叉轴居中
5. 表格 ⽗ block，⼦ table-cell

### **flex 的⼏个默认属性**

第⼀个值为默认值

- flex-direction: row 横 | column | 主轴⽅向
- flex-wrap: nowrap 不换⾏ | wrap | wrap-reverse 是否⾃动换⾏
- justify-content: flex-start 左或上 | flex-end | center |space-between | space-around 主轴对⻬⽅式
- align-items: stretch ⾼度不设置则占满 | flex-start | flex-end | center | baseline 交叉轴对⻬⽅式
- flex-shrink: 默认 1，空间不⾜按⽐缩⼩，设为 0 不缩⼩
- flex-basis: 默认 auto，占据主轴多少空间
- flex-grow：默认为 0，属性定义项⽬的放⼤⽐例，即如果存在剩余空间，也不放⼤。
- flex: 0 1 auto，

### **清除浮动**

1. 给高度塌陷的元素加 overflow: hidden （触发 BFC）
2. 给高度塌陷的元素里面的最下面加一个空 div，div 属性 clear:both
3. 万能清除法
   div::after{
   content:'';
   height:0;
   overflow:hidden;
   visibility:hidden;
   display:block;
   clear:both;
   }

### **回流重绘**

- **_什么是回流_**
  当 render tree 中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。每个页面至少需要一次回流，就是在页面第一次加载的时候，这时候是一定会发生回流的，因为要构建 render tree。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。
- **_什么是重绘_**
  当 render tree 中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如 background-color。则就叫称为重绘。

### **本地存储 缓存**

- 存储大小
  cookie 数据大小不能超过 4k。
  sessionStorage 和 localStorage 虽然也有存储大小的限制，但比 cookie 大得多，可以达到 5M 或更大。
- 有效时间
  localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；
  sessionStorage 数据在当前浏览器窗口关闭后自动删除。
  cookie 设置的 cookie 过期时间之前一直有效，即使窗口或浏览器关闭
- 数据与服务器之间的交互方式
  cookie 的数据会自动的传递到服务器，服务器端也可以写 cookie 到客户端
  sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存。

### **Css 盒模型的理解**

当对⼀个⽂档进⾏布局的时候，浏览器的渲染引擎会将所有元素表示为⼀个个矩形的盒⼦。CSS 决定这些盒⼦的⼤⼩、位置以及属性（例如颜⾊、背
景、边框尺⼨…）
盒模型由 content（内容）、padding（内边距）、border（边框）、margin（外边距）组成。
⽽ IE 怪异盒模型 width 的宽度并不是 content 的宽度，⽽是 border + padding + content 的宽度值
元素占据的宽度 = margin+ width

### BFC

- 概念：
  BFC 块状格式化上下文 （block formatting context），是一个独立空间，只有块状元素参与，规定了里面的块状元素如何布局，与外界毫不相干

- 如何触发 BFC 1. 根元素 html 2. float 除了 none 选项之外 3. position : absolute/fixed 4. display: inline-block/table-cell/flex/inline-flex 5. overflow 除了 visible 选项之外
- BFC 布局规则
  1. 内部的块状元素从上往下排列
  2. 垂直方向的距离由 margin 控制
     属于同一个 BFC 的元素，上下 margin 会重叠
  3. 每个元素的 margin-left 会和父元素的 border-left 相接触
  4. BFC 的区域不会和浮动元素相重叠
  5. BFC 区域和外界空间毫不相干
  6. 计算 BFC 元素高度，浮动元素也参与计算
- BFC 应用
  1. 两栏布局
  2. 清除 margin 重叠
  3. 清除浮动

### **常见浏览器兼容问题？**

1. 不同浏览器下的 padding 和 margin 不同
   解决方法：使用通配符(\*)将 padding 和 margin 设置为 0
2. 块属性标签 float 之后，又有横向的 margin 值，在 IE6 中显示会比设置的大（IE6 双边距 bug）
   解决方法：在 float 标签样式控制中加入 display:inline;
3. 设置较小的高度标签（一般小于 10px），在 IE6，IE7，遨游中超出自己设置的高度
   解决方法：给超出高度的标签设置 overflow:hidden;或者设置行高 line-height 小于你设置的高度。
4. 行内标签设置 display:block;后又采用 float 布局，再设置横向 margin 值时，在 IE6 中显示会比设置的大（IE6 双边距 bug）
   解决方法：在 display:block;后面加上 display:inline;display:table;

### 清除图片间隙

- 清除图片左右的间隙
- 将图片挨着写（中间没有空格，也没有回车）
- 将图片的父元素的 font-size 设置成 0
- 给图片设置浮动
- 清除图片的上下间距
- 将图片设置成 display: block
- 给图片设置 vertical-align: top / middle / bottom
