# 实训平台 + Dify 全流程部署详细笔记

> 本文档详细记录了从本地环境准备到服务器部署、环境配置、端口开放、服务启动、模型接入等完整流程，适用于 ShiXunPlatForm-Web（前端）、ShiXunPlatform（后端）、ShiXunDify（Dify 智能体平台）等项目的搭建。请根据实际域名、密钥等进行相应替换。

---

## 1. 连接到服务器

### 本机生成 SSH 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- `-t` 指定密钥类型（一般为 rsa 或 ed25519）。
- `-b` 指定密钥长度（RSA 推荐 4096 位）。
- `-C` 注释，建议填写邮箱。

执行该命令后，程序会提示：
- **Enter file in which to save the key**：直接回车使用默认路径（如`~/.ssh/id_rsa`），也可自定义路径。
- **Enter passphrase**：建议设置密码短语，增强私钥安全性。

命令执行完后，会在指定路径生成：
- 私钥：如 `id_rsa`
- 公钥：如 `id_rsa.pub`

### 将公钥发送给服务器管理员

管理员将你的公钥内容加到服务器的 `~/.ssh/authorized_keys` 文件中。

### 测试连接

```bash
ssh ubuntu@<your-server-ip>
```
如有多个 SSH 密钥，指定私钥连接：
```bash
ssh -i ~/.ssh/<your-key-name> ubuntu@<your-server-ip>
```

---

## 2. 代码拉取

### Dify 代码拉取（服务器端）

1. **生成服务器 SSH 密钥**（如未配置过）:
    ```bash
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```
2. **把公钥加到 GitHub 账户/仓库 Deploy Keys**:
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
3. **测试 GitHub 连接:**
    ```bash
    ssh -T git@github.com
    ```
4. **克隆 Dify 仓库代码（dev 分支）:**
    ```bash
    git clone -b dev git@github.com:XZXY-AI/ShiXunDify.git
    ```

### 实训平台代码拉取

- 前端：
    ```bash
    git clone -b dev git@github.com:XZXY-AI/ShiXunPlatForm-Web.git
    ```
- 后端：
    ```bash
    git clone -b dev git@github.com:XZXY-AI/ShiXunPlatform.git
    ```

> 如遇到用户名密码问题，请确保 SSH Key 配置无误。

---

## 3. 部署准备工作

### 3.1 前端环境准备

#### nvm 管理 Node

- 安装 nvm：
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
- 重新加载配置文件：
    - bash: `source ~/.bashrc`
    - zsh: `source ~/.zshrc`
- 验证 nvm：
    ```bash
    nvm --version
    ```
- 安装 Node（LTS）：
    ```bash
    nvm install --lts
    ```
- 验证 Node：
    ```bash
    node -v
    ```

#### 安装 yarn、pnpm、pm2

```bash
npm install --global yarn
npm install -g pnpm
npm install -g pm2
```
- 验证 pm2：
    ```bash
    pm2 --version
    ```

#### 安装依赖

切到前端目录：
```bash
cd ShiXunPlatForm-Web
yarn install --production
```

---

### 3.2 Certbot、Docker、Nginx 安装

- **安装 snap 核心和 Certbot:**
    ```bash
    sudo snap install core
    sudo snap refresh core
    sudo snap install --classic certbot
    sudo ln -s /snap/bin/certbot /usr/bin/certbot
    ```
- **安装 Docker:**
    ```bash
    sudo snap install docker
    docker -v
    ```
- **安装 Nginx:**
    ```bash
    sudo apt install nginx
    nginx -v
    ```

---

### 3.3 配置环境变量

#### 前端环境变量

进入 `ShiXunPlatForm-Web` 目录，编辑 `.env.production`：
```bash
nano .env.production
```
内容示例（请替换为实际域名）：
```
NEXT_PUBLIC_API_BASE_URL=https://test1.xinzhiaigc.com
NEXT_PUBLIC_API_APP_URL=https://test2.xinzhiaigc.com
```
保存退出后可 `cat .env.production` 验证。

---

#### 后端环境变量

- Python 版本需 3.10.12
    ```bash
    sudo apt install python3
    python3 --version
    ```
