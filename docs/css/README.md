css
## 深入理解为什么有的时候height100%会失效

对于`height`属性，如果父元素`height`为`auto`，只要子元素在文档流中（即`position`不等于`fixed`或者`absolute`），其百分比值完全就被忽略了。这是什么意思呢？首先来看个例子，比如，某小白想要在页面插入一个`<div>`，希望满屏显示黑色背景，就写了如下 代码：

```xml
<!DOCTYPE html>
<html lang="en">
<head>
  <title>黑色主题</title>
  <style>
    .box {
      width: 100%; // 这是多余的
      height: 100%; // 这是无效的
      background: #000;
    }
  </style>
</head>
<body>
  <div class="box"></div>
</body>
</html>
```

然后他发现这个`<div>`高度永远是 0，哪怕其父级`<body>`塞满了内容也是如此。事实上，他需要加上这样的设置才行：

```css
html, body {
 height: 100%;
}
```

并且仅仅设置`<body>`也是不行的，因为此时的`<body>`也没有具体的高度值：

```css
body {
 /* 子元素 height:100%依旧无效 */
}
```

只要经过一定的实践，我们都会发现对于普通文档流中的元素，百分比高度值要想起作用，其父级必须有一个可以生效的高度值！但是，怕是很少有人思考过这样一个问题：为何父级没有具体高度值的时候，`height:100%`会无效？

网上有种观点认为，如果父元素`height: auto`，又要让子元素`height:100%`生效的话，会使得布局进入一种死循环。比如下面的代码：

```xml
<style>
  .child1 {
    height: 100px;
  }
  .child2 {
    height: 100%;
  }
</style>
<div class="parent">
  <div class="child1"></div>
  <div class="child2"></div>
</div>
```

他们的推理大概如下：
parent 元素的高度默认为`auto`。首先，child1的高度为`100px`, 这时候 parent 的高度也会等于`100px`, 然后因为 child2 的`height: 100%`，所以它的高度会等于 parent 的高度也变成了`100px`，这时候 child1 + child2 的高度是`200px` ,导致 parent 的高度也变成了`200px`， 接着 child2 因为`height: 100%`，高度也要等于 parent 的高度，所以变成了`200px`，然后就会陷入无限死循环了。

这个推论看上去好像有理有据 ，但是，实际上是个谬论来着。为什么这样说呢？要明白其中的原因要先了解浏览器渲染的基本原理。首先，先下载文档内容，加载头部的样式资源（如果有的话），然后按照从上而下、自外而内的顺序渲染 DOM 内容。套用本例就是，先渲染父元素 parent，后渲染子元素 child1 , 最后渲染子元素 child2 ，是有先后顺序的。因此，当渲染到`child2`的时候，父元素高度已经固定为 100px 了。高度不够怎么办？溢出就好了，overflow 属性就是为此而生的。

记住，浏览器渲染规则是：静态渲染，一次到位。

真实的原因是：如果包含块（即父元素）的高度没有显式指定（即高度由内容决定），并且该元素不是绝对定位，则计算值为auto（这是计算值，是指渲染之后解释的值，并不是我们设置`height: auto`所指的值）。一句话总结就是：因为解释成了 auto。要知道，auto 和百分比计算，肯定是算不了的：

```bash
'auto' * 100/100 = NaN 
```

此时，他们的计算结果是NaN,这就是父元素没有设置高度时，子元素高度百分比不生效的原因了。

那有什么办法让高度百分数生效呢？有两种办法。

1. 设定显式的高度值。例如，设置`height:600px`，或者可以生效的百分比值高度。例如，我们比较常见的：

```css
html, body {
 height: 100%;
} 
```

2. 使用绝对定位
   为什么使用绝对定位就可以了呢？因为会使元素具有“格式化高度”。那什么又是格式化高度？

   格式化宽度/高度仅出现在“绝对定位模型”中，也就是出现在`position`属性值为 `absolute` 或 `fixed`的元素中。当`left/top`或`top/bottom`对立方位的属性值同时存在的时候，元素的宽度/高度表现为“格式化宽度/高度”，其宽度/高度相对于最近的具有定位特性（`position`属性值不是`static`）的祖先元素计算。

回到开头提到的盒子，小白设置`height`不生效的问题，如果用绝对定位方法实现，可以设置他的父元素`body`为绝对定位，代码如下：

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>黑色主题</title>
  <style>
    body {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .box {
      width: 100%;
      height: 100%;
      background: #000;
    }
  </style>
</head>
<body>
  <div class="box">
  </div>
</body>
</html>
```