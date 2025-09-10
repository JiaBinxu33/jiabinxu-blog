# Mac 操作指南

目前设置了外接键盘 ctrl 和 command 键位，以模拟 windows

## 截图

全屏截图：shift+command+3

框选截图：shift+command+4

窗口截图：shift+command+4+空格

调出截图总菜单：shift+command+4

## 辅助软件

### Homebrew

mac 好用的包管理工具

#### Homebrew 常用命令及终端快捷操作指南

##### 1. 搜索软件包 (Formulas 和 Casks)

- 搜索所有类型 (命令行工具和图形应用):

  ```bash
  brew search <关键词>
  # 或者简写
  brew s <关键词>
  ```

  _示例:_ `brew search python`

- 仅搜索图形界面应用程序 (Casks):

  ```bash
  brew search --casks <关键词>
  ```

  _示例:_ `brew search --casks visual-studio-code`

##### 2. 安装软件包

- 安装命令行工具和库 (Formulas):

  ```bash
  brew install <软件包名称>
  ```

  _示例:_ `brew install git`

- 安装图形界面应用程序 (Casks):

  ```bash
  brew install --cask <应用程序名称>
  ```

  _示例:_ `brew install --cask firefox`

##### 3. 卸载软件包

- 卸载命令行工具和库:

  ```bash
  brew uninstall <软件包名称>
  ```

  _示例:_ `brew uninstall git`

- 卸载图形界面应用程序:

  ```bash
  brew uninstall --cask <应用程序名称>
  ```

  _示例:_ `brew uninstall --cask firefox`

##### 4. 更新与升级

- 更新 Homebrew 自身及软件包列表 (获取最新版本信息):

  ```bash
  brew update
  ```

  _(注意：此命令不升级已安装的包)_

- 升级所有已安装的软件包:

  ```bash
  brew upgrade
  ```

- 升级指定的命令行工具/库:

  ```bash
  brew upgrade <软件包名称>
  ```

  _示例:_ `brew upgrade git`

- 升级所有已安装的图形应用程序:

  ```bash
  brew upgrade --cask
  ```

- 升级指定的图形应用程序:

  ```bash
  brew upgrade --cask <应用程序名称>
  ```

  _示例:_ `brew upgrade --cask firefox`

##### 5. 查看信息

- 列出所有已安装的命令行工具和库:

  ```bash
  brew list
  # 或者简写
  brew ls
  ```

- 列出所有已安装的图形应用程序:

  ```bash
  brew list --cask
  ```

- 查看特定命令行工具/库的详细信息:

  ```bash
  brew info <软件包名称>
  ```

  _示例:_ `brew info python`

- 查看特定图形应用程序的详细信息:

  ```bash
  brew info --cask <应用程序名称>
  ```

  _示例:_ `brew info --cask visual-studio-code`

##### 6. 清理与维护

- 清理所有软件包的旧版本和下载缓存:

  ```bash
  brew cleanup
  ```

- 清理指定软件包的旧版本:

  ```bash
  brew cleanup <软件包名称>
  ```

- 显示将要被清理的文件 (不实际删除):

  ```bash
  brew cleanup -s
  ```

- 检查 Homebrew 配置问题并获取修复建议:

  ```bash
  brew doctor
  ```

##### 7. 获取帮助

- 显示常用命令概览:

  ```bash
  brew help
  ```

- 显示特定命令的帮助信息:

  ```bash
  brew help <命令名称>
  ```

  _示例:_ `brew help install`

- 显示 Homebrew 完整的 man 手册页:

  ```bash
  man brew
  ```

#### mos

解决 mac 鼠标滚轮反转问题

```bash
brew install --cask mos
```

#### maccy

剪切板工具，简洁处理剪切板，可显示剪切板

```bash
brew install --cask maccy
```

# 终端通用快捷操作

以下快捷键适用于 macOS 终端 (Terminal.app, iTerm2 等) 以及大多数 Linux 终端，可以极大提升命令行操作效率。

