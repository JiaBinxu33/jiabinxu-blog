# flutter环境配置与踩坑总结
## 第一阶段：安装与环境配置

这个阶段的目标是让您的电脑认识 Flutter 和 Android 的所有命令行工具。

1. **您需要做什么：** 准备 Flutter 和 Android 的开发环境。
   - **遇到的第一个错误：** `avdmanager is missing` (缺少安卓虚拟设备管理器)。
     - **原因：** 您的 Android SDK 安装不完整，缺少了核心的“命令行工具”组件。
     - **解决方案：** 在 Android Studio 的 **SDK Manager -> SDK Tools** 选项卡中，勾选并安装 **Android SDK Command-line Tools**。
   - **遇到的第二个错误：** `Unable to find suitable Visual Studio toolchain` (找不到 VS 工具)。
     - **原因：** 您尝试在 Windows 平台运行 App，但这需要 C++ 的编译环境，而您没有安装对应的 Visual Studio 组件。
     - **解决方案：** 运行 **Visual Studio Installer**，选择“修改”，然后勾选并安装 **“使用 C++ 的桌面开发”** 工作负载。
   - **遇到的第三个错误：** `flutter doctor` 提示 `Some Android licenses not accepted` (安卓许可证未接受)。
     - **原因：** 您还没有同意 Android SDK 的用户协议。
     - **解决方案：** 在终端中运行 `flutter doctor --android-licenses` 命令，然后一路输入 `y` 同意所有协议。



## 第二阶段：创建项目与首次编译



这是最容易出错的阶段，核心问题都围绕着 **Gradle 构建系统** 和 **网络环境**。

1. **您需要做什么：** 创建一个新 Flutter 项目并尝试在模拟器上运行它。
   - **遇到的第一个错误：** 编译时卡住不动，最后报出 `java.net.SocketException` (网络连接超时)。
     - **原因：** 项目的构建工具 Gradle 需要从国外的官方服务器下载依赖，但您的网络环境访问这些服务器非常缓慢或不稳定。
     - **解决方案：** **配置国内镜像源**。我们修改了项目中的 `android/build.gradle.kts` 和 `android/settings.gradle.kts` 文件，将下载地址从 `google()` 和 `mavenCentral()` 替换为了速度更快的阿里云镜像。
   - **遇到的第二个错误：** 修改镜像后，报出 `Unexpected tokens` 或 `Plugin ... not found` 等语法和插件版本错误。
     - **原因：**
       1. 最初的镜像配置语法不兼容您项目的 Kotlin 脚本 (`.kts`) 文件。
       2. 在修改过程中，可能不小心将安卓插件版本号改为了一个不存在的 `8.9.1`。
     - **解决方案：**
       1. 为您提供了适用于 `.kts` 文件的正确语法 (`url = uri("...")`)。
       2. 最终我们通过**创建一个全新的干净项目**来查找官方推荐的正确版本号，再把它复制回您的项目中，从而解决了版本错误问题。
   - **遇到的第三个错误：** `Your project path contains non-ASCII characters` (项目路径含中文字符)。
     - **原因：** 您的项目存放在了 `D:\web前端\` 目录下，Windows 上的安卓构建工具无法处理路径中的中文。
     - **解决方案：** 将项目移动到一个**纯英文**的路径下（例如 `D:\web_frontend\`），彻底解决了这个问题。



## 第三阶段：编码与调试



成功运行 App 后，您开始尝试修改代码并理解其工作原理。

1. **您需要做什么：** 学习基础语法，修改 App 内容并查看效果。
   - **遇到的第一个困惑：** 修改了 `MaterialApp` 中的 `title`，但模拟器顶部的标题栏文字没有变。
     - **原因：** 您修改的是 App 的“内部名称”（用于任务切换器等），而不是页面上实际显示的标题。
     - **解决方案：** 为您指出了真正控制页面标题的代码位置，即传递给 `MyHomePage` 组件的 `title` 参数：`home: const MyHomePage(title: '我的第一个App')`。
   - **遇到的第二个困惑：** 拆分组件到新文件后，出现了满屏的红线报错。
     - **原因：** 您对 `StatefulWidget` 的标准写法不熟悉，两个类重名且 `createState` 方法实现错误。
     - **解决方案：** 为您提供了 `StatefulWidget` 的标准模板，解释了 Widget 类和 State 类必须分开且命名规范，`createState` 必须准确返回 State 类的实例。
   - **遇到的一个持续性干扰：** VS Code 不断弹出 `shellsheck not installed properly` 的错误。
     - **原因：** 这个问题**与 Flutter 无关**。是您的 VS Code 中安装了一个名为 “ShellCheck” 的插件（可能是被其他插件包附带安装的），但它依赖的核心程序没有安装。
     - **解决方案：** 既然您不编写 Shell 脚本，最佳方法是在 VS Code 的**“扩展”**面板中搜索并**卸载**这个插件，一了百了。



## 第四阶段：环境优化



为了更好的开发体验和节省 C 盘空间，您希望自定义工具的存储位置。

1. **您需要做什么：** 将 **Android SDK** 和**安卓模拟器 (AVD)** 的存储位置从 C 盘移到 D 盘。
   - **原因：** C 盘空间紧张，且将开发工具统一存放更利于管理。
   - **解决方案：**
     1. **对于 Android SDK：** 在 Android Studio 设置中重新指定 D 盘路径让其重新下载，然后更新系统的 `ANDROID_HOME` 环境变量。
     2. **对于安卓模拟器 (AVD)：** 新建一个 `ANDROID_AVD_HOME` 环境变量指向 D 盘的新文件夹，然后将 `C:\Users\用户名\.android\avd` 目录下的旧文件移动过去。