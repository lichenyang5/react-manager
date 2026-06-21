# 第一步：构建前端项目（基于Node镜像）
FROM node:20-alpine AS build
WORKDIR /app
# 复制package.json和锁文件，安装依赖
COPY package*.json ./
RUN npm install
# 复制全部项目文件
COPY . .
# 构建生产版本（根据项目package.json的build命令调整，你的项目是vite构建，命令正确）
RUN npm run build

# 第二步：部署到Nginx（轻量服务器镜像）
FROM nginx:alpine
# 从构建阶段复制打包后的文件到Nginx静态目录
COPY --from=build /app/dist /usr/share/nginx/html
# 复制自定义Nginx配置（解决SPA路由刷新404问题）
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露80端口（容器对外提供服务的端口）
EXPOSE 80
# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
