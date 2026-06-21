# 从零开始:使用 Docker 部署 React 前端项目完整实战

> 本文记录了我将车辆管理系统前端项目(基于 React + Vite)部署到 Docker 的完整过程,包括 Docker 基础概念、实战步骤、踩坑记录和问题解决方案。

---

## 📚 第一部分:Docker 基础概念

### 1.1 什么是 Docker?

Docker 是一个开源的**容器化平台**,可以将应用程序及其所有依赖打包到一个标准化的容器中,确保应用在任何环境下都能以相同的方式运行。

**简单理解:**
- 传统方式:在服务器上安装 Node.js、Nginx、配置环境变量等,换台服务器又要重新配置一遍
- Docker 方式:将应用和环境打包成一个"集装箱",在任何安装了 Docker 的机器上都能直接运行

### 1.2 Docker 核心概念

#### 1.2.1 镜像(Image)

**定义:** 镜像是一个只读的模板,包含了运行应用所需的所有内容(代码、运行时、库、环境变量、配置文件等)。

**类比理解:** 镜像就像是一个"软件安装包"或"光盘镜像",它是静态的、不会改变的。

**例子:**
```bash
# 查看本地所有镜像
docker images

# 输出示例:
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
react-manager   latest    abc123def456   5 minutes ago   50MB
nginx           alpine    xyz789uvw123   2 weeks ago     23MB
node            20-alpine def456abc789   1 month ago     115MB
```

**镜像的命名规则:**
- `react-manager:latest` = `仓库名:标签`
- `latest` 是默认标签,通常表示最新版本
- 也可以用版本号,如 `react-manager:1.0.0`

#### 1.2.2 容器(Container)

**定义:** 容器是镜像的运行实例,是一个独立运行的应用环境。

**类比理解:**
- 镜像 = 程序安装包(.exe 文件)
- 容器 = 运行中的程序进程

**特点:**
- 一个镜像可以创建多个容器
- 容器是隔离的,互不影响
- 容器可以启动、停止、删除、暂停

**例子:**
```bash
# 查看正在运行的容器
docker ps

# 输出示例:
CONTAINER ID   IMAGE                  COMMAND                  PORTS                  NAMES
a1b2c3d4e5f6   react-manager:latest   "nginx -g 'daemon of…"   0.0.0.0:8080->80/tcp   react-manager-app
```

**容器的生命周期:**
```
创建 → 运行 → 停止 → 删除
  ↓      ↓      ↓      ↓
Created → Running → Stopped → Removed
```

#### 1.2.3 Dockerfile

**定义:** Dockerfile 是一个文本文件,包含了一系列构建镜像的指令。

**类比理解:** Dockerfile 就像是一份"菜谱",告诉 Docker 如何一步步制作镜像。

**常用指令:**

| 指令 | 作用 | 示例 |
|------|------|------|
| `FROM` | 指定基础镜像 | `FROM node:20-alpine` |
| `WORKDIR` | 设置工作目录 | `WORKDIR /app` |
| `COPY` | 复制文件到镜像 | `COPY package.json ./` |
| `RUN` | 执行命令(构建时) | `RUN npm install` |
| `CMD` | 容器启动时执行的命令 | `CMD ["nginx", "-g", "daemon off;"]` |
| `EXPOSE` | 声明容器监听的端口 | `EXPOSE 80` |

#### 1.2.4 多阶段构建(Multi-stage Build)

**定义:** 在一个 Dockerfile 中使用多个 `FROM` 指令,每个 `FROM` 开始一个新的构建阶段。

**作用:** 减小最终镜像大小,只保留运行时需要的文件。

**示例:**
```dockerfile
# 第一阶段:构建阶段(包含 Node.js、npm、源代码)
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 第二阶段:运行阶段(只包含 Nginx 和构建产物)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

**好处:**
- 构建阶段的镜像可能有 500MB(包含 Node.js、node_modules)
- 最终镜像只有 50MB(只包含 Nginx 和静态文件)

#### 1.2.5 端口映射

**定义:** 将容器内部端口映射到宿主机端口,使外部可以访问容器内的服务。

**语法:** `-p 宿主机端口:容器端口`

**示例:**
```bash
docker run -p 8080:80 react-manager:latest
```

**理解:**
- 容器内 Nginx 监听 `80` 端口
- 通过 `-p 8080:80` 映射到宿主机的 `8080` 端口
- 访问 `http://localhost:8080` → 实际访问容器内的 `80` 端口

