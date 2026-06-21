# React Manager 项目 Docker 部署文档

## 📋 前置准备

### 1. 安装 Docker
确保你的电脑已经安装了 Docker。

**Mac 用户:**
- 下载 Docker Desktop for Mac: https://www.docker.com/products/docker-desktop
- 安装后启动 Docker Desktop

**验证 Docker 是否安装成功:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 部署步骤

### 步骤 1: 确认项目文件

确保你的项目根目录包含以下文件:
- ✅ `Dockerfile` (已存在)
- ✅ `nginx.conf` (已存在)
- ✅ `package.json` (已存在)

### 步骤 2: 构建 Docker 镜像

在项目根目录(`/Users/lichenyang/Desktop/毕业设计-车辆管理系统/react-manager`)下打开终端,执行以下命令:

```bash
# 构建镜像,命名为 react-manager,标签为 latest
docker build -t react-manager:latest .
```

**说明:**
- `-t react-manager:latest`: 给镜像命名为 `react-manager`,版本标签为 `latest`
- `.`: 表示使用当前目录的 Dockerfile

**构建过程大约需要 3-5 分钟,会看到以下步骤:**
1. 下载 Node.js 18 镜像
2. 安装项目依赖 (npm install)
3. 构建生产版本 (npm run build)
4. 下载 Nginx 镜像
5. 复制构建文件到 Nginx

### 步骤 3: 查看构建的镜像

```bash
# 查看所有 Docker 镜像
docker images
```

你应该能看到类似以下输出:
```
REPOSITORY      TAG       IMAGE ID       CREATED          SIZE
react-manager   latest    xxxxxxxxxx     2 minutes ago    50MB
```

### 步骤 4: 运行 Docker 容器

```bash
# 运行容器,将容器的 80 端口映射到本地的 8080 端口
docker run -d -p 8080:80 --name react-manager-app react-manager:latest
```

**参数说明:**
- `-d`: 后台运行容器
- `-p 8080:80`: 将容器内部的 80 端口映射到主机的 8080 端口
- `--name react-manager-app`: 给容器命名为 `react-manager-app`
- `react-manager:latest`: 使用刚才构建的镜像

### 步骤 5: 验证容器是否运行

```bash
# 查看正在运行的容器
docker ps
```

你应该能看到类似以下输出:
```
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                  NAMES
xxxxxxxxxx     react-manager:latest     "/docker-entrypoint.…"   10 seconds ago   Up 9 seconds    0.0.0.0:8080->80/tcp   react-manager-app
```

### 步骤 6: 访问应用

打开浏览器,访问:
```
http://localhost:8080
```

你应该能看到你的 React Manager 应用已经成功运行! 🎉

---

## 🔧 常用 Docker 命令

### 查看容器日志
```bash
# 查看容器运行日志
docker logs react-manager-app

# 实时查看日志(类似 tail -f)
docker logs -f react-manager-app
```

### 停止容器
```bash
docker stop react-manager-app
```

### 启动已停止的容器
```bash
docker start react-manager-app
```

### 重启容器
```bash
docker restart react-manager-app
```

### 删除容器
```bash
# 先停止容器
docker stop react-manager-app

# 再删除容器
docker rm react-manager-app
```

### 删除镜像
```bash
# 删除镜像(需要先删除使用该镜像的容器)
docker rmi react-manager:latest
```

### 进入容器内部调试
```bash
# 进入容器的 shell
docker exec -it react-manager-app sh

# 查看 Nginx 配置
cat /etc/nginx/conf.d/default.conf

# 查看静态文件
ls /usr/share/nginx/html

# 退出容器
exit
```

---

## 🔄 更新部署流程

当你修改了代码后,需要重新部署:

```bash
# 1. 停止并删除旧容器
docker stop react-manager-app
docker rm react-manager-app

# 2. 删除旧镜像(可选,但建议删除以节省空间)
docker rmi react-manager:latest

# 3. 重新构建镜像
docker build -t react-manager:latest .

# 4. 运行新容器
docker run -d -p 8080:80 --name react-manager-app react-manager:latest
```

**快捷一键更新脚本:**
```bash
# 创建一个更新脚本
docker stop react-manager-app && \
docker rm react-manager-app && \
docker build -t react-manager:latest . && \
docker run -d -p 8080:80 --name react-manager-app react-manager:latest
```

---

## 🐛 常见问题排查

### 问题 1: 端口已被占用
**错误信息:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**解决方案:**
```bash
# 方案 1: 使用其他端口,比如 8081
docker run -d -p 8081:80 --name react-manager-app react-manager:latest

# 方案 2: 找到占用 8080 端口的进程并杀掉
lsof -ti:8080 | xargs kill -9
```

### 问题 2: 构建失败,npm install 报错
**解决方案:**
```bash
# 清理 npm 缓存后重新构建
docker build --no-cache -t react-manager:latest .
```

### 问题 3: 页面刷新后 404
这个问题已经通过 `nginx.conf` 中的 `try_files` 配置解决了,确保 nginx.conf 配置正确。

### 问题 4: API 请求失败
如果你的前端需要访问后端 API,需要配置 Nginx 反向代理。

**修改 nginx.conf,添加 API 代理:**
```nginx
location /api {
    proxy_pass http://your-backend-host:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 问题 5: 容器无法启动
```bash
# 查看容器日志找到错误原因
docker logs react-manager-app

# 查看所有容器(包括已停止的)
docker ps -a
```

---

## 📦 使用 Docker Compose (推荐)

为了更方便管理,建议创建 `docker-compose.yml` 文件:

```yaml
version: '3.8'

services:
  react-manager:
    build: .
    container_name: react-manager-app
    ports:
      - "8080:80"
    restart: unless-stopped
```

**使用 Docker Compose 部署:**
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

---

## 🌐 生产环境部署建议

### 1. 环境变量配置
如果需要配置不同环境的 API 地址,可以使用环境变量:

```bash
docker run -d -p 8080:80 \
  -e VITE_API_URL=https://api.production.com \
  --name react-manager-app \
  react-manager:latest
```

### 2. 使用特定版本标签
```bash
# 构建时使用版本号而不是 latest
docker build -t react-manager:1.0.0 .

# 运行时指定版本
docker run -d -p 8080:80 --name react-manager-app react-manager:1.0.0
```

### 3. 健康检查
在 Dockerfile 中添加健康检查:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1
```

---

## 📚 参考资料

- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ 部署检查清单

- [ ] Docker 已安装并运行
- [ ] 项目文件完整(Dockerfile, nginx.conf, package.json)
- [ ] 镜像构建成功
- [ ] 容器运行正常
- [ ] 浏览器可以访问 http://localhost:8080
- [ ] 页面功能正常
- [ ] 路由跳转正常,刷新页面不会 404

---

**部署完成! 如有问题,请参考常见问题排查部分或查看容器日志。** 🎉
