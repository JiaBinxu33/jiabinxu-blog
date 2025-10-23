# Flutter 综合学习笔记

这是一份根据前三天学习和实践整理的综合笔记，旨在帮助理解 Flutter 的核心概念，从基础入门到状态管理。

## 1. Flutter 核心基础

### Flutter 的项目入口：`lib/main.dart`

每个 Flutter 应用程序的执行都始于 `lib/main.dart` 文件，该文件是程序的指定入口点。

* **lib 目录**: 此目录是项目的核心，作为几乎所有 Dart 源代码的主要存储库。
* **main.dart 文件**: 这是应用的**主入口文件**。操作系统（无论是安卓、iOS还是Web）启动您的应用时，第一个执行的就是这个文件里的 `main()` 函数。
* **main() 函数**: 这是程序的起点。在这个函数里，我们通常会调用 `runApp()` 函数。

**代码示例 (lib/main.dart):**
```dart
import 'package:flutter/material.dart';
// ... 其他导入

// 程序的入口函数
void main() {
  // runApp() 告诉 Flutter 运行哪个组件作为应用的根
  runApp(const MyApp()); 
}

// MyApp 就是应用的根组件
class MyApp extends StatelessWidget {
  // ...
}
```

### 核心理念：一切皆组件 (Everything is a Widget)

这是您需要记住的最重要的一句话。在 Flutter 中，您看到的**任何东西**都是一个“组件”（Widget），或者由更小的组件组合而成。

* 一个按钮？是 `ElevatedButton` 组件。
* 一行文字？是 `Text` 组件。
* 甚至连页面的整体布局（比如居中 `Center`、按行排列 `Row`、按列排列 `Column`），以及看不见的内边距 `Padding`，都是组件。
* `Scaffold` 是一个搭建页面的**脚手架组件**。

### `@override` 到底是什么意思？

`@override` 是一个“注解”，意思是：“我正在**重写**父类中的同名方法”。

* **背景**: 您的 `_HomePageState` 继承了 `State<HomePage>`。`State` 类本身已经定义了一个叫做 `build` 的方法。
* **作用**: 您的 `_HomePageState` 必须提供一个具体的 `build` 方法来描述页面内容。`@override` 就在这里起作用，它告诉编译器和阅读代码的人：“我这里的 `build` 方法是在重写父类 `State` 的 `build` 方法，不是我自己随便创建的新方法。”
* **好处**: 1. 代码更清晰。2. 安全检查（拼写错误会报错）。

**代码示例 (lib/pages/home_page.dart):**
```dart
class _HomePageState extends State<HomePage> {
  // @override 表示这个 build 方法是重写父类 State 的方法
  @override
  Widget build(BuildContext context) {
    // ... 返回您的组件树
  }
}
```

### Dart 命名规范与 `_` (下划线)

* **类名**: 使用 `UpperCamelCase` (大驼峰命名法)，例如 `HomePage`, `MyApp`。
* **文件名、变量名、函数名**: 使用 `lowerCamelCase` (小驼峰命名法)。
* **_ (下划线) 表示私有**: 在 Dart 中，如果一个变量、函数或类的名字以下划线 `_` 开头，那么它就是**私有的**。
    * **“私有”的范围**: 不是指这个类内部，而是指**当前文件 (.dart 文件) 内部**。`_HomePageState` 这个类只能在 `home_page.dart` 这个文件里被访问，其他文件无法 `import` 和使用它。

### `final` 的意思

`final` 是一个关键字，用来声明一个**只能被赋值一次**的变量。一旦被赋值，它的值（或引用）就不能再改变了。

* **为什么组件的属性常用 final?**
    在 Flutter 中，组件被设计为“不可变的”（immutable）。如果需要更新界面，Flutter 的做法是创建一个新的组件实例来替换旧的，而不是去修改旧组件的属性。使用 `final` 可以强制保证这一点，让代码更安全。

**代码示例 (lib/pages/web_view_page.dart):**
```dart
class WebViewPage extends StatefulWidget {
  // title 被声明为 final，意味着一旦 WebViewPage 被创建，
  // 它的 title 就不能再被修改了。
  final String title; 

  const WebViewPage({super.key, required this.title});
  // ...
}
```

## 2. 布局与样式 (Styling)

### `SafeArea`：不被状态栏遮挡的安全区域