**可视化:**
```
宿主机(你的电脑)               Docker 容器
┌──────────────┐              ┌──────────────┐
│              │              │              │
│ localhost    │   映射关系    │   Nginx      │
│ 8080 端口 ─────┼──────────→  │   80 端口    │
│              │              │              │
└──────────────┘              └──────────────┘
```

#### 1.2.6 数据卷(Volume)和挂载

**定义:** 将宿主机的文件或目录挂载到容器内,实现数据持久化。

**语法:** `-v 宿主机路径:容器路径`

**示例:**
```bash
# 挂载配置文件
docker run -v /my/nginx.conf:/etc/nginx/nginx.conf nginx:alpine

# 挂载数据目录
docker run -v /my/data:/app/data myapp:latest
```

### 1.3 Docker vs 虚拟机

| 特性 | Docker 容器 | 虚拟机 |
|------|------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 轻量(MB 级) | 重量(GB 级) |
| 性能 | 接近原生 | 有性能损耗 |
| 隔离性 | 进程级隔离 | 操作系统级隔离 |
| 可移植性 | 跨平台 | 受限于虚拟化技术 |

**可视化对比:**

```
虚拟机架构:
┌─────────────────────────────────────┐
│ 应用A  │ 应用B  │ 应用C              │
├────────┼────────┼────────────────────┤
│ OS     │ OS     │ OS                 │  ← 每个虚拟机都有完整的操作系统
├────────┴────────┴────────────────────┤
│ 虚拟机管理器(Hypervisor)              │
├─────────────────────────────────────┤
│ 宿主机操作系统                        │
└─────────────────────────────────────┘

Docker 容器架构:
┌─────────────────────────────────────┐
│ 应用A  │ 应用B  │ 应用C              │
├────────┴────────┴────────────────────┤
│ Docker Engine                        │  ← 共享宿主机的操作系统内核
├─────────────────────────────────────┤
│ 宿主机操作系统                        │
└─────────────────────────────────────┘
```

---

## 🎯 第二部分:项目部署实战

### 2.1 项目背景

**项目:** 车辆管理系统前端
**技术栈:** React 18 + Vite 7 + TypeScript + Antd
**目标:** 使用 Docker 容器化部署前端应用,并配置 Nginx 反向代理连接本地后端

### 2.2 部署架构设计

```
┌─────────────────────────────────────────────────────┐
│ 浏览器                                                │
│ http://localhost:8080                               │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│ Docker 容器                                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Nginx (80端口)                                   │ │
│ │ ┌─────────────┐  ┌──────────────────────────┐  │ │
│ │ │ 静态文件     │  │ 反向代理                  │  │ │
│ │ │ /index.html │  │ /api/* → 宿主机:3000      │  │ │
│ │ │ /assets/*   │  │                          │  │ │
│ │ └─────────────┘  └──────────────────────────┘  │ │
│ └─────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │ (通过 host.docker.internal)
                        ▼
┌─────────────────────────────────────────────────────┐
│ 宿主机(Mac)                                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 后端服务(Node.js)                                │ │
│ │ localhost:3000                                   │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 2.3 准备工作

#### 2.3.1 安装 Docker

1. 下载 Docker Desktop for Mac
2. 安装并启动
3. 验证安装:

```bash
docker --version
# 输出: Docker version 24.x.x, build xxxxx
```

#### 2.3.2 配置 Docker 镜像源(重要!)

由于网络原因,拉取 Docker 官方镜像可能会超时,需要配置国内镜像源。

**操作步骤:**
1. 打开 Docker Desktop
2. 点击右上角 Settings(设置) → Docker Engine
3. 修改配置:

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://dockerpull.com"
  ]
}
```

4. 点击 **Apply & Restart**

