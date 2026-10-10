# python学习笔记

## 官网

- Python 官网：https://www.python.org/
- Python 下载：https://www.python.org/downloads/
- Python 中文文档：https://docs.python.org/zh-cn/3/
- PyCharm 官网：https://www.jetbrains.com/pycharm/
- PyCharm 下载：https://www.jetbrains.com/pycharm/download/
- VS Code 官网：https://code.visualstudio.com/

Python 是编程语言，PyCharm 和 VS Code 是编写代码的编辑工具。

## Python 的下载安装

本文按 Windows 环境整理，目前已安装的版本是 Python 3.14.8。

1. 打开 Python 3.14.8 下载页：https://www.python.org/downloads/release/python-3148/
2. 滑到下方 Files 表格，选择 **Windows installer (64-bit)**，下载传统 `.exe` 安装包（适用于常见的 Intel / AMD 64 位电脑）。
3. 打开安装包，勾选 **Add python.exe to PATH**，让终端能够找到 Python。
4. 点击 **Install Now** 完成安装。
5. 重新打开终端，检查安装结果：

```powershell
python --version
```

显示 `Python 3.14.8`，说明终端可以正常找到 Python。

官网下载页也提供 Python Install Manager。如果 `.msix` 安装包提示“使用了某些受限制的功能”，可以改用上面的传统 `.exe` 安装包。

## 环境准备

**Python、pip 与编辑器的区别：**

| 工具              | 作用                               | 前端中的对应                               |
| ----------------- | ---------------------------------- | ------------------------------------------ |
| Python 解释器     | 运行 Python 代码                   | Node.js                                    |
| pip               | 安装第三方库                       | npm                                        |
| PyCharm / VS Code | 编写、运行和调试代码               | 编辑器 / IDE                               |
| 虚拟环境 `.venv`  | 隔离不同项目的 Python 和第三方依赖 | 项目独立依赖环境，机制与 node_modules 不同 |

**检查 pip：**

```powershell
python -m pip --version
```

传统安装包通常已包含 pip。如果提示 `No module named pip`，执行：

```powershell
python -m ensurepip --upgrade
```

安装第三方库，例如 requests：

```powershell
python -m pip install requests
```

`python -m pip` 表示使用当前 Python 运行 pip，可以减少多个 Python 版本之间装错库的问题。

**创建项目虚拟环境：**

在项目文件夹的终端执行：

```powershell
python -m venv .venv
```

`.venv` 保存项目独立的运行环境。代码放在项目目录中，不要放进 `.venv`。

即使不激活环境，也可以直接使用它：

```powershell
.\.venv\Scripts\python.exe hello.py
.\.venv\Scripts\python.exe -m pip install requests
```

在 VS Code 中安装 Microsoft 发布的 Python 扩展，然后通过 `Ctrl + Shift + P` → `Python: Select Interpreter` 选择 `.venv` 中的解释器。

**选择 Python 版本：**

pip 不负责切换 Python 版本。需要先安装对应版本，再选择它运行代码。传统安装包附带的 `py` 启动器可以查看已安装版本：

```powershell
py -0p
```

如果同时安装了 3.13 和 3.14，可以分别启动：

```powershell
py -3.13
py -3.14
```

这些命令选择本次运行的解释器，不会自动修改所有项目的版本。

## 新建项目

项目可以理解为装代码的文件夹，里面只有一个 `.py` 文件也可以。

| 方式                | 含义                           | 适合场景           |
| ------------------- | ------------------------------ | ------------------ |
| 打开已有 `.py` 文件 | 编辑一个代码文件               | 语法练习、小脚本   |
| 打开已有文件夹      | 将已有代码作为项目管理         | 自己已经有代码目录 |
| 新建项目            | 创建目录并配置解释器或虚拟环境 | 从头开始学习或开发 |

**使用自己的文件：**

1. 新建文件夹，例如 `python-learning`。
2. 把自己的 `.py` 文件放进去。
3. 在 PyCharm 中选择 `File → Open`，打开这个文件夹。
4. 如果提示配置解释器，选择已安装的 Python，或项目的 `.venv` 解释器。
5. 右键 `.py` 文件，选择 `Run`。

