# python 学习笔记

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

## 百分号格式化与占位符

占位符用于在字符串中预留位置，再填入对应的值。

基本写法：`"包含占位符的字符串" % 值`。

```python
name = "Shanoria"
print("姓名：%s" % name)  # 姓名：Shanoria
```

多个占位符使用元组提供多个值，按从左到右的顺序填入：

```python
name = "Shanoria"
age = 25
print("姓名：%s，年龄：%d" % (name, age))
# 姓名：Shanoria，年龄：25
```

占位符数量与提供的值要匹配，值也要满足对应格式的要求。

## 常用格式符

| 格式符 | 含义                                     | 示例                | 输出           |
| ------ | ---------------------------------------- | ------------------- | -------------- |
| `%s`   | 转成字符串形式显示                       | `"%s" % 25`         | `25`           |
| `%d`   | 按十进制整数形式显示                     | `"%d" % 25`         | `25`           |
| `%f`   | 按定点小数形式显示，默认保留 6 位小数    | `"%f" % 3.14`       | `3.140000`     |
| `%e`   | 按科学计数法显示                         | `"%e" % 1234`       | `1.234000e+03` |
| `%%`   | 百分号格式化时输出一个百分号，不消耗参数 | `"进度：%d%%" % 50` | `进度：50%`    |

这些操作生成字符串，不会改变原变量的类型或值。

## 最小宽度

`%5.2f` 中的 `5` 表示：格式化后的数字至少占 5 个字符位置。

宽度包含整数部分、小数点、小数部分和负号。不足宽度时默认在左边补空格；超过宽度时完整显示，不截断。

```python
print("|%5.2f|" % 3.14)    # | 3.14|
print("|%5.2f|" % 12.34)   # |12.34|
print("|%5.2f|" % 123.45)  # |123.45|
```

| 格式化后的内容 | 字符数 | 最小宽度为 5 时 |
| -------------- | ------ | --------------- |
| `3.14`         | 4      | 左边补 1 个空格 |
| `12.34`        | 5      | 不补空格        |
| `123.45`       | 6      | 完整显示        |

宽度按格式化后的结果计算，不按原始数字计算。

```python
print("|%6.2f|" % 123.452)  # |123.45|
print("|%7.2f|" % 123.452)  # | 123.45|
```

`123.45` 中，整数部分占 3 个字符，小数点占 1 个，小数部分占 2 个，合计 6 个。

## 浮点数精度与舍入

对于 `%f`，`.2` 表示保留两位小数，会进行舍入，不是直接截去后面的数字。

```python
print("%.2f" % 12.346)     # 12.35
print("%.2f" % -12.3451)  # -12.35
print("%.2f" % 25)        # 25.00
```

小数位不足时补零。

舍入可能导致整数部分进位：

```python
print("%.2f" % 999.999)   # 1000.00
print("%5.2f" % 999.999)  # 1000.00
```

理解过程：保留两位小数时，第三位小数是 9，需要进位；前两位小数都是 9，因此连续进位到整数部分，最终得到 `1000.00`。

`1000.00` 占 7 个字符，即使最小宽度是 5，也会完整输出。

学习时可以记成：先处理精度和舍入，再计算字符数，最后补空格。

注意：浮点数采用二进制近似存储，恰好位于舍入边界附近的十进制数字，结果可能与直觉中的“五入”不同；不要把所有情况都当作简单的十进制四舍五入。

## 字符串精度与截取

对于 `%s`，`.2` 表示最多显示前两个字符，不表示小数位数。

```python
print("%.2s" % "Python")   # Py
print("%.3s" % "Python")   # Pyt
print("|%6.2s|" % "Python")  # |    Py|
```

`%6.2s` 的处理过程：

1. 从 `Python` 中取前两个字符，得到 `Py`。
2. `Py` 占 2 个字符。
3. 最小宽度为 6，左边补 4 个空格。

如果字符串本来就不足指定精度，不会因为精度而补字符；宽度仍可以补空格。

