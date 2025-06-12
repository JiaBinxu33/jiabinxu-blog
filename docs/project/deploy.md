# 前端应用（Next.js）测试环境部署详解：软件包与命令解析

## 引言

将一个现代前端应用（如 Next.js 项目）部署到测试服务器涉及多个步骤，从准备服务器环境、同步代码、安装依赖、构建应用，到配置 Web 服务器和进程管理器。本笔记旨在详细解释在此过程中我们用到的主要软件包和关键命令，帮助理解它们各自的角色和功能。

---

## 一、系统环境准备与基础工具

在开始部署之前，我们需要确保服务器具备一些基础工具。

### 1. `curl`

- **软件包用途**: `curl` 是一个强大的命令行工具，用于通过 URL 进行数据传输。在我们的案例中，它主要用来从互联网下载安装脚本（例如 NodeSource 的 Node.js 安装脚本或 NVM 的安装脚本）。
- **相关命令**:
  - `sudo apt install curl -y`: 在 Ubuntu 系统上安装 `curl`。
    - `sudo`: 以超级用户（管理员）权限执行命令。
    - `apt install`: Debian/Ubuntu 系统中用于安装软件包的命令。
    - `curl`: 要安装的软件包名称。
    - `-y`: 自动对安装过程中的提示回答“是”(yes)，避免交互。

### 2. `git`

- **软件包用途**: `git` 是目前最流行的分布式版本控制系统。我们用它从远程代码仓库（如 GitHub）克隆项目代码到服务器，并通过它拉取后续的代码更新。
- **相关命令**:
  - `sudo apt install git -y`: 在 Ubuntu 系统上安装 `git`。
  - （关于 `git` 的更多命令，将在“项目代码管理与同步”部分详细介绍。）

### 3. 内核更新通知

- **现象**: 在执行 `apt install` 或 `apt update/upgrade` 后，有时会看到 "Newer kernel available" (有新的 Linux 内核版本可用) 的提示。
- **说明**: 这不是错误。Linux 系统（包括 Ubuntu）会定期更新内核以增强安全性、稳定性和功能。当系统下载并安装了新的内核包后，如果当前运行的仍是旧内核，就会出现此提示，建议用户在方便时重启服务器以激活新内核。这通常不直接影响当前正在安装的软件（如 Nginx）的功能。

---

## 二、Node.js 环境管理

Node.js 是运行 Next.js 应用的基础，因为它是一个 JavaScript 运行时环境。

### 1. 通过 NodeSource PPA 安装 Node.js (推荐方法之一)

NodeSource 提供了包含较新 Node.js 版本的官方 Debian 和 Ubuntu 仓库。

- **软件包**: `nodejs` (通过 NodeSource 安装)
  - **用途**: 提供 Node.js 运行时环境，让服务器能够执行 JavaScript 代码（特别是 Next.js 应用的构建和服务端逻辑）。安装 `nodejs` 包通常也会附带安装 `npm` (Node Package Manager)。
- **相关命令**:
  - `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -`:
    - `curl -fsSL ...`: 下载 NodeSource 为 Node.js 20.x 版本准备的设置脚本。
      - `-f`: 在服务器错误时不显示 HTTP 错误内容。
      - `-s`: 静默模式，不显示进度条。
      - `-S`: 在静默模式下，如果出错仍显示错误。
      - `-L`: 跟随重定向。
    - `|`: 管道符，将 `curl` 下载的脚本内容传递给后续命令。
    - `sudo -E bash -`: 以超级用户权限执行下载下来的 bash 脚本。`-E` 保留用户环境变量。
  - `sudo apt-get install -y nodejs`: 从已配置好的 NodeSource 仓库中安装 Node.js。
    - `apt-get install`: `apt` 的一个较旧但仍常用的安装命令。
  - `node -v`: 查看已安装 Node.js 的版本。
  - `npm -v`: 查看已安装 npm 的版本。

### 2. 通过 NVM (Node Version Manager) 管理 Node.js (可选方法)

NVM 允许你在同一台机器上安装和管理多个不同版本的 Node.js。

- **软件包**: `nvm` (通过脚本安装)
  - **用途**: 灵活切换和管理服务器上的 Node.js 版本。