- `Ctrl + C`: 强制终止当前正在运行的命令。
- `Ctrl + A`: 将光标移动到命令行的开头。
- `Ctrl + E`: 将光标移动到命令行的末尾。
- `Ctrl + U`: 删除从光标到行首的所有字符。
- `Ctrl + K`: 删除从光标到行尾的所有字符。
- `Ctrl + W`: 删除光标前的一个单词。
- `Ctrl + L`: 清除终端屏幕显示内容。
- `Option (Alt) + ←` (左箭头): 光标向左移动一个单词。
- `Option (Alt) + →` (右箭头): 光标向右移动一个单词。
- `↑` (上箭头): 显示上一条执行过的历史命令。
- `↓` (下箭头): 显示下一条执行过的历史命令 (需先按上箭头)。
- `Ctrl + R`: 反向搜索命令历史 (输入关键词进行搜索)。
- `Tab`: 命令或路径自动补全 (非常实用！)。
  - 输入部分命令或文件名/路径后按 `Tab`，终端会尝试自动补全。
  - 如果存在多个匹配项，连按两次 `Tab` 通常会列出所有可能的选项。

# macOS 开发环境配置笔记 ( 2025-05)

本文档总结了在 macOS 上配置常用开发工具的步骤，包括版本管理工具 NVM、Node.js、安全连接工具 SSH 以及版本控制系统 Git。

## 一、Git 版本控制系统

Git 是现代软件开发中必不可少的版本控制系统。

### A. 安装 Git

在 macOS 上安装 Git 通常有以下几种方式：

1. **通过 Xcode Command Line Tools (命令行开发者工具):**

   - 打开“终端 (Terminal.app)”，输入 `git --version`。如果尚未安装，系统会提示安装。

2. **通过 Homebrew (推荐的包管理器):**

   - 如果已安装 Homebrew，运行：

     ```bash
     brew install git
     ```