- 安装 certbot 及 nginx 插件
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```

编辑 ShiXunPlatform 的 `.env` 文件（请根据实际替换密钥、域名等）：
```bash
cd ShiXunPlatform
nano .env
```
内容参考你需求文档中的示例。

---

#### Dify 环境变量

在 `ShiXunDify/docker` 下新建 `.env` 文件，内容参照你的详细模板，并根据实际情况替换域名、密钥等。

---

## 4. 系统级 Nginx 及 HTTPS 配置

### 获取 SSL 证书

```bash
sudo certbot --nginx -d test1.xinzhiaigc.com -d test2.xinzhiaigc.com
```

### 重新加载 Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 配置自动续期

```bash
sudo certbot renew --dry-run
```

### Nginx 配置软连接

```bash
sudo ln -s /etc/nginx/sites-available/shixunPlatform-web /etc/nginx/sites-enabled/
```

### Nginx 配置示例

编辑 `/etc/nginx/sites-available/shixunPlatform-web`（注意替换域名、路径等）：

```nginx
server {
    server_name test1.xinzhiaigc.com test2.xinzhiaigc.com;
    set $project_root /home/ubuntu/ShiXunPlatForm-Web;
    client_max_body_size 50M;

    location /api/ {
        if ($host = "test1.xinzhiaigc.com") {
            set $target_upstream_static http://127.0.0.1:8000;
        }
        if ($host = "test2.xinzhiaigc.com") {
            set $target_upstream_static http://127.0.0.1:3000;
        }
        if ($target_upstream_static = "") {
            return 404;
        }
        proxy_pass $target_upstream_static;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = test2.xinzhiaigc.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = test1.xinzhiaigc.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name test1.xinzhiaigc.com test2.xinzhiaigc.com;
    return 404;
}
```

---

## 5. 端口开放

确保 3443、3000、3001 端口未被占用：

```bash
sudo ss -tulnp | grep ':3443'
sudo ss -tulnp | grep ':3000'
sudo ss -tulnp | grep ':3001'
```

---

## 6. 启动服务

### 启动 Dify

进入 `ShiXunDify/docker` 目录：

```bash
sudo docker-compose up -d --build
```

验证 3000 端口是否监听：

```bash
sudo ss -tulnp | grep ':3000'
```

### 启动实训平台前端

进入 `ShiXunPlatForm-Web` 根目录：

```bash
yarn build
PORT=3001 pm2 start npm --name "shixun-test" -- run start
```
查看 pm2 状态：

```bash
pm2 list
```

### 启动实训平台后端

进入 ShiXunPlatform 目录：

```bash
sudo docker-compose up --build -d
```

---

## 7. Dify 配置要点

- `.env` 文件中的域名、端口、API、密钥需全部根据实际修改，如：
    ```
    APP_WEB_URL=https://test2.xinzhiaigc.com
    NGINX_SERVER_NAME="test1.xinzhiaigc.com test2.xinzhiaigc.com"
    MAIN_SYSTEM_HOST=https://test1.xinzhiaigc.com
    MAIN_SYSTEM_ONLY_HOST=test1.xinzhiaigc.com
    APP_SYSTEM_ONLY_HOST=test2.xinzhiaigc.com
    ```

---

## 8. 常见问题与排查

- **端口冲突**：如端口被占用，需先释放后再启动服务。
- **环境变量漏填**：务必每个 `.env` 配置项都参考模版仔细填写。
- **域名解析未生效**：必须先完成 DNS 解析再申请证书和配置 nginx。
- **服务未启动或报错**：查看 `docker-compose logs`、`pm2 logs`、`nginx`/`certbot` 日志排查。

---

## 9. 附录

### 快速命令参考

- **查看端口占用**：
    ```bash
    sudo ss -tulnp | grep ':端口号'
    ```
- **重启 nginx**：
    ```bash
    sudo systemctl reload nginx
    ```
- **查看 pm2 列表**：
    ```bash
    pm2 list
    ```
- **docker-compose 启动**：
    ```bash
    sudo docker-compose up -d --build
    ```

---