**在 PyCharm 新建项目：**

1. 点击 `New Project`。
2. 选择项目保存位置。
3. 配置 Python 解释器；可以基于已安装的 Python 创建虚拟环境。
4. 在项目中右键 → `New → Python File`，创建 `hello.py`。

不同 PyCharm 版本的选项名称可能略有区别，核心是确定项目目录和 Python 解释器。

## 文件怎么运行

Python 文件后缀是 `.py`。

创建 `hello.py`，写入并保存：

```python
print("你好，Python！")
```

**通过终端运行：**

在文件所在目录执行：

```powershell
python hello.py
```

输出：

```text
你好，Python！
```

如果终端不在文件所在目录，可以使用完整路径（替换为自己的实际路径）：

```powershell
python "D:\python-learning\hello.py"
```

**通过 PyCharm 运行：**

右键代码文件 → `Run`，在下方运行窗口查看输出。

**交互模式与终端的区别：**

- 终端中输入 `python`，会进入交互模式，提示符是 `>>>`。
- `>>>` 后面输入的是 Python 代码，不要输入 `python hello.py` 或 pip 安装命令。
- 输入 `exit()` 并回车退出，再执行终端命令。

## Python 中常见的数据类型

| 类型       | 中文名   | 示例                   | 作用               |
| ---------- | -------- | ---------------------- | ------------------ |
| `int`      | 整数     | `25`、`-5`             | 数量、年龄、次数   |
| `float`    | 浮点数   | `3.14`、`19.9`         | 小数、价格、比例   |
| `bool`     | 布尔值   | `True`、`False`        | 条件判断           |
| `str`      | 字符串   | `"你好"`               | 文字、名字、消息   |
| `list`     | 列表     | `[1, 2, 3]`            | 按顺序存放多个数据 |
| `tuple`    | 元组     | `(1, 2, 3)`            | 保存固定组合       |
| `set`      | 集合     | `{1, 2, 3}`            | 去重、判断是否存在 |
| `dict`     | 字典     | `{"name": "Shanoria"}` | 保存键值对应关系   |
| `NoneType` | 空值类型 | `None`                 | 表示没有值         |

初学重点：`int`、`float`、`bool`、`str`、`list`、`dict` 和 `None`。

**容器类型的区别：**

- 列表：有顺序，可以增删修改，允许重复，下标从 0 开始。
- 元组：有顺序，不能直接增删或替换元素，允许重复。如果元素本身是列表等可变对象，该对象内部仍可修改。
- 集合：元素不重复，不支持通过下标获取元素。
- 字典：通过键找值，键不能重复，值可以重复；保留插入顺序。
- 空字典写作 `{}`；空集合写作 `set()`。
- 字符串不可变，不能直接修改其中某个字符。
- `None` 与 `0`、空字符串、空列表不是同一个值。
- 布尔值首字母大写：`True`、`False`。

**字典示例：**

```python
user = {
    "name": "Shanoria",
    "age": 25,
    "is_student": True
}

print(user["name"])  # Shanoria
user["age"] = 26     # 修改
user["city"] = "大连" # 添加
del user["is_student"]  # 删除

print(user.get("email"))  # 不存在时返回 None
```

字符串键需要加引号。获取值用 `user["name"]`，不能用 `user.name`。直接访问不存在的键会报 `KeyError`。

## 数据类型转换

通过目标类型的函数转换数据，转换会返回结果，通常不会修改原变量。

| 方法      | 作用                 | 示例                           | 结果                     |
| --------- | -------------------- | ------------------------------ | ------------------------ |
| `int()`   | 转成整数             | `int("123")`                   | `123`                    |
| `float()` | 转成浮点数           | `float("3.14")`                | `3.14`                   |
| `str()`   | 转成字符串           | `str(123)`                     | `"123"`                  |
| `bool()`  | 转成布尔值           | `bool(0)`                      | `False`                  |
| `list()`  | 转成列表             | `list("abc")`                  | `["a", "b", "c"]`        |
| `tuple()` | 转成元组             | `tuple([1, 2])`                | `(1, 2)`                 |
| `set()`   | 转成集合             | `set([1, 1, 2])`               | `{1, 2}`，显示顺序不保证 |
| `dict()`  | 从键值对序列创建字典 | `dict([("name", "Shanoria")])` | `{"name": "Shanoria"}`   |