`SafeArea` 是一个非常有用的布局组件。它的作用是创建一个“安全”的矩形区域，这个区域会自动避开手机屏幕顶部的刘海、状态栏，以及底部的导航条。

**代码示例 (home_page.dart):**
```dart
Scaffold(
  // 将 body 包裹在 SafeArea 中
  body: SafeArea(
    child: Column(...) // Column 里的所有内容都不会被遮挡了
  ),
);
```

### 添加样式 (Styling)

在 Flutter 中，给组件添加样式通常是通过组件自身的属性来实现的。

* **Text 组件**: 使用 `style` 属性，它接收一个 `TextStyle` 对象。
* **Container 组件**: 使用 `decoration` 属性，它接收一个 `BoxDecoration` 对象，可以设置边框、圆角、背景色等。

### 尺寸单位全解析

#### Flutter 默认单位：逻辑像素 (Logical Pixels)

* **写法**: 直接写数字，如 `width: 150`, `fontSize: 14`。
* **含义**: 这是一个**固定的、绝对的**单位。在不同尺寸屏幕上视觉比例会失调。

#### `flutter_screenutil` 适配单位

这是用来实现UI适配的利器，它们都是**相对单位**。

* **.w (width)**: 基于**屏幕宽度**进行缩放。适合设置**水平方向**的尺寸。
* **.h (height)**: 基于**屏幕高度**进行缩放。适合设置**垂直方向**的尺寸。
* **.r (radius/responsive)**: 基于屏幕**宽高的较小值**进行缩放。非常适合设置**圆角半径**或**正方形元素**。
* **.sp (scalable pixel)**: 专门用于**字体大小**的适配。它不仅会根据屏幕尺寸缩放，还会**参考用户在系统设置里调整的字体大小**。

## 3. 路由与导航 (Navigation)

“路由”就是页面的代称。Flutter 使用一个 `Navigator` (导航器) 组件来管理一个页面栈（先进后出）。

### 基本路由跳转

* **跳转到新页面 (push)**: `Navigator.push()` 会将一个新的页面（路由）压入栈顶。
* **返回上一页 (pop)**: `Navigator.pop()` 会将栈顶的页面弹出。

### 路由封装（进阶）

为了让项目结构更清晰，我们将路由跳转进行封装。

1.  **lib/route/routes.dart**: 这个文件负责**定义**和**生成**路由。
    * `RoutePaths` 类：用 `static const` 字符串常量来定义所有页面的路由名称（如 `'/web_view_page'`），避免使用魔法字符串。
    * `Routes` 类：`generateRoute` 静态方法像一个“交通枢纽”，通过 `switch` 语句判断路由名称，并返回对应的页面。
2.  **lib/route/RouteUtils.dart**: 这个文件封装了具体的**跳转动作**。
    * 创建 `push` 和 `pushForNamed` 等静态方法，将 `Navigator.of(context).push(...)` 封装起来。
    * **好处**：页面逻辑更简洁，调用 `RouteUtils.pushForNamed(context, ...)` 即可。

### 页面传值的两种核心方式

#### 方式一：构造函数传值（类型安全，推荐）

这是最直观、最安全的方式。

* **传递**: 创建新页面组件实例时，通过**构造函数**来完成。

  ```dart
  // 在 RouteUtils.push 中
  Navigator.push(context, MaterialPageRoute(builder: (context){
      // 直接把 "webView" 字符串传给 title 参数
      return WebViewPage(title: "webView");
  }));
  ```

* **接收**: 在目标页面 (`WebViewPage`) 的 `StatefulWidget` 部分用 `final` 变量声明，并在 `State` 部分通过 `widget.变量名` 访问。

  ```dart
  class WebViewPage extends StatefulWidget {
    final String title; // 1. 声明要接收的参数
    const WebViewPage({super.key, required this.title}); // 2. 在构造函数中接收
  }
  
  class _WebViewPageState extends State<WebViewPage> {
    Widget build(BuildContext context) {
      // 3. 通过 widget.title 使用参数
      return AppBar(title: Text(widget.title));
    }
  }
  ```

#### 方式二：`arguments` 传值（灵活，用于命名路由）

这种方式在与**命名路由** (`pushNamed`) 结合时非常灵活。

* **传递**: 在跳转时，通过 `arguments` 参数传递一个对象，通常是 `Map`。

  ```dart
  // 在 HomePage 中
  RouteUtils.pushForNamed(
    context, 
    RoutePaths.webViewPage,
    arguments: {"title": "webView"} // 将 Map 作为 arguments 传递
  );
  ```

