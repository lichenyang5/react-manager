# React Manager

车辆管理系统前端。基于 React 18 + Vite + Ant Design，当前已接入 NestJS 后端，支持 Docker 构建，可通过 docker-compose 与后端、MongoDB 一起运行。

## 技术栈

- React 18
- Vite 7
- Ant Design 5
- ECharts
- Axios
- Zustand（状态管理）
- ahooks
- Docker + Nginx（生产部署）

## 功能模块

- 登录 / 权限控制
- Dashboard（折线图、饼图、雷达图）
- 用户管理
- 部门管理
- 菜单管理
- 角色管理
- 订单管理（列表、详情、城市地图、导出）

## 本地开发

```bash
npm install
npm run dev
```

开发服务器启动在 http://localhost:8080，通过 Vite 代理将 `/api` 请求转发到后端。

**前提：** 需要先启动 NestJS 后端（端口 3001）。

启动后端的方式：
- Docker：在后端仓库执行 `docker compose up -d --build`
- 本地：在后端仓库执行 `cd nest-server && npm run start:dev`

登录账号：`admin`，密码：`111111`

## 环境变量

| 变量 | 开发环境 | 生产环境（Docker） |
|------|---------|-----------------|
| VITE_BASE_API | `/api`（走 Vite 代理） | `http://localhost:3001`（直连后端） |
| VITE_MOCK | `false` | `false` |

环境变量文件：
- `.env.development` — 本地开发
- `.env.production` — Docker 构建

## Docker 构建

```bash
docker build -t react-manager-web .
docker run --rm -p 8080:80 react-manager-web
```

访问 http://localhost:8080

注意：Docker 构建使用 `.env.production`，API 地址会被设为 `http://localhost:3001`。需要后端在宿主机 3001 端口可达。

## 与后端一起启动

完整一键启动在后端仓库 `react-manager-server` 中执行：

```bash
docker compose up -d --build
```

目录结构要求：

```
workspace/
├── react-manager-server/   ← docker-compose.yml 在这里
└── react-manager/          ← 本仓库
```

启动后：
- 前端：http://localhost:8080
- 后端：http://localhost:3001

## 构建产物

```bash
npm run build
```

产出目录 `dist/`，包含静态 HTML/JS/CSS。生产环境由 Nginx 托管，`nginx.conf` 配置了 SPA history fallback。

## 常见问题

### 登录失败

1. 检查后端是否启动：`curl http://localhost:3001/health`
2. 检查 Docker MongoDB 是否有数据（空库没有 admin 用户）
3. 确认账号密码：admin / 111111

### 接口请求不是 localhost:3001

检查 `.env.production` 中 `VITE_BASE_API` 是否为 `http://localhost:3001`。本地开发用 `.env.development` 中的 `/api`（走 Vite 代理）。

### CORS 报错

后端 NestJS 已启用 CORS（`nest-server/src/main.ts` 中 `app.enableCors()`）。如果仍报错，确认后端容器是否正常运行。

### 8080 端口被占用

换端口运行：

```bash
docker run --rm -p 8081:80 react-manager-web
```

或修改 docker-compose.yml 中的端口映射。

### 页面刷新 404

生产环境需要 Nginx 的 history fallback。当前 `nginx.conf` 已配置 `try_files $uri $uri/ /index.html`，正常情况不会出现。如果出现，检查 nginx.conf 是否正确复制到容器中。