- **相关命令**:
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`: 下载并执行 NVM 的安装脚本（`v0.39.7` 是示例版本，建议使用官网最新命令）。
  - `source ~/.bashrc`: (或 `~/.zshrc` 等，取决于你的 shell) 重新加载 shell 配置文件，使 `nvm` 命令在当前会话可用。
  - `nvm --version`: 验证 NVM 是否安装成功。
  - `nvm install --lts` 或 `nvm install 20`: 安装 Node.js 的最新长期支持版本 (LTS) 或指定版本 (如 20)。
  - `nvm use 20`: 在当前 shell 会话中使用指定的 Node.js 版本。
  - `nvm alias default 20`: 设置默认使用的 Node.js 版本（新开会话时生效）。

---

## 三、项目依赖管理 (Yarn)

我们的项目使用 `yarn` 作为 JavaScript 包管理器。

- **软件包**: `yarn`
  - **用途**: 管理项目的依赖库（下载、安装、更新前端项目所需的各种 JavaScript 包）。
- **相关命令 (用于安装 Yarn 本身)**:
  - `sudo npm install --global yarn`: 使用 `npm` (Node.js 自带的包管理器) 全局安装 `yarn`。
    - `--global` (或 `-g`): 表示全局安装，使 `yarn` 命令在系统任何路径下都可用。
  - `corepack enable`: (如果使用较新版 Node.js 如 v16.10+) Corepack 是 Node.js 内置的包管理器版本管理工具，启用后可直接使用 `yarn`。
  - `yarn --version`: 验证 `yarn` 是否安装成功并查看版本。
- **相关命令 (用于项目依赖管理，在项目目录下执行)**:
  - `rm -rf node_modules`: 强制递归删除 `node_modules` 文件夹。通常用于在重新安装依赖前进行清理。
    - `rm`: remove 命令。
    - `-r`: recursive (递归删除，用于文件夹)。
    - `-f`: force (强制删除，不提示)。**此命令非常危险，使用前务必确认路径！**
  - `yarn install --production`:
    - `yarn install`: 安装项目 `package.json` 中定义的所有依赖。
    - `--production`: 只安装 `dependencies` 中的依赖，跳过 `devDependencies` (开发依赖)，这对于部署到测试/生产环境是推荐的，可以减小体积。
  - `yarn build`: 执行项目 `package.json` 中 `scripts` 下定义的 `build` 命令。对于 Next.js 项目，这通常是 `next build`，它会创建优化的生产版本构建成果，存放在 `.next` 文件夹中。

---

## 四、项目代码管理与同步 (Git)

我们使用 Git 将代码从远程仓库同步到服务器。

- **相关命令 (在服务器的项目目录或其父目录中执行)**:
  - `ssh-keygen -t ed25519 -C "your_email@example.com"`: 生成一对新的 SSH 密钥（推荐使用 Ed25519 算法）。
    - `-t ed25519`: 指定密钥类型。
    - `-C "your_email@example.com"`: 为密钥添加注释，通常是邮箱。
  - `cat ~/.ssh/id_ed25519.pub`: 显示 SSH 公钥的内容，你需要将其复制到 GitHub 等代码托管平台的 SSH Key 设置中。
  - `ssh -T git@github.com`: 测试与 GitHub 的 SSH 连接是否成功。
  - `git clone git@github.com:XZXY-AI/ShiXunPlatForm-Web.git .`: 从指定的 SSH URL 克隆远程仓库到当前目录 (`.`)。
  - `git status`: 查看当前工作目录和暂存区的状态。
  - `git branch`: 列出本地分支，并用 `*` 标记当前所在分支。
  - `git fetch origin`: 从名为 `origin` 的远程仓库获取所有分支的最新数据，但不会自动合并到你本地的分支。
  - `git checkout -b <新分支名> origin/<远程分支名>`: 基于远程分支的最新状态，创建一个新的本地分支，并切换到该新分支。例如 `git checkout -b testing origin/develop`。
  - `git reset --hard HEAD`: 将当前分支的工作目录和暂存区重置为最近一次提交 (`HEAD`) 的状态，丢弃所有对**已跟踪文件**的未提交修改。**此操作不可逆，慎用！**
  - `mv .env.production .env.production.backup`: 重命名/移动文件，用于备份。
  - `rm .env.production`: 删除文件。
  - `git pull` 或 `git pull origin <分支名>`: 获取远程跟踪分支的最新代码并尝试合并到当前本地分支。

---

## 五、应用部署与服务管理

### 1. Nginx (Web 服务器 / 反向代理)

- **软件包**: `nginx`
  - **用途**: 高性能 Web 服务器。在我们的场景中，主要用作**反向代理**：接收来自公网的 HTTP 请求（通常在 80 端口），然后将这些请求安全地转发到在内部端口（如 3001）运行的 Next.js 应用。它还可以处理 HTTPS、提供静态文件、进行负载均衡等。
- **相关命令**:
  - `sudo apt install nginx -y`: 在 Ubuntu 上安装 Nginx。
  - `nginx -v`: 查看 Nginx 版本。
  - `sudo systemctl status nginx`: 查看 Nginx 服务当前状态（是否运行、有无错误）。
  - `sudo systemctl start nginx`: 启动 Nginx 服务。
  - `sudo systemctl stop nginx`: 停止 Nginx 服务。
  - `sudo systemctl restart nginx`: 重启 Nginx 服务。
  - `sudo systemctl reload nginx`: 重新加载 Nginx 配置文件，而无需停止服务（平滑重载）。
  - `sudo nano /etc/nginx/sites-available/your-site-config`: 创建或编辑特定站点的 Nginx 配置文件。`nano` 是一个文本编辑器。
  - `sudo ln -s /etc/nginx/sites-available/your-site-config /etc/nginx/sites-enabled/`: 创建一个从 `sites-available`（存放所有可用站点配置）到 `sites-enabled`（存放实际启用的站点配置）的符号链接，以此来启用一个站点配置。
  - `sudo rm /etc/nginx/sites-enabled/default`: （可选）删除默认的 Nginx 站点配置的符号链接，以避免冲突。
  - `sudo nginx -t`: 测试 Nginx 配置文件的语法是否正确。在重载或重启 Nginx 前执行此命令非常重要。
- **Nginx 配置文件中的关键指令 (示例)**:
  - `listen 80;`: 让 Nginx 监听 80 端口（HTTP）。
  - `server_name your_server_ip_or_domain;`: 定义此配置块处理哪个域名或 IP 的请求。
  - `set $project_root /path/to/your/project;`: 定义一个变量来存储项目的绝对路径，方便后续引用。
  - `location / { proxy_pass http://localhost:3001; ... }`: 核心反向代理配置。将所有匹配 `/` (根路径) 的请求转发到本机 (`localhost`) 的 3001 端口（即 Next.js 应用运行的端口）。
    - `proxy_set_header Host $host;`: 将原始请求的 Host 头部传递给后端应用。
    - `proxy_set_header X-Real-IP $remote_addr;`: 传递真实客户端 IP 给后端。
    - `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`: 传递代理链中的所有 IP。
    - `proxy_set_header X-Forwarded-Proto $scheme;`: 传递原始请求协议 (http/https)。
  - `location /_next/static { alias $project_root/.next/static; ... }`: 配置 Nginx 直接高效地提供 Next.js 构建的静态资源。
    - `alias`: 定义此 location 对应的文件系统路径。
    - `expires 1y;`: 设置客户端缓存过期时间。

### 2. PM2 (进程管理器)

- **软件包**: `pm2`
  - **用途**: Node.js 应用的进程管理器。它可以让你的 Next.js 应用在后台运行，监控应用状态，在应用崩溃时自动重启，管理日志，并能配置开机自启动。
- **相关命令**:
  - `sudo npm install -g pm2` (或在 NVM 环境下 `npm install -g pm2`): 全局安装 PM2。
  - `pm2 --version`: 验证 PM2 安装。
  - `pm2 start yarn --name "app-name" -- run start_script`: 使用 PM2 启动一个通过 `yarn run start_script`（例如 `yarn run start`）执行的应用。
    - `--name "app-name"`: 为 PM2 中的进程指定一个易于管理的名字。
  - `pm2 list` 或 `pm2 status`: 显示由 PM2 管理的所有应用的列表及其状态。
  - `pm2 logs <app-name>`: 查看指定应用的实时日志输出 (包括 stdout 和 stderr)。
    - `--lines <number>`: 指定显示最近的行数。
  - `pm2 stop <app-name>`: 停止指定的应用。
  - `pm2 restart <app-name>`: 重启指定的应用。
  - `pm2 delete <app-name>`: 停止指定的应用并将其从 PM2 的管理列表中移除。
  - `pm2 save`: 保存当前正在运行的应用列表，以便在服务器重启后恢复。
  - `pm2 startup`: 生成并（根据提示）配置系统服务，使 PM2 及其管理的应用能在服务器开机时自动启动。通常会输出一个需要用 `sudo` 执行的命令。

---

## 六、网络与端口检查

在部署和排错过程中，检查网络连接和端口占用情况非常重要。

- **相关命令**:
  - `sudo ss -tulnp`: (推荐) 显示所有正在监听的 TCP (`-t`) 和 UDP (`-u`) 端口 (`-l`)，以数字形式显示端口和 IP (`-n`)，并显示相关的进程信息 (`-p`)。
  - `sudo ss -tulnp | grep ':3001'`: 过滤 `ss` 命令的输出，只显示与端口 `3001` 相关的信息。
  - `sudo netstat -tulnp`: (较旧的命令) 功能与 `ss -tulnp` 类似。
  - `sudo lsof -i :3001`: 列出所有使用 TCP 或 UDP 端口 `3001` 的进程。
  - `curl http://localhost:3001`: 在服务器本地测试是否能访问运行在 `localhost:3001` 的服务。`curl` 是一个命令行 HTTP 客户端。
- **UFW (Uncomplicated Firewall - Ubuntu 防火墙)**:
  - `sudo ufw status`: 查看防火墙状态和现有规则。
  - `sudo ufw allow 3001/tcp`: 允许外部通过 TCP 协议访问 3001 端口。
  - `sudo ufw allow 'Nginx HTTP'` 或 `sudo ufw allow 80/tcp`: 允许 HTTP (80 端口) 流量。
  - `sudo ufw allow 'Nginx Full'` : 允许 HTTP (80 端口) 和 HTTPS (443 端口) 流量。
  - `sudo ufw reload`: 重新加载防火墙规则。
  - `sudo ufw enable`: 启用防火墙。
- **云服务商安全组**: 如果你使用云服务器 (如 AWS EC2)，还需要在其管理控制台中配置安全组 (Security Groups) 或类似的网络防火墙规则，以允许外部访问你需要的端口（如 80, 443, 或测试用的 3001）。

---

## 前端应用（Next.js）部署后访问故障排除流程

当你完成了 Next.js 应用的构建和部署，但通过浏览器访问时遇到问题（例如无法连接、看到错误页面、或者访问到了错误的项目），可以按照以下流程进行系统性的排查。

---

### 零、准备工作与基本检查

在开始深入排查前，确保：

1.  你已经成功在服务器上通过 `yarn build` (或 `npm run build`) **成功构建了你的 Next.js 应用**，并且没有构建错误。
2.  你已经使用 PM2 (或类似的进程管理器) **启动了你的 Next.js 应用**，并且 `package.json` 中的 `start` 脚本指定了正确的端口 (例如 `next start -p 3001`)。
3.  你已经配置了 Nginx 作为反向代理（如果计划使用的话）。

---

### 第一步：检查 Next.js 应用（PM2 进程）是否在服务器内部正常运行？

目标是确认你的 Next.js 应用本身没有问题，并且在预期的内部端口上监听。

1. **检查 PM2 进程状态**:

   ```bash
   pm2 list
   # 或者
   pm2 status
   ```

   - **看什么？** 确保你的应用进程（例如 `shixun-test`）状态为 `online`。
   - **注意**：CPU/内存使用是否异常？`uptime` 是否很短（可能在频繁重启）？

2. **查看 PM2 应用日志 (非常重要！)**:

   ```bash
   pm2 logs <你的应用名，例如shixun-test> --lines 100
   ```

   - **看什么？** 仔细查找最新的日志中是否有运行时错误。常见的错误可能包括：
     - 环境变量读取失败或配置错误。
     - 服务器端代码执行错误。
     - 数据库或外部 API 连接问题。
     - （之前遇到的）`Could not find a production build` 这类错误如果再次出现，说明构建步骤仍有问题。
   - **提示**：如果日志中没有明显错误，并且显示类似 `✓ Ready on http://localhost:3001` 的信息，这是个好迹象。

3. **确认应用监听端口和地址**:

   ```bash
   sudo ss -tulnp | grep ':<你的Next应用端口，例如3001>'
   ```

   - **看什么？** 应该能看到一行，显示有一个 `node` (或与 PM2 相关的) 进程正在 `LISTEN` (监听) 你指定的端口。
   - **注意监听地址**：
     - `127.0.0.1:3001` 或 `localhost:3001`：表示只接受来自服务器本机的连接。这对于 Nginx 的 `proxy_pass http://localhost:3001;` 是正确的。
     - `0.0.0.0:3001` 或 `[::]:3001`：表示监听所有网络接口的该端口。
     - **如果没有输出**：说明应用没有成功监听该端口，返回第 2 步检查 PM2 日志。

4. **在服务器内部测试应用响应**:

   ```bash
   curl http://localhost:<你的Next应用端口，例如3001>
   ```

   - **看什么？**
     - **成功**：如果输出了你网站首页的 HTML 代码，说明应用在服务器内部是正常工作的。
     - **失败 (Connection refused / 连接被拒绝)**：通常意味着没有服务在该端口监听，返回第 2、3 步检查。
     - **失败 (其他错误，如超时、空回复)**：应用可能在监听，但无法正确处理请求，返回第 2 步检查 PM2 日志。

---

### 第二步：如果应用内部运行正常，但通过 `http://<服务器公网IP>:<应用端口>` 无法从外部访问？

这通常意味着网络层面的访问被阻止了。

1. **检查服务器本地防火墙 (例如 Ubuntu 上的 `ufw`)**:

   - 查看防火墙状态：

     ```bash
     sudo ufw status
     ```

   - 如果状态是 `active` (活动)，检查规则列表是否允许你的应用端口 (例如 3001) 的 TCP 流量：
     如果没有，添加规则：

     ```bash
     sudo ufw allow <应用端口>/tcp  # 例如: sudo ufw allow 3001/tcp
     sudo ufw reload              # 重载规则使其生效
     ```

2. **检查云服务提供商的防火墙/安全组规则**:

   - 如果你的服务器是云主机（如 AWS EC2, 阿里云 ECS, 腾讯云 CVM 等），它们通常有独立于操作系统的网络防火墙（例如 AWS 的“安全组”，阿里云的“安全组规则”）。
   - **操作**：登录到你的云服务商管理控制台，找到你的服务器实例，编辑其关联的安全组（或类似名称的防火墙配置）。
   - **确保入站规则 (Inbound rules)** 中允许 TCP 流量访问你的应用端口（例如 3001）。
   - **源 IP (Source IP)**：为了测试，可以暂时设置为 `0.0.0.0/0` (允许任何 IP)。**测试完成后，出于安全考虑，强烈建议将其限制为你的实际访问 IP 或必要的 IP 范围。**

**如果完成以上防火墙配置后，可以通过 `http://<服务器公网IP>:<应用端口>` 访问到你的应用，那么问题就出在防火墙层面。**

---

### 第三步：如果通过 Nginx 的 URL (`http://<服务器公网IP>` 或域名) 访问不到你的项目，或访问到其他项目？

这表示你的 Next.js 应用本身可能在内部端口运行正常，但 Nginx 没有正确地将外部请求（通常是 80 端口）代理到它。

1. **确认 Nginx 服务状态**:

   ```bash
   sudo systemctl status nginx
   ```

   - **看什么？** 确保 Nginx 服务是 `active (running)` 状态。如果不是，尝试启动 (`sudo systemctl start nginx`) 并查看错误。

2. **检查 Nginx 配置语法**:

   ```bash
   sudo nginx -t
   ```

   - **看什么？** 确保输出 `syntax is ok` 和 `test is successful`。如果有错误，会提示错误的文件和行号，你需要根据提示修复。

3. **确认 Nginx 已重载最新配置**:
   每次修改 Nginx 配置文件后，都需要重载才能生效：

   ```bash
   sudo systemctl reload nginx
   ```

4. **检查 Nginx 是否在监听公共端口 (通常是 80 或 443)**:

   ```bash
   sudo ss -tulnp | grep ':80'
   sudo ss -tulnp | grep ':443' # 如果你配置了 HTTPS
   ```

   - **看什么？** 应该看到有 `nginx` 进程在监听这些端口。如果你发现这些端口被 `docker-proxy` 或其他非 Nginx 进程占用，这就是一个直接的冲突。

5. **仔细审查你的 Nginx 站点配置文件**:
   打开为你 Next.js 应用创建的 Nginx 配置文件 (例如 `/etc/nginx/sites-available/shixun-frontend-test`)，检查以下关键点：

   - **`listen 80;` (或 `listen 443 ssl;`)**：是否正确？
   - **`server_name your_server_ip_or_domain;`**:
     - 如果用 IP，是否是正确的公网 IP？
     - 如果用域名，域名是否正确，并且其 DNS A 记录已指向此服务器 IP？
     - 这个 `server_name` 是否可能与服务器上其他 Nginx 站点配置中的 `server_name` 冲突？
   - **`set $project_root /absolute/path/to/your/project;`**: 变量定义的项目根路径是否是**绝对路径**且正确无误？
   - **`proxy_pass http://localhost:<你的Next应用端口，如3001>;`**:
     - URL (`http://localhost`) 和端口号是否与你 Next.js 应用实际监听的地址和端口完全一致？
   - **`location /_next/static { alias $project_root/.next/static; }`**: `alias` 指令后的路径，结合 `$project_root`，是否能准确指向你项目构建后的 `.next/static` 目录？

6. **检查 Nginx 的 `sites-enabled` 目录**:

   ```bash
   ls -l /etc/nginx/sites-enabled/
   ```

   - **看什么？**

     - 你的站点的配置文件（例如 `shixun-frontend-test`）是否正确地通过符号链接指向了 `sites-available` 中的对应文件？

     - 是否存在一个名为 `default` 的符号链接，或者其他配置文件？**如果存在 `default` 配置，或者其他配置文件的 `server_name` 设置得非常通用 (例如 `_` 或者也监听了你的 IP 地址且没有明确的 `server_name` 区分)，它可能会优先处理你的请求，导致你的特定站点配置不生效。**

     - **尝试的解决办法**：如果怀疑是 `default` 配置或其他通用配置导致的问题，并且你确定不需要它来处理对该 IP 的请求，可以**谨慎地**尝试临时移除该符号链接，然后重载 Nginx 测试：

       ```bash
       sudo rm /etc/nginx/sites-enabled/default  # 操作前请确认你了解其作用
       sudo systemctl reload nginx
       ```

7. **查看 Nginx 日志 (非常重要！)**:

   - **主错误日志**: `sudo tail -f /var/log/nginx/error.log`
   - **主访问日志**: `sudo tail -f /var/log/nginx/access.log`
   - **特定站点日志** (如果你在站点配置文件中定义了独立的 `access_log` 和 `error_log` 路径):
   - **看什么？** 访问日志可以帮助你了解请求是否到达了 Nginx，以及 Nginx 可能将请求路由到了哪个后端（或返回了什么状态码）。错误日志会记录配置错误、连接后端失败等问题。

---

### 第四步：如果通过 Nginx 访问到应用，但页面报错或功能不正常？

这说明请求已经成功从 Nginx 代理到了你的 Next.js 应用，但应用本身在处理请求或渲染页面时出错了。

1.  **浏览器开发者工具**:

    - 打开浏览器（访问你的网站时），按 F12 打开开发者工具。
    - **“控制台 (Console)”**：查看是否有 JavaScript 运行错误。
    - **“网络 (Network)”**：查看是否有某些资源（图片、CSS、JS 文件、API 请求）加载失败（状态码为 404 Not Found, 5xx Server Error 等）。

2.  **PM2 应用日志**:
    再次查看 `pm2 logs <你的应用名>`。当你在浏览器中操作并遇到问题时，应用日志中可能会有对应的错误信息。

3.  **Nginx 访问/错误日志**:
    有时 Nginx 日志也可能提供关于后端应用响应异常的线索。

---

### 第五步：(如果使用域名访问) DNS 问题排查

如果以上都正常，但你通过域名访问有问题，而通过 IP 访问 Nginx 正常：

1.  **检查 DNS 解析**:
    - 在你的本地电脑上使用 `ping your-test-domain.com` 和 `nslookup your-test-domain.com` (或 `dig your-test-domain.com`) 命令，确认域名是否正确解析到了你服务器的公网 IP 地址。
2.  **DNS 传播**:
    如果你最近才修改了 DNS A 记录，可能需要一些时间（从几分钟到几小时不等）让 DNS 记录在全球范围内传播生效。

---

**通用排错建议:**

- **逐步排查，缩小范围**：从应用本身是否运行 -> 服务器内部是否可访问 -> 防火墙是否允许外部访问内部端口 -> Nginx 是否正确接收和转发请求 -> DNS 是否正确。
- **仔细阅读错误信息**：无论是终端输出、应用日志、Nginx 日志还是浏览器控制台，错误信息通常是定位问题的最直接线索。
- **保持配置一致性**：确保 Nginx 配置中的端口号、项目路径等与你的实际应用设置完全一致。
- **小步快跑，及时验证**：每做一个重要更改（如修改 Nginx 配置、修改防火墙规则），都立即测试，看问题是否解决或现象是否有变化。

### 仓库开发分支调整代码后，同步到测试服务器

- 仓库的开发分支发生了变动，提交代码到了远程的仓库。
- 连接到测试服务器
  **配置了本地 ssh 的 config 后的连接命令，不需要每次输服务器地址**
  详情查看 [连接到测试服务器配置指定私钥](#连接到测试服务器配置指定私钥)

```bash
    ssh test-server
```

- 在服务器上拉取 dev 分支代码解决冲突
- 如果有依赖更新重新 yarn install --production
- 重新构建应用 yarn build
- 重启进程 pm2 restart shixun-test

## 连接到测试服务器配置指定私钥

本机可能存在多个 sshkey，需要指定私钥，可以通过 ssh 的 config 来管理连接到那个服务需要使用那个私钥

### 查看本机公钥私钥

```Bash
ls -l ~/.ssh
```

### 可以为本机的 sshkey 重新命名，这样更容易管理

```Bash
# 1. 重命名用于 Git 仓库的 ed25519 私钥
mv ~/.ssh/id_ed25519 ~/.ssh/id_ed25519_github
# 2. 重命名用于 Git 仓库的 ed25519 公钥
mv ~/.ssh/id_ed25519.pub ~/.ssh/id_ed25519_github.pub
# 3. 重命名用于测试服务器的 rsa 私钥
mv ~/.ssh/id_rsa ~/.ssh/id_rsa_test_server
# 4. 重命名用于测试服务器的 rsa 公钥
mv ~/.ssh/id_rsa.pub ~/.ssh/id_rsa_test_server.pub
```

### 编辑 ssh 的 config 文件

```Bash
nano ~/.ssh/config
```

### 具体配置

```Bash
# ==================================
# GitHub (或其他Git仓库) 的配置
# ==================================
# 当访问 github.com 时，自动使用此配置
Host github.com
  HostName github.com
  User git
  # 指定使用重命名后的 GitHub 私钥
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes

# ==================================
# 测试服务器的配置
# ==================================
# "test-server" 是连接别名，以后连接就用它
Host test-server
  HostName 52.76.64.123

  User ubuntu

  # 指定使用重命名后的测试服务器私钥
  IdentityFile ~/.ssh/id_rsa_test_server
  IdentitiesOnly yes
```

### 再次连接时可以直接使用连接别名进行连接

```Bash
ssh test-server
```