* **接收**: 在目标页面的 `State` 内部，通过 `ModalRoute.of(context)!.settings.arguments` 来获取。这个过程必须在 `build` 方法或者 `initState` 中（通常配合 `addPostFrameCallback`）完成。

  ```dart
  class _WebViewPageState extends State<WebViewPage> {
    String name = "";
  
    @override
    void initState() {
      super.initState();
      // 确保在第一帧渲染后执行，此时 context 才可用
      WidgetsBinding.instance.addPostFrameCallback((_) { 
        if (mounted) {
          var args = ModalRoute.of(context)!.settings.arguments;
          if (args is Map) {
            setState(() { // 获取到值后，调用 setState 更新界面
              name = args["title"] ?? "默认标题";
            });
          }
        }
      });
    }
    // ... build 方法中使用 name ...
  }
  ```

## 4. 状态管理 (State Management)

### Level 1: 本地状态 (Local State) 与 `setState`

`StatefulWidget`（有状态组件）拥有一个 `State` 对象，可以保存和改变数据，并在数据改变时**刷新界面**。

* **State 对象**: 专门用来存储组件内部的可变数据。
* **setState((){ ... })**: 这是刷新UI的**唯一指令**。
    * **原理**: 调用 `setState` 会通知 Flutter 框架：“这个组件的数据变了，请重新调用它的 `build` 方法来重绘界面！”。
    * **注意**: 如果只修改变量而不调用 `setState`，数据虽然变了，但UI不会刷新。

### Level 2: 应用/全局状态 (App State) 与 `Provider`

当多个页面需要共享同一个状态（如用户登录信息、主题色），或者需要将状态传递给很深的子组件时，使用 `setState` 会变得非常繁琐（即“状态提升”和“Prop-drilling”）。

`Provider` 是 Google 官方推荐的、简单轻量的状态管理方案。

#### 核心概念 1: `ChangeNotifier` (ViewModel / 状态)

`ChangeNotifier` 是一个 Flutter SDK 内置的类。我们创建的 `ViewModel` (VM) 通常会继承它。

* **职责**:
    1.  **持有数据**: 比如 `List<Banner> bannerList`。
    2.  **封装业务逻辑**: 比如 `getBanner()` 方法。
    3.  **通知更新**: 当数据发生变化时（例如网络请求成功后），调用 `notifyListeners()` 方法，向所有监听者（Consumer）发送“数据变了”的信号。

```dart
// 示例：home_vm.dart
class HomeViewModel extends ChangeNotifier {
  List<Banner> bannerList = []; // 1. 持有数据

  // 2. 封装业务逻辑
  Future<void> fetchBanners() async {
    var data = await ApiService.getBanner(); // 假设 ApiService 负责请求
    bannerList = ...; // 把 data 转换成 bannerList
    
    // 3. 通知更新
    notifyListeners(); 
  }
}
```

#### 核心概念 2: `ChangeNotifierProvider` (供应器)

`ChangeNotifierProvider` 是 `provider` 包提供的组件。

* **职责**: 向其子组件树**提供**一个 `ChangeNotifier` (即 VM) 的实例。
* **位置**: 通常放在需要共享该状态的**组件树的顶层**，或者直接放在 `main.dart` 的 `runApp` 中，使其成为全局可访问。

```dart
// 示例：main.dart
void main() {
  runApp(
    // 1. 创建并提供了 HomeViewModel 的实例
    ChangeNotifierProvider(
      create: (context) => HomeViewModel(),
      child: const MyApp(), // 2. MyApp 及其所有子组件都能访问到 HomeViewModel
    ),
  );
}
```

#### 核心概念 3: `Consumer` / `context.watch` (监听器)

`Consumer` (或 `context.watch`) 负责从 `Provider` 获取 `ViewModel` 并**监听**其变化。

* **`Consumer` (组件方式)**:
    * 是一个 Widget，它会**只重建**其 `builder` 内部的组件，性能较好。
    * `builder` 提供三个参数：`context`、`viewModel` (我们需要的VM实例) 和 `child`。

* **`context.watch<T>()` (Hook 方式 - 更常用)**:
    * 在 `build` 方法内部调用。
    * 它会告诉 Flutter：“我依赖 `HomeViewModel`，当它调用 `notifyListeners()` 时，请**重建整个**调用了 `watch` 的 `build` 方法”。