### 2.4 编写 Dockerfile

创建 `Dockerfile` 文件:

```dockerfile
# ============================================
# 第一阶段: 构建前端项目
# ============================================
FROM node:20-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
# 单独复制依赖文件可以利用 Docker 缓存层,提高构建速度
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有项目文件
COPY . .

# 构建生产版本
RUN npm run build

# ============================================
# 第二阶段: 使用 Nginx 部署
# ============================================
FROM nginx:alpine

# 从构建阶段复制打包后的文件到 Nginx 静态目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 声明容器监听 80 端口
EXPOSE 80

# 启动 Nginx(前台运行)
CMD ["nginx", "-g", "daemon off;"]
```

**关键点说明:**

1. **使用 Node.js 20 而非 18**
   - 原因: Vite 7 依赖 Node.js 的 `crypto.hash` API,需要 Node.js 18.20+ 或 20+
   - 我最初使用 `node:18-alpine` 遇到了构建错误,升级到 `node:20-alpine` 解决

2. **使用 alpine 版本**
   - `alpine` 是一个轻量级 Linux 发行版
   - `node:20-alpine` 只有 115MB,而 `node:20` 有 900MB+
   - `nginx:alpine` 只有 23MB,而 `nginx:latest` 有 140MB+

3. **多阶段构建的好处**
   - 构建阶段需要 Node.js、npm、源代码、node_modules(可能 500MB+)
   - 运行阶段只需要 Nginx 和构建产物 dist(可能 10MB)
   - 最终镜像大小约 50MB,大幅减小

4. **COPY 顺序优化**
   - 先 COPY `package*.json`,再 RUN `npm install`
   - 如果只修改了代码,没有修改依赖,Docker 会使用缓存的 npm install 层
   - 大幅提升重复构建速度

### 2.5 编写 Nginx 配置