| 格式    | 宽度            | 精度               |
| ------- | --------------- | ------------------ |
| `%6.2f` | 至少占 6 个字符 | 保留两位小数       |
| `%6.2s` | 至少占 6 个字符 | 最多显示前两个字符 |

## f-string 的基本用法

在字符串引号前加 `f`，就可以在 `{}` 中填写变量或表达式。

```python
name = "Shanoria"
age = 25

print(f"我叫{name}，今年{age}岁")
# 我叫Shanoria，今年25岁

print(f"明年我{age + 1}岁")
# 明年我26岁
```

引号前的 `f` 不代表浮点数，字符串、整数等都可以填入。

字符串边界使用英文直引号 `"` 或 `'`，不能用中文弯引号 `“ ”` 替代。

## f-string 中控制宽度与精度

写法：`f"{变量:格式规则}"`。

冒号 `:` 左边是变量或表达式，右边是格式规则。

```python
price = 3.14159

print(f"{price:.2f}")     # 3.14
print(f"|{price:6.2f}|")  # |  3.14|

```

`6.2f` 表示最小宽度为 6，保留两位小数，按定点小数形式显示。

字符串也可以指定精度，但默认对齐方向与百分号格式化不同：

```python
name = "Python"
print(f"|{name:6.2s}|")   # |Py    |
print(f"|{name:>6.2s}|")  # |    Py|

```

f-string 中，字符串默认左对齐，数字默认右对齐；`>` 可以明确指定右对齐。

## 两种 f 的区别

在 `f"{price:6.2f}"` 中，两个 `f` 的作用不同。

| 所在位置           | 作用                                    |
| ------------------ | --------------------------------------- |
| 引号前的 `f`       | 开启 f-string，计算并填入 `{}` 中的内容 |
| 格式规则末尾的 `f` | 指定数字按定点小数形式显示              |

```python
price = 3.14159

print("%.2f" % price)  # 3.14，百分号格式化
print(f"{price:.2f}")  # 3.14，f-string

```

前面的 `f` 管填入变量，格式规则中的 `f` 管数字怎么显示。

## 百分号格式化与 f-string 的对应

| 需求                                  | 百分号格式化      | f-string          |
| ------------------------------------- | ----------------- | ----------------- |
| 填入名字                              | `"%s" % name`     | `f"{name}"`       |
| 显示整数 age                          | `"%d" % age`      | `f"{age:d}"`      |
| 保留两位小数                          | `"%.2f" % price`  | `f"{price:.2f}"`  |
| 最小宽度 6，保留两位小数              | `"%6.2f" % price` | `f"{price:6.2f}"` |
| 字符串最多取 2 个字符，宽度 6，右对齐 | `"%6.2s" % name`  | `f"{name:>6.2s}"` |

表格中的整数写法以变量本身为整数为前提；两套格式化语法不是所有情况下都能直接机械替换。

综合示例：

```python
name = "Shanoria"
score = 92.356

print("姓名：%s，成绩：%6.2f" % (name, score))
print(f"姓名：{name}，成绩：{score:6.2f}")
```

两行输出相同：

```text
姓名：Shanoria，成绩： 92.36
```

`92.36` 占 5 个字符，最小宽度为 6，因此成绩前补 1 个空格。

## 示例中的边界标记与空格标记

```python
print("|%6.2f|" % 3.14)  # |  3.14|
```

两边的 `|` 是普通字符串字符，只用于标明边界，方便观察空格，没有特殊格式化作用，也不计入占位符宽度。

练习答案中的 `□` 用于表示一个空格；它是说明标记，程序实际输出的仍然是空格。

不需要边界时可以去掉：

```python
print("%6.2f" % 3.14)
```

## 数据输入：input()

`input()` 接收用户在终端输入的内容，返回值始终是字符串。括号内可以填写提示文字。

```python
name = input("请输入姓名：")
age = int(input("请输入年龄："))
print(f"姓名：{name}，年龄：{age}")
```

