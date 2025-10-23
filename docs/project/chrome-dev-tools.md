# 浏览器调试工具


[【浏览器调试工具精讲】Chrome Dev Tools精讲，前端必看！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1KM4y1G7EF/?spm_id_from=333.337.search-card.all.click&vd_source=471ae300a01d18a7dc8b121c6c288fd7)

## 检查元素

   - 使用选择工具
   - 先框选右键检查

## 打开
   f12

   菜单>更多工具>开发者工具

## 打开命令菜单
```
   ctrl+shift+p
   command + shift + p
```
   - 主题 switch to dark theme 可以切换调试工具到黑色主题
   - **截屏**screenshot  截取的图片会以png的格式下载到电脑上 里面有四个选项 
     - capture area screenshot
     - capture full size screenshot：可以截取到所有的屏幕外滚动条的内容
     - capture node screenshot：截取一个节点（元素）先选中一个节点 然后截取
     - capture screenshot

## 查找dom树
   ctrl+f
   查询方式

   - 文本查询
   - css选择器
   - Xpath
     eg. //section/p
     // 意思是全局范围内寻找
     找全局范围内的section标签下的p标签
   - 在console面板内可以使用 inspect(dom)的方式查找节点

## 复制样式
   选中右键复制样式 在浏览器的element style中粘贴进去
   computed面板 展示所有的style

## console面板
   快捷键 ctrl+shift+j
   执行语句
   $_返回上一条语句的执行结果
   $0上一个选择的DOM节点
   console.group 层组 用console.groupEnd结尾
   console.time 返回中间代码运行的时间 用console.timeEnd结尾
   console.table参数是数组对象 可以吧数组对象可视化可以排序

## 断点
   在代码中加debugger或者在浏览器中直接加
   比console效果好 可以在过程中监听到各个值的变化
   f10下一步
   f8 跳到下一个debugger 没有就结束了
   右键节点 break on 有三个选项 

   - subtree modification当节点的子节点被修改时js暂停执行
   - attribute modification 当节点的属性被修改时js暂停执行
   - node removal 当节点被删除时js暂停执行

   如果debugger的时候用框架写的跳转到了系统文件里面 可以忽略掉该文件

   - 在Sources面板下右侧的Call Stack 中找到那个文件 
     右键选择add script to ignore list

## Network
   Preserve log 保留历史请求 比如从一个页面跳转到另一个页面的时候 想看之前的请求
   节流器
   disable catch 去掉浏览器的缓存
   HAR file 导入可以模拟网络环境 看到客户当时是什么情况

## Application
   缓存
   Local Storage和Session Storage的区别
   local Storage回永久保存 除非手动删除
   Session Storage关闭会话就删除
   Cookies 可以设置过期时间的缓存