创建 `nginx.conf` 文件:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # ========================================
    # SPA 路由配置(重要!)
    # ========================================
    # React Router 使用 BrowserRouter 时,
    # 刷新页面会向服务器请求 /users/list 等路径,
    # 但服务器上没有这些文件,会返回 404。
    # try_files 指令会先尝试查找文件,找不到就返回 index.html,
    # 让前端路由接管
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ========================================
    # 静态资源缓存配置(可选,优化性能)
    # ========================================
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # ========================================
    # API 反向代理配置(重要!)
    # ========================================
    # 前端请求 /api/users/login
    # → Nginx 转发到 http://host.docker.internal:3000/users/login
    #
    # 关键点:
    # 1. location /api/ (结尾有斜杠)
    # 2. proxy_pass http://host.docker.internal:3000/ (结尾有斜杠)
    # 这样会自动去掉 /api 前缀
    location /api/ {
        proxy_pass http://host.docker.internal:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**核心知识点:**

#### 2.5.1 host.docker.internal 的作用

在 Docker 容器内部,`localhost` 指向容器本身,而不是宿主机。

**问题场景:**
- 后端服务运行在宿主机的 `localhost:3000`
- 容器内的 Nginx 无法通过 `http://localhost:3000` 访问

**解决方案:**
- Docker Desktop 提供了特殊域名 `host.docker.internal`
- 在容器内指向宿主机的 IP 地址
- 使用 `http://host.docker.internal:3000` 即可访问宿主机的 3000 端口

#### 2.5.2 Nginx 路径重写规则

**配置 1(错误):**
```nginx
location /api {
    proxy_pass http://host.docker.internal:3000;
}
```
- 请求 `/api/users/login`
- 转发到 `http://host.docker.internal:3000/api/users/login`
- 后端收到 `/api/users/login`(保留了 /api 前缀)

**配置 2(正确):**
```nginx
location /api/ {
    proxy_pass http://host.docker.internal:3000/;
}
```
- 请求 `/api/users/login`
- 转发到 `http://host.docker.internal:3000/users/login`
- 后端收到 `/users/login`(去掉了 /api 前缀)

**规则总结:**
- `location` 和 `proxy_pass` 都以 `/` 结尾 → 自动去掉匹配的前缀
- `location` 或 `proxy_pass` 任一不以 `/` 结尾 → 保留完整路径

### 2.6 构建镜像

在项目根目录执行:

```bash
docker build -t react-manager:latest .
```

**命令解析:**
- `docker build`: 构建镜像命令
- `-t react-manager:latest`: 指定镜像名称和标签
- `.`: 构建上下文路径(当前目录)

**构建过程输出:**
```
[+] Building 125.3s (14/14) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/nginx:alpine
 => [internal] load metadata for docker.io/library/node:20-alpine
 => [build 1/6] FROM docker.io/library/node:20-alpine
 => [build 2/6] WORKDIR /app
 => [build 3/6] COPY package*.json ./
 => [build 4/6] RUN npm install          (耗时最长,约 60s)
 => [build 5/6] COPY . .
 => [build 6/6] RUN npm run build        (约 20s)
 => [stage-1 1/3] FROM docker.io/library/nginx:alpine
 => [stage-1 2/3] COPY --from=build /app/dist /usr/share/nginx/html
 => [stage-1 3/3] COPY nginx.conf /etc/nginx/conf.d/default.conf
 => exporting to image
 => => naming to docker.io/library/react-manager:latest
```

**验证镜像构建成功:**
```bash
docker images | grep react-manager
```

输出:
```
react-manager   latest    abc123def456   2 minutes ago   50MB
```

### 2.7 运行容器

```bash
docker run -d -p 8080:80 --name react-manager-app react-manager:latest
```

**命令解析:**
- `docker run`: 运行容器命令
- `-d`: 后台运行(detached 模式)
- `-p 8080:80`: 端口映射,宿主机 8080 → 容器 80
- `--name react-manager-app`: 给容器命名
- `react-manager:latest`: 使用的镜像

**验证容器运行:**
```bash
docker ps
```

输出:
```
CONTAINER ID   IMAGE                    PORTS                  NAMES
a1b2c3d4e5f6   react-manager:latest     0.0.0.0:8080->80/tcp   react-manager-app
```

### 2.8 访问应用

打开浏览器,访问:
```
http://localhost:8080
```

成功看到车辆管理系统界面! 🎉

---

## 🐛 第三部分:问题排查与解决

### 问题 1: 镜像拉取超时

**错误信息:**
```
ERROR: failed to solve: nginx:alpine: failed to resolve source metadata:
unexpected status from HEAD request: 403 Forbidden
```

**原因:** Docker 官方镜像源在国内访问受限。

**解决方案:**
配置国内镜像源(见 2.3.2 章节)。

---

### 问题 2: npm run build 报错 - crypto.hash is not a function

**错误信息:**
```
error during build:
[vite:build-html] crypto.hash is not a function
```

**原因:**
Vite 7 需要 Node.js 18.20+ 或 20+,而 `node:18-alpine` 是 18.17 版本,不支持 `crypto.hash` API。

**解决方案:**
将 Dockerfile 中的基础镜像从 `node:18-alpine` 改为 `node:20-alpine`。

**知识点:**
- Node.js 18.0-18.19: 不支持 `crypto.hash`
- Node.js 18.20+: 支持 `crypto.hash`
- Node.js 20+: 完全支持

---

### 问题 3: 页面访问正常,但 API 请求 404

**错误信息:**
```
Request failed with status code 404
AxiosError: Request failed with status code 404
```

**调试过程:**

1. 打开浏览器开发者工具 Network 面板
2. 发现请求 `http://localhost:8080/api/users/login` 返回 404
3. 检查容器日志:
   ```bash
   docker logs react-manager-app
   ```
   输出:
   ```
   2024/01/12 10:30:45 [error] 7#7: *1 connect() failed (111: Connection refused)
   while connecting to upstream, client: 172.17.0.1,
   server: localhost, request: "GET /api/users/login HTTP/1.1"
   ```

**原因分析:**

我的本地开发环境使用 Vite 的 proxy 配置:
```js
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: path => path.replace(/^\/api/, '')  // 去掉 /api 前缀
  }
}
```

这意味着:
- 前端请求 `/api/users/login`
- Vite 代理会去掉 `/api`,转发到后端的 `/users/login`

但我最初的 Nginx 配置是:
```nginx
location /api {
    proxy_pass http://host.docker.internal:3000;
}
```

这会导致:
- 前端请求 `/api/users/login`
- Nginx 转发到 `http://host.docker.internal:3000/api/users/login`
- 后端路由是 `/users/login`,所以返回 404

**解决方案:**
修改 Nginx 配置,添加路径重写:

```nginx
location /api/ {
    proxy_pass http://host.docker.internal:3000/;
}
```

关键变化:
- `location /api` → `location /api/`
- `proxy_pass http://host.docker.internal:3000` → `proxy_pass http://host.docker.internal:3000/`

重新构建和运行:
```bash
docker stop react-manager-app
docker rm react-manager-app
docker build -t react-manager:latest .
docker run -d -p 8080:80 --name react-manager-app react-manager:latest
```

问题解决! ✅

---

## 📝 第四部分:常用操作命令总结

### 4.1 镜像操作

```bash
# 查看所有镜像
docker images

# 构建镜像
docker build -t 镜像名:标签 .

# 删除镜像
docker rmi 镜像名:标签

# 删除所有未使用的镜像
docker image prune -a

# 查看镜像详细信息
docker inspect 镜像名:标签

# 查看镜像构建历史
docker history 镜像名:标签
```

### 4.2 容器操作

```bash
# 运行容器
docker run -d -p 宿主机端口:容器端口 --name 容器名 镜像名:标签

# 查看运行中的容器
docker ps

# 查看所有容器(包括已停止的)
docker ps -a

# 停止容器
docker stop 容器名

# 启动已停止的容器
docker start 容器名

# 重启容器
docker restart 容器名

# 删除容器
docker rm 容器名

# 强制删除运行中的容器
docker rm -f 容器名

# 删除所有已停止的容器
docker container prune
```

### 4.3 日志和调试

```bash
# 查看容器日志
docker logs 容器名

# 实时查看日志
docker logs -f 容器名

# 查看最近 100 行日志
docker logs --tail 100 容器名

# 进入容器内部(交互式 shell)
docker exec -it 容器名 sh

# 在容器内执行单个命令
docker exec 容器名 ls /usr/share/nginx/html

# 查看容器资源占用
docker stats 容器名

# 查看容器详细信息
docker inspect 容器名
```

### 4.4 文件操作

```bash
# 从容器复制文件到宿主机
docker cp 容器名:/path/in/container /path/on/host

# 从宿主机复制文件到容器
docker cp /path/on/host 容器名:/path/in/container

# 查看容器内文件
docker exec 容器名 cat /etc/nginx/conf.d/default.conf
```

### 4.5 清理命令

```bash
# 停止所有运行中的容器
docker stop $(docker ps -q)

# 删除所有容器
docker rm $(docker ps -aq)

# 删除所有镜像
docker rmi $(docker images -q)

# 清理所有未使用的资源(镜像、容器、网络、缓存)
docker system prune -a

# 查看 Docker 磁盘占用
docker system df
```

---

## 🚀 第五部分:优化与最佳实践

### 5.1 使用 .dockerignore

创建 `.dockerignore` 文件,避免将不必要的文件复制到镜像中:

```
node_modules
dist
.git
.gitignore
.env
.env.local
README.md
*.log
.DS_Store
```

**好处:**
- 减小构建上下文大小
- 加快构建速度
- 减小镜像体积

### 5.2 使用 Docker Compose

对于更复杂的部署,可以使用 Docker Compose。

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    container_name: react-manager-app
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

**使用命令:**
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止并删除
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 5.3 环境变量管理

如果需要在不同环境使用不同配置:

```dockerfile
# Dockerfile
FROM nginx:alpine
ARG API_URL=http://localhost:3000
ENV VITE_API_URL=$API_URL
# ...
```

```bash
# 构建时传递环境变量
docker build --build-arg API_URL=https://api.production.com -t react-manager:prod .
```

### 5.4 健康检查

在 Dockerfile 中添加健康检查:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1
```

查看健康状态:
```bash
docker ps
# STATUS 列会显示 healthy 或 unhealthy
```

### 5.5 使用版本标签

```bash
# 使用语义化版本号
docker build -t react-manager:1.0.0 .
docker build -t react-manager:latest .

# 运行时指定版本
docker run -d -p 8080:80 react-manager:1.0.0
```

**好处:**
- 可以回滚到特定版本
- 避免 `latest` 标签带来的不确定性

---

## 📊 第六部分:部署前后对比

### 6.1 传统部署方式

```bash
# 在服务器上操作
sudo apt-get install nginx nodejs npm
git clone https://github.com/xxx/react-manager.git
cd react-manager
npm install
npm run build
sudo cp -r dist/* /var/www/html/
sudo vim /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

**问题:**
- 需要手动安装依赖
- 环境不一致可能导致"本地能跑,服务器不能跑"
- 更新麻烦,需要重复操作
- 难以回滚

### 6.2 Docker 部署方式

```bash
# 在任何安装了 Docker 的机器上
docker run -d -p 8080:80 react-manager:latest
```

**优势:**
- 一键部署,环境一致
- 易于扩展(启动多个容器实现负载均衡)
- 易于回滚(切换镜像版本)
- 隔离性好,不污染宿主机环境

---

## 🎓 第七部分:学习总结

### 7.1 掌握的核心概念

1. **镜像与容器的关系**: 镜像是模板,容器是实例
2. **Dockerfile 语法**: FROM、WORKDIR、COPY、RUN、CMD、EXPOSE
3. **多阶段构建**: 减小镜像体积的关键技术
4. **端口映射**: 如何让外部访问容器内服务
5. **容器网络**: host.docker.internal 访问宿主机
6. **Nginx 反向代理**: 路径重写规则

### 7.2 实战技能

1. ✅ 编写 Dockerfile 构建前端项目镜像
2. ✅ 配置 Nginx 处理 SPA 路由
3. ✅ 配置 Nginx 反向代理连接后端
4. ✅ 使用 Docker 命令管理镜像和容器
5. ✅ 排查和解决常见部署问题
6. ✅ 优化镜像体积和构建速度

### 7.3 遇到的坑与解决

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 镜像拉取超时 | 国内网络限制 | 配置国内镜像源 |
| crypto.hash 错误 | Node.js 版本太低 | 升级到 Node.js 20 |
| API 请求 404 | Nginx 未去掉 /api 前缀 | 修改 proxy_pass 配置 |
| 无法访问宿主机后端 | 容器内 localhost 指向容器本身 | 使用 host.docker.internal |

### 7.4 下一步学习方向

1. **Docker Compose**: 管理多容器应用
2. **Docker 网络**: bridge、host、overlay 等网络模式
3. **Docker 数据卷**: 持久化存储
4. **CI/CD 集成**: 结合 GitHub Actions 自动构建镜像
5. **Kubernetes**: 容器编排,适用于大规模部署
6. **镜像仓库**: 使用 Docker Hub 或私有仓库管理镜像

---

## 📚 参考资料

- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Docker Hub](https://hub.docker.com/)

---

## ✅ 总结

通过这次实战,我成功将 React 前端项目部署到 Docker 容器中,并配置了 Nginx 反向代理连接本地后端。整个过程涉及到:

1. **Docker 基础概念**的理解(镜像、容器、Dockerfile)
2. **多阶段构建**优化镜像体积
3. **Nginx 配置**处理 SPA 路由和 API 代理
4. **问题排查**和解决能力的提升

Docker 让部署变得简单、可重复、可移植,是现代应用开发的必备技能。这次实战让我对 Docker 有了更深入的理解,也为后续学习容器编排(Kubernetes)打下了基础。

**最重要的收获:**
遇到问题时,通过查看日志(`docker logs`)、进入容器调试(`docker exec`)、对比本地配置,能够系统性地排查和解决问题。这种问题解决思路比具体的技术知识更有价值。

---

**作者:** [你的名字]
**日期:** 2024-01-12
**项目:** 车辆管理系统
**技术栈:** Docker + Nginx + React + Vite