需要参与数字计算时，使用 `int()` 或 `float()` 转换。输入不能转换的内容会报错，例如 `int("abc")`；异常处理后续学习。

## 布尔类型和比较运算符

布尔值只有 `True` 和 `False`，首字母大写，对应 JavaScript 的 `true` 和 `false`。

| 运算符     | 含义               |
| ---------- | ------------------ |
| `==`       | 等于               |
| `!=`       | 不等于             |
| `>`、`<`   | 大于、小于         |
| `>=`、`<=` | 大于等于、小于等于 |

`=` 用于赋值，`==` 用于比较。Python 没有 JavaScript 的 `===`。

```python
age = 25
print(age >= 18)  # True
print(age == 18)  # False
```

Python 可以使用连续比较：`6 <= age <= 17`，等价于 `age >= 6 and age <= 17`。不要按这个方式写 JavaScript。

## 逻辑运算符：and、or、not

| 含义 | Python | JavaScript |
| ---- | ------ | ---------- | --- | --- |
| 并且 | `and`  | `&&`       |
| 或者 | `or`   | `          |     | `   |
| 取反 | `not`  | `!`        |

```python
age = 25
print(age >= 18 and age <= 59)  # True
print(age < 0 or age > 120)    # False
print(not True)               # False
```

`and not` 可以连着使用，表示“条件 1 成立，并且条件 2 不成立”。

```python
c = 9
if c % 3 == 0 and not (c % 5 == 0):
    print("能被3整除，但不能被5整除")
```

上面的条件也可以写成 `c % 3 == 0 and c % 5 != 0`。

数字 `0` 在条件中视为假，非零数字视为真。因此：

- `c % 3` 为真：余数不为零，表示不能被 3 整除。
- `not (c % 5)` 为真：余数为零，表示能被 5 整除。
- 初学时建议明确写出 `== 0`、`!= 0`，避免把条件写反。

## if 和 else：基本判断

```python
age = int(input("请输入年龄："))

if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

- 条件后写冒号 `:`，代码块使用缩进，通常为 4 个空格。
- `else` 与对应的 `if` 对齐。
- Python 不用 JavaScript 的花括号组织代码块，条件也不必加括号。
- 条件成立执行 `if`，否则执行 `else`。

## elif：多个条件分支

Python 使用 `elif`，对应 JavaScript 的 `else if`。

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

从上到下判断，只执行第一个成立的分支，后面的分支不再判断。多个独立的 `if` 则会分别判断。

## 判断嵌套：门票案例

先判断年龄是否合法，再根据年龄和学生证确定票价。

```python
age = int(input("请输入年龄："))

if age < 0 or age > 120:
    print("请输入有效年龄")
else:
    if age <= 5:
        price = 0
    elif age <= 17:
        price = 30
    elif age <= 59:
        if input("有没有学生证（有/没有）：") == "有":
            price = 40
        else:
            price = 60
    else:
        price = 20

    print(f"票价：{price}元")
```

注意：

- `6 >= age >= 17` 表示年龄同时小于等于 6、大于等于 17，不可能成立；应写 `6 <= age <= 17`。
- 免费年龄包含 0 岁，应覆盖 `0 <= age <= 5`。
- 上面的代码先排除无效年龄，再按上限递增判断，前面的分支已排除较小年龄。
- 最后输出放在有效年龄的 `else` 中，避免无效输入时使用尚未赋值的 `price`。

## while 循环：基本语法

```python
count = 1

while count <= 5:
    print(count)
    count += 1

print("循环结束")
```

每轮先判断条件，成立才执行循环体，执行完再判断。上例依次输出 1 到 5。

循环体需要让条件最终变成假，否则可能产生无限循环。`count += 1` 等价于 `count = count + 1`。

## while 循环：自增位置与边界

条件检查时的值和循环体计算时的值可能不同，取决于先自增还是先计算。

```python
count = 0
sums = 0

while count < 100:
    count += 1
    if count % 2 == 0:
        sums += count

print(sums)  # 2550

