(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{343:function(t,a,s){"use strict";s.r(a);var n=s(25),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("css")]),t._v(" "),a("h2",{attrs:{id:"深入理解为什么有的时候height100-会失效"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#深入理解为什么有的时候height100-会失效"}},[t._v("#")]),t._v(" 深入理解为什么有的时候height100%会失效")]),t._v(" "),a("p",[t._v("对于"),a("code",[t._v("height")]),t._v("属性，如果父元素"),a("code",[t._v("height")]),t._v("为"),a("code",[t._v("auto")]),t._v("，只要子元素在文档流中（即"),a("code",[t._v("position")]),t._v("不等于"),a("code",[t._v("fixed")]),t._v("或者"),a("code",[t._v("absolute")]),t._v("），其百分比值完全就被忽略了。这是什么意思呢？首先来看个例子，比如，某小白想要在页面插入一个"),a("code",[t._v("<div>")]),t._v("，希望满屏显示黑色背景，就写了如下 代码：")]),t._v(" "),a("div",{staticClass:"language-xml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-xml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token doctype"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<!")]),a("span",{pre:!0,attrs:{class:"token doctype-tag"}},[t._v("DOCTYPE")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token name"}},[t._v("html")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("html")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("lang")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("en"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("head")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("title")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("黑色主题"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("title")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n    .box {\n      width: 100%; // 这是多余的\n      height: 100%; // 这是无效的\n      background: #000;\n    }\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("head")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("body")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("box"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("body")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("html")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),a("p",[t._v("然后他发现这个"),a("code",[t._v("<div>")]),t._v("高度永远是 0，哪怕其父级"),a("code",[t._v("<body>")]),t._v("塞满了内容也是如此。事实上，他需要加上这样的设置才行：")]),t._v(" "),a("div",{staticClass:"language-css extra-class"},[a("pre",{pre:!0,attrs:{class:"language-css"}},[a("code",[a("span",{pre:!0,attrs:{class:"token selector"}},[t._v("html, body")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v("height")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 100%"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("并且仅仅设置"),a("code",[t._v("<body>")]),t._v("也是不行的，因为此时的"),a("code",[t._v("<body>")]),t._v("也没有具体的高度值：")]),t._v(" "),a("div",{staticClass:"language-css extra-class"},[a("pre",{pre:!0,attrs:{class:"language-css"}},[a("code",[a("span",{pre:!0,attrs:{class:"token selector"}},[t._v("body")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 子元素 height:100%依旧无效 */")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("只要经过一定的实践，我们都会发现对于普通文档流中的元素，百分比高度值要想起作用，其父级必须有一个可以生效的高度值！但是，怕是很少有人思考过这样一个问题：为何父级没有具体高度值的时候，"),a("code",[t._v("height:100%")]),t._v("会无效？")]),t._v(" "),a("p",[t._v("网上有种观点认为，如果父元素"),a("code",[t._v("height: auto")]),t._v("，又要让子元素"),a("code",[t._v("height:100%")]),t._v("生效的话，会使得布局进入一种死循环。比如下面的代码：")]),t._v(" "),a("div",{staticClass:"language-xml extra-class"},[a("pre",{pre:!0,attrs:{class:"language-xml"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  .child1 {\n    height: 100px;\n  }\n  .child2 {\n    height: 100%;\n  }\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("parent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("child1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("child2"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),a("p",[t._v("他们的推理大概如下：\nparent 元素的高度默认为"),a("code",[t._v("auto")]),t._v("。首先，child1的高度为"),a("code",[t._v("100px")]),t._v(", 这时候 parent 的高度也会等于"),a("code",[t._v("100px")]),t._v(", 然后因为 child2 的"),a("code",[t._v("height: 100%")]),t._v("，所以它的高度会等于 parent 的高度也变成了"),a("code",[t._v("100px")]),t._v("，这时候 child1 + child2 的高度是"),a("code",[t._v("200px")]),t._v(" ,导致 parent 的高度也变成了"),a("code",[t._v("200px")]),t._v("， 接着 child2 因为"),a("code",[t._v("height: 100%")]),t._v("，高度也要等于 parent 的高度，所以变成了"),a("code",[t._v("200px")]),t._v("，然后就会陷入无限死循环了。")]),t._v(" "),a("p",[t._v("这个推论看上去好像有理有据 ，但是，实际上是个谬论来着。为什么这样说呢？要明白其中的原因要先了解浏览器渲染的基本原理。首先，先下载文档内容，加载头部的样式资源（如果有的话），然后按照从上而下、自外而内的顺序渲染 DOM 内容。套用本例就是，先渲染父元素 parent，后渲染子元素 child1 , 最后渲染子元素 child2 ，是有先后顺序的。因此，当渲染到"),a("code",[t._v("child2")]),t._v("的时候，父元素高度已经固定为 100px 了。高度不够怎么办？溢出就好了，overflow 属性就是为此而生的。")]),t._v(" "),a("p",[t._v("记住，浏览器渲染规则是：静态渲染，一次到位。")]),t._v(" "),a("p",[t._v("真实的原因是：如果包含块（即父元素）的高度没有显式指定（即高度由内容决定），并且该元素不是绝对定位，则计算值为auto（这是计算值，是指渲染之后解释的值，并不是我们设置"),a("code",[t._v("height: auto")]),t._v("所指的值）。一句话总结就是：因为解释成了 auto。要知道，auto 和百分比计算，肯定是算不了的：")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'auto'")]),t._v(" * "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("100")]),t._v("/100 "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" NaN \n")])])]),a("p",[t._v("此时，他们的计算结果是NaN,这就是父元素没有设置高度时，子元素高度百分比不生效的原因了。")]),t._v(" "),a("p",[t._v("那有什么办法让高度百分数生效呢？有两种办法。")]),t._v(" "),a("ol",[a("li",[t._v("设定显式的高度值。例如，设置"),a("code",[t._v("height:600px")]),t._v("，或者可以生效的百分比值高度。例如，我们比较常见的：")])]),t._v(" "),a("div",{staticClass:"language-css extra-class"},[a("pre",{pre:!0,attrs:{class:"language-css"}},[a("code",[a("span",{pre:!0,attrs:{class:"token selector"}},[t._v("html, body")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v("height")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 100%"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" \n")])])]),a("ol",{attrs:{start:"2"}},[a("li",[a("p",[t._v("使用绝对定位\n为什么使用绝对定位就可以了呢？因为会使元素具有“格式化高度”。那什么又是格式化高度？")]),t._v(" "),a("p",[t._v("格式化宽度/高度仅出现在“绝对定位模型”中，也就是出现在"),a("code",[t._v("position")]),t._v("属性值为 "),a("code",[t._v("absolute")]),t._v(" 或 "),a("code",[t._v("fixed")]),t._v("的元素中。当"),a("code",[t._v("left/top")]),t._v("或"),a("code",[t._v("top/bottom")]),t._v("对立方位的属性值同时存在的时候，元素的宽度/高度表现为“格式化宽度/高度”，其宽度/高度相对于最近的具有定位特性（"),a("code",[t._v("position")]),t._v("属性值不是"),a("code",[t._v("static")]),t._v("）的祖先元素计算。")])])]),t._v(" "),a("p",[t._v("回到开头提到的盒子，小白设置"),a("code",[t._v("height")]),t._v("不生效的问题，如果用绝对定位方法实现，可以设置他的父元素"),a("code",[t._v("body")]),t._v("为绝对定位，代码如下：")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>黑色主题</title>\n  <style>\n    body {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n\n    .box {\n      width: 100%;\n      height: 100%;\n      background: #000;\n    }\n  </style>\n</head>\n<body>\n  <div class="box">\n  </div>\n</body>\n</html>\n')])])])])}),[],!1,null,null,null);a.default=e.exports}}]);