**代码实践 (解答：“为啥vm就能拿到bannerlist的值”)**

**连接流程如下：**

1.  `HomeViewModel` (`VM`) 自己负责调用 API 并获取数据，然后将数据存入 `VM.bannerList` 变量中。
2.  获取数据后，`VM` 调用 `notifyListeners()`。
3.  `ChangeNotifierProvider` 在 `main.dart` 中创建了这个 `VM` 实例。
4.  `Consumer` (或 `context.watch`) 在 `HomePage` 中监听这个 `VM`。
5.  当 `Consumer` 收到 `notifyListeners()` 信号时，它会**自动重建**，并访问 `VM` 实例上**已经更新好**的 `bannerList` 数据，从而刷新UI。

```dart
// 示例：home_page.dart
class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    // 第一次加载时，获取 VM 实例并调用其方法
    // 使用 context.read 不会监听变化，适合在 initState 或 onTap 中调用方法
    context.read<HomeViewModel>().fetchBanners();
  }

  @override
  Widget build(BuildContext context) {
    // 1. 使用 watch 来监听 HomeViewModel 的变化
    final vm = context.watch<HomeViewModel>();

    return Scaffold(
      body: ListView.builder(
        // 2. vm 上的 bannerList 已经是最新的了
        itemCount: vm.bannerList.length, 
        itemBuilder: (context, index) {
          // 3. 使用数据渲染UI
          return Text(vm.bannerList[index].title);
        },
      ),
    );
  }
}
```

* **`context.read<T>()`**: 仅**读取**一次 `VM` 实例，**不**监听后续变化。适合在 `initState` 或 `onPressed` 中调用 `VM` 的方法。
* **`context.watch<T>()() `**: **读取**并**持续监听** `VM` 的变化。适合在 `build` 方法中获取数据以渲染UI。

## 5. 异步编程 (Async)

网络请求等耗时操作不能阻塞UI线程。Dart 使用 `Future` 来处理这类**异步操作**。

### `Future`、`async` 和 `await`

* **Future**: 一个“未来的凭证”或“快递单”。调用异步函数时，它不会立即给你结果，而是先给你一个 `Future`。
* **async**: 用来标记一个函数是**异步函数**，这个函数会自动返回一个 `Future`。
* **await**: 只能用在 `async` 函数内部，意思是“**在这里暂停，一直等到这个 `Future` 有结果了，再继续往下执行**”。

**代码实践 (home_vm.dart):**
```dart
// 'async' 标记这是一个异步函数
static Future getBanner() async { 
  Dio dio = Dio();
  // ...
  // 'await' 在这里暂停，直到 dio.get() 这个 Future 完成
  Response response = await dio.get("/banner/json"); 
  // Future 完成后，才会执行下面的 print 和 return
  print("response===>${response.data}");
  return response.data;
}
```

## 6. Dart 进阶与包管理

### `static` 静态成员详解

`static` 关键字修饰的成员（变量或方法）**属于类本身，而不是类的某个具体实例（对象）**。

* **非静态成员 (实例成员)**: 像“房子的家具”，必须先创建实例（盖房子）才能访问。
* **静态成员 (static)**: 像“建筑图纸上的规范”，不需要创建实例，直接通过**类名**访问。
* **用法**: `RoutePaths.home`, `HomeViewModel.getBanner()`。

### `var` (类型推断) vs. `Dio` (显式类型)

* **var**: `var dio = Dio();`。Dart 编译器自动推断 `dio` 的类型是 `Dio`。
* **Dio**: `Dio dio = Dio();`。明确地告诉编译器 `dio` 变量的类型**必须是** `Dio`。
* **推荐**: 在团队协作中，显式类型 (`Dio dio`) 可读性更强、意图更明确。

### 包管理 (`pub.dev`)

* **pub.dev**: Dart 和 Flutter 官方的包（Package）仓库，类似组件的应用商店。
* **pubspec.yaml**: 项目的“依赖清单”。
* **flutter pub get**:
    1.  读取 `pubspec.yaml`。
    2.  去 `pub.dev` 下载包的源代码（.dart 文件）。
    3.  存储在本地缓存中。
    4.  在 `.dart_tool/package_config.json` 中创建映射（地址簿），告诉 `import` 语句去哪里找文件。