**保存转换结果：**

```python
num = "123"
num = int(num)
print(num)        # 123
print(type(num))  # <class 'int'>
```

**连续嵌套调用：**

```python
num = "123"
print(type(int(num)))  # <class 'int'>
print(type(num))       # <class 'str'>
```

按从里到外执行：先 `int(num)`，再 `type(...)`，最后 `print(...)`。这里只检查了转换结果，原来的 `num` 仍然是字符串。

**转换注意事项：**

```python
print(int(3.9))   # 3，去掉小数部分，不是四舍五入
print(int(-3.9))  # -3
print(int(float("3.14")))  # 3，先转浮点数再转整数
```

`int("3.14")`、`int("你好")` 都会报 `ValueError`。数据必须符合目标类型的转换要求。

**布尔值转换：**

常见假值：`False`、`None`、`0`、`0.0`、`""`、`[]`、`{}`、`()`、`set()`。

```python
print(bool(0))        # False
print(bool(""))       # False
print(bool("你好"))   # True
print(bool("False"))  # True
print(bool("0"))      # True
```

`"False"` 和 `"0"` 是非空字符串，所以结果是 `True`。

**用户输入：**

`input()` 返回字符串，做数字运算前需要转换：

```python
age = int(input("请输入年龄："))
print(age + 1)
```

输入 `25`，输出 `26`；输入无法转换为整数的内容会报错。

## 注释怎么写

**单行注释用 `#`：**

```python
# 保存用户名字
name = "Shanoria"
age = 25  # 注释也可以写在代码后面
```

**多行注释通常每行都加 `#`：**

```python
# 保存用户信息
# 包括名字和年龄
# 后面用于输出
user = {"name": "Shanoria", "age": 25}
```

Python 没有 JavaScript 中 `/* ... */` 这样的多行注释语法。

**三引号表示多行字符串：**

```python
"""
这是一段多行字符串
可以包含多行文字
"""
```

三引号不是真正的注释。放在模块、函数或类的开头时，可以作为文档字符串说明用途。普通代码注释优先使用 `#`。

PyCharm 和 VS Code 在 Windows 默认快捷键配置下，选中多行按 `Ctrl + /`，可以批量添加或取消注释。

## 变量定义

格式是 `变量名 = 值`，不需要 JavaScript 中的 `let`、`const`、`var`。

```python
name = "Shanoria"
age = 25
price = 19.9
is_student = True
hobbies = ["旅游", "游戏"]
user = {"name": "Shanoria"}
result = None
```

不需要提前声明类型。更准确地说，值（对象）有类型，变量名指向这个值。

**重新赋值：**

```python
value = 100
value = "你好"
```

同一个变量名可以先后指向不同类型的值。

**命名规则：**

- 区分大小写：`name` 和 `Name` 是不同变量。
- 不能以数字开头。
- 不能使用空格或连字符；多个单词通常用下划线，例如 `user_name`。
- 不能使用 `if`、`class` 等关键字。
- 尽量不要用 `str`、`list`、`type` 等内置名称作为变量名，以免影响后续调用。

## 查看数据类型

- `print(变量)`：输出变量的值。
- `type(变量)`：获取变量所指向值的类型。
- `print(type(变量))`：输出这个类型。

```python
age = 25
print(age)        # 25
print(type(age))  # <class 'int'>
```

**常见类型的输出：**

```python
print(type("你好"))       # <class 'str'>
print(type(19.9))         # <class 'float'>
print(type(True))         # <class 'bool'>
print(type([1, 2, 3]))    # <class 'list'>
print(type((1, 2, 3)))    # <class 'tuple'>
print(type({1, 2, 3}))    # <class 'set'>
print(type({"age": 25}))  # <class 'dict'>
print(type(None))         # <class 'NoneType'>
```

**重新赋值后，查看当前类型：**

```python
value = 100
print(type(value))  # <class 'int'>

value = "你好"
print(type(value))  # <class 'str'>
```