```

这里检查条件时的 `count` 是 0 到 99，但自增后的计算值是 1 到 100。

| 轮次       |      检查条件时 | 自增后参与计算 |
| ---------- | --------------: | -------------: |
| 第一轮     |               0 |              1 |
| 第二轮     |               1 |              2 |
| 最后一轮   |              99 |            100 |
| 下一次检查 | 100，条件不成立 |         不执行 |

如果保持先自增，把条件改成 `count <= 100`，会额外处理 101。因为 101 是奇数，不参与偶数求和，所以结果仍然是 2550，但循环范围已经不同。

如果从 `count = 1` 开始，仍先自增，处理的是 2 到 100；虽然跳过了 1，但 1 不是偶数，因此偶数总和也相同。

另一种更直观的写法是先处理，再自增：

```python
count = 1
sums = 0

while count <= 100:
    if count % 2 == 0:
        sums += count
    count += 1

print(sums)  # 2550

```

不能只看 `<` 或 `<=` 判断实际处理范围，还要看变量初始值和自增位置。

## for 循环：遍历元素

Python 的 `for` 依次取出可迭代对象中的元素，类似 JavaScript 的 `for...of`。

```python
names = ["小明", "小红", "Shanoria"]

for name in names:
    print(name)

print("循环结束")

```

不需要手动递增变量。字符串也能直接遍历，每次取得一个字符。

```python
text = "banana and apple"
count = 0

for letter in text:
    if letter == "a":
        count += 1

print(f"字母a出现了{count}次")  # 字母a出现了5次

```

`banana` 有 3 个 a，`and` 有 1 个，`apple` 有 1 个，合计 5 个。之前题目中的 4 次是错误的，正确结果是 5 次。

最终输出放在循环外；放在循环内会每轮输出一次。

## range()：生成整数序列

常见形式：`range(stop)`、`range(start, stop)`、`range(start, stop, step)`。

- `start`：起始值，默认 0。
- `stop`：结束边界，不包含这个值。
- `step`：步长，默认 1，不能为 0。

| 写法              | 遍历时取得的数字 |
| ----------------- | ---------------- |
| `range(5)`        | 0、1、2、3、4    |
| `range(1, 6)`     | 1、2、3、4、5    |
| `range(2, 11, 2)` | 2、4、6、8、10   |

```python
for number in range(1, 6):
    print(number)

```

要遍历 1 到 n 并包含 n，使用 `range(1, n + 1)`。Python 的 `for` 不使用 JavaScript 的 `for (初始化; 条件; 更新)` 语法。

## for 综合练习：筛选、计数和求和

输入正整数 n，遍历 1 到 n，找出能被 3 整除、但不能被 5 整除的数字，并统计数量和总和。

```python
n = int(input("输入一个正整数："))
sums = 0
count = 0

for c in range(1, n + 1):
    if c % 3 == 0 and c % 5 != 0:
        print(c)
        sums += c
        count += 1

print(f"符合条件的数字有{count}个，总和是{sums}")

```

输入 20，符合条件的数字为 3、6、9、12、18，共 5 个，总和 48。

易错点：

- 判断当前遍历的数字 `c`，不要一直判断输入的上限 `n`。
- `int(input(...))` 已返回整数，不需要再对它执行一次 `int()`。
- 计数和求和变量在循环前初始化，在符合条件的分支中更新。
- `c % 3 and not c % 5` 语法正确，但含义是“不能被 3 整除、能被 5 整除”，与题目要求相反。

## 当前学习进度与待补内容

本次已学习或练习：数据输入、基本判断、elif、多层判断、while 基础、for 遍历、range 基础，以及筛选计数求和。

按照学习大纲，循环部分接下来还需要学习：

- while 和 for 的嵌套。
- 九九乘法表等嵌套循环练习。
- for 循环变量的作用域。
- continue 和 break。
- 猜数字等循环综合案例。

此前的“字面量”和“Python 解释器”尚未在聊天中确认系统学习完成，可后续补充。MacOS、Linux 安装属于拓展内容，可按需要学习。