3. **从 Git 官网下载:**

   - 访问 [https://git-scm.com/download/mac](https://git-scm.com/download/mac) 下载安装程序。

### B. Git 基本配置

首次使用 Git 前，建议配置您的用户信息：

```bash
git config --global user.name "你的名字或昵称"
git config --global user.email "你的邮箱地址"
```

### C. 拉取 (克隆) 项目

从远程仓库获取项目到本地：

1. **获取仓库 URL:**

   - HTTPS URL: 例如 `https://github.com/username/repository.git`
   - SSH URL: 例如 `git@github.com:username/repository.git`

2. **打开终端，导航到目标本地目录 (例如 `cd ~/Documents/Projects`)。**

3. **执行克隆命令:**

   Bash

   ```
   # 使用 HTTPS
   git clone [https://github.com/username/repository.git](https://github.com/username/repository.git)

   # 或者使用 SSH (需先完成 SSH 配置)
   git clone git@github.com:username/repository.git

   # 克隆并指定本地文件夹名称 (可选)
   git clone <repository_url> <your_folder_name>
   ```

4. **进入项目目录:**

   Bash

   ```
   cd repository_name # 或者你指定的文件夹名称
   ```

### D. Git 常用命令概览

- `git status`: 查看当前仓库状态。
- `git add <file>` 或 `git add .`: 将文件更改添加到暂存区。
- `git commit -m "提交信息"`: 将暂存区的更改提交到本地仓库。
- `git push`: 将本地提交推送到远程仓库。
- `git pull`: 从远程仓库拉取最新更改并合并到本地。
- `git branch`: 查看、创建或删除分支。
- `git checkout <branch_name>`: 切换分支。
- `git merge <branch_name>`: 合并分支。
- `git log`: 查看提交历史。

## 二、SSH 密钥配置 (macOS)

SSH 密钥用于安全地连接到远程服务器。

### A. 检查现有 SSH 密钥

Bash

```
ls -al ~/.ssh
```

查看是否存在 `id_rsa`、`id_ed25519` (及对应的 `.pub`公钥文件)。

### B. 生成新的 SSH 密钥对

如果不存在或想创建新的：

1. 运行 `ssh-keygen` 命令 (推荐 Ed25519):

   Bash

   ```
   # 推荐使用 Ed25519 算法
   ssh-keygen -t ed25519 -C "你的邮箱地址"

   # 或者使用 RSA 算法 (4096位)
   # ssh-keygen -t rsa -b 4096 -C "你的邮箱地址"
   ```

2. 按提示操作：

   - **文件保存位置：** 直接回车使用默认路径 (如 `~/.ssh/id_ed25519`)。
   - **设置密码短语 (Passphrase)：** 强烈建议设置。

### C. 将 SSH 私钥添加到 ssh-agent 并使用 macOS Keychain

1. **确保 ssh-agent 运行并配置 `~/.ssh/config`:**

   Bash

   ```
   # 确保 ssh-agent 在当前会话运行 (通常 macOS 会自动处理)
   eval "$(ssh-agent -s)"

   # 打开或创建 ~/.ssh/config 文件，例如使用 nano
   # nano ~/.ssh/config
   ```

   在 `~/.ssh/config` 文件中添加以下内容 (如果文件已存在，请确保 `Host *` 配置不冲突)：

   ```
   Host *
     AddKeysToAgent yes
     UseKeychain yes
     IdentityFile ~/.ssh/id_ed25519  # 如果使用RSA, 改为 id_rsa
   ```

   保存文件后，确保其权限正确：

   Bash

   ```
   chmod 600 ~/.ssh/config
   ```

2. **将私钥添加到 ssh-agent (并由 Keychain 管理密码短语):** 将 `~/.ssh/id_ed25519` 替换为你的实际私钥文件名。

   Bash

   ```
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

   系统会提示输入私钥的密码短语。

### D. 复制公钥内容

公钥需要添加到远程服务器或服务 (如 GitHub) 上。

Bash

```
# Ed25519 公钥
pbcopy < ~/.ssh/id_ed25519.pub

# RSA 公钥 (如果使用 RSA)
# pbcopy < ~/.ssh/id_rsa.pub
```

此命令会将公钥内容复制到剪贴板。或者使用 `cat ~/.ssh/id_ed25519.pub` 查看并手动复制。

### E. 将公钥添加到远程服务

登录你的 GitHub/GitLab 等账户，在 SSH 密钥设置页面，添加新 SSH 密钥，将复制的公钥内容粘贴进去。

## 三、NVM (Node Version Manager) 安装与使用

NVM 用于管理多个 Node.js 版本。

### A. 安装 NVM (通过 Homebrew)

1. **安装 NVM 并创建工作目录:**

   ```bash
   brew install nvm
   mkdir ~/.nvm
   ```

2. **配置 Shell 环境 (以 Zsh 为例，macOS Catalina 及更高版本默认):** 打开或创建 `~/.zshrc` 文件 (例如 `nano ~/.zshrc`)，在文件末尾添加：

   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"  # This loads nvm
   [ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
   ```

   保存并退出。 _(如果使用 Bash，请编辑 `~/.bash_profile` 或 `~/.bashrc`)_

3. **应用更改并验证 NVM 安装:**

   ```bash
   # 应用更改 (使配置生效)
   source ~/.zshrc  # 或者 source ~/.bash_profile

   # 验证 NVM 安装
   command -v nvm   # 应输出 nvm
   nvm --version    # 应输出 NVM 版本号
   ```

### B. 使用 NVM 管理 Node.js

1. **安装 Node.js 版本:**

   ```bash
   # 安装最新的 LTS (长期支持) 版本 (推荐)
   nvm install --lts

   # 安装特定版本
   # nvm install 18.17.0

   # 安装最新的 Node.js 版本
   # nvm install node
   ```

2. **查看与切换 Node.js 版本:**

   ```bash
   # 查看已安装的 Node.js 版本 (当前使用版本前有 -> 标记)
   nvm ls

   # 查看可供远程安装的 Node.js 版本
   nvm ls-remote

   # 切换使用的 Node.js 版本
   # nvm use 18.17.0
   nvm use --lts # 切换到最新的已安装LTS版本
   ```

3. **设置默认的 Node.js 版本:** (设置后，每次新开终端会自动使用此版本)

   Bash

   ```bash
   # nvm alias default 18.17.0
   nvm alias default --lts # 将最新的已安装LTS版本设为默认
   ```

4. **验证当前 Node.js 和 npm 版本:**

   ```bash
   node -v
   npm -v
   ```
