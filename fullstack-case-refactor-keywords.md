# 全栈工程化重构关键词：react-manager / react-manager-server

项目地址：

- 前端：https://github.com/lichenyang5/react-manager
- 后端：https://github.com/lichenyang5/react-manager-server

本地项目地址
前端 /Users/lichenyang/项目/车辆管理系统/react-manager
后端 /Users/lichenyang/项目/车辆管理系统/myreactserver
---

# 一、项目定位

你现在接手的是我的**全栈工程化重构案例项目**。

这个项目原本是我的毕业设计，技术栈是：

```txt
React + Express + MongoDB
```

现在我要把它重构成一个可以用于**全栈岗位展示**的现代化工程案例。

重构目标不是重新写业务，也不是增加很多新功能，而是在保留原页面效果、业务逻辑、接口语义、数据库结构的前提下，升级整体工程架构。

最终项目需要体现以下能力：

```txt
1. React / Next.js 前端工程能力
2. TypeScript 类型设计能力
3. 前端 Feature + 类 MVVM 分层能力
4. 后端 Route / Controller / Biz / Imp / Model 分层能力
5. MongoDB / Mongoose 数据建模能力
6. JWT 登录鉴权能力
7. 统一接口封装和统一返回结构
8. Docker Compose 一键部署能力
9. 旧项目渐进式重构能力
10. README / ARCHITECTURE / PROJECT_STORY 文档表达能力
```

---

# 二、总目标

把当前“React 前端 + Express 后端 + MongoDB”的毕业设计后台管理系统，逐步重构成一个适合用于全栈岗位展示的现代化工程案例。

项目重点是工程化升级：

```txt
前端架构
后端分层
接口封装
MongoDB 建模
JWT 鉴权
Docker 一键部署
架构文档沉淀
旧项目渐进式重构
```

最终技术栈目标：

```txt
Next.js 最新稳定版
React 最新稳定版
TypeScript
MongoDB + Mongoose
Docker Compose
App Router
Route Handlers
JWT
前端 Feature + 类 MVVM
后端 Route / Controller / Biz / Imp / Model
```

---

# 三、最高优先级原则

```txt
这是全栈案例重构，不是业务重写。
每次只做一个小重构点。
接口路径、请求参数、返回结构、页面效果、权限逻辑、数据库字段都尽量保持不变。
```

详细原则：

```txt
1. 这是重构，不是重写业务。
2. 这是全栈岗位展示案例，不只是毕业设计翻新。
3. 每一步只做一个小重构点。
4. 每一步完成后必须能运行。
5. 不要擅自改页面交互、菜单、权限、字段名、接口返回结构。
6. 不要一次性迁移所有模块。
7. 每次提交前输出本次改动点、风险点、验证方式、建议 commit message。
8. 所有接口返回仍保持 { code, data, msg } 风格。
9. 旧接口路径尽量保持不变，例如：
   - /user/login
   - /users/list
   - /dept/list
   - /menu/list
   - /roles/list
   - /order/dashboard/getReportData
10. MongoDB 仍然使用原来的数据库结构，除非某一步明确要求迁移。
11. 先保证效果一致，再做架构优化。
12. 每个阶段都要能作为一次独立 commit。
```

---

# 四、推荐最终目录结构

```txt
apps/web/
  app/
    api/
      health/
        route.ts

      user/
        login/
          route.ts

      users/
        list/
          route.ts
        all/
          list/
            route.ts
        getUserInfo/
          route.ts
        getPermissionList/
          route.ts
        create/
          route.ts
        edit/
          route.ts
        delete/
          route.ts

      dept/
        list/
          route.ts
        create/
          route.ts
        edit/
          route.ts
        delete/
          route.ts

      menu/
        list/
          route.ts
        create/
          route.ts
        edit/
          route.ts
        delete/
          route.ts

      roles/
        list/
          route.ts
        create/
          route.ts
        edit/
          route.ts
        delete/
          route.ts

      order/
        list/
          route.ts
        dashboard/
          getReportData/
            route.ts
          getLineData/
            route.ts
          getPieCityData/
            route.ts
          getPieAgeData/
            route.ts
          getRadarData/
            route.ts

      driver/
        list/
          route.ts

    login/
      page.tsx

    dashboard/
      page.tsx

    userList/
      page.tsx

    deptList/
      page.tsx

    menuList/
      page.tsx

    roleList/
      page.tsx

    orderList/
      page.tsx

    cluster/
      page.tsx

    driverList/
      page.tsx

    layout.tsx
    page.tsx

  src/
    shared/
      http/
        request.ts
        response.ts
        error.ts

      config/
        env.ts

      store/
        auth.store.ts
        theme.store.ts

      types/
        api.ts

      utils/
        storage.ts
        token.ts
        format.ts

    features/
      auth/
        model/
          auth.types.ts
        service/
          auth.api.ts
        viewmodel/
          useLoginViewModel.ts
        view/
          LoginView.tsx

      user/
        model/
          user.types.ts
        service/
          user.api.ts
        viewmodel/
          useUserListViewModel.ts
        view/
          UserListView.tsx

      dept/
        model/
          dept.types.ts
        service/
          dept.api.ts
        viewmodel/
          useDeptListViewModel.ts
        view/
          DeptListView.tsx

      menu/
        model/
          menu.types.ts
        service/
          menu.api.ts
        viewmodel/
          useMenuListViewModel.ts
        view/
          MenuListView.tsx

      role/
        model/
          role.types.ts
        service/
          role.api.ts
        viewmodel/
          useRoleListViewModel.ts
        view/
          RoleListView.tsx

      order/
        model/
          order.types.ts
        service/
          order.api.ts
        viewmodel/
          useOrderListViewModel.ts
        view/
          OrderListView.tsx

      dashboard/
        model/
          dashboard.types.ts
        service/
          dashboard.api.ts
        viewmodel/
          useDashboardViewModel.ts
        view/
          DashboardView.tsx

    server/
      db/
        mongoose.ts

      models/
        UserModel.ts
        DeptModel.ts
        MenuModel.ts
        RoleModel.ts
        OrderModel.ts
        DriverModel.ts

      repositories/
        UserImp.ts
        DeptImp.ts
        MenuImp.ts
        RoleImp.ts
        OrderImp.ts
        DashboardImp.ts
        DriverImp.ts

      biz/
        AuthBiz.ts
        UserBiz.ts
        DeptBiz.ts
        MenuBiz.ts
        RoleBiz.ts
        OrderBiz.ts
        DashboardBiz.ts
        DriverBiz.ts

      controllers/
        AuthController.ts
        UserController.ts
        DeptController.ts
        MenuController.ts
        RoleController.ts
        OrderController.ts
        DashboardController.ts
        DriverController.ts

      middleware/
        auth.ts

      utils/
        jwt.ts
        response.ts
        request.ts

docker-compose.yml
Dockerfile
.env.example
README.md
ARCHITECTURE.md
PROJECT_STORY.md
REFACTOR_PLAN.md
```

---

# 五、前端分层说明

前端不是强行照搬传统 MVVM，而是使用适合 React 的：

```txt
Feature + 类 MVVM 分层
```

对应关系：

```txt
View       = React 组件，只负责 UI 渲染
ViewModel  = 自定义 Hook，负责页面状态、loading、分页、查询、弹窗、提交
Model      = TypeScript 类型、DTO、表单结构
Service    = API 请求封装
Store      = 全局状态，例如 token、userInfo、theme
```

示例：

```txt
features/user/
  model/
    user.types.ts

  service/
    user.api.ts

  viewmodel/
    useUserListViewModel.ts

  view/
    UserListView.tsx
```

职责要求：

```txt
UserListView.tsx：
只负责渲染表格、按钮、弹窗、表单，不直接写复杂请求逻辑。

useUserListViewModel.ts：
负责 list、loading、pagination、searchForm、modalVisible、handleCreate、handleEdit、handleDelete。

user.api.ts：
负责 request.get('/users/list')、request.post('/users/create') 等接口请求。

user.types.ts：
负责 UserItem、UserQuery、CreateUserPayload、UpdateUserPayload 等类型定义。
```

---

# 六、后端分层说明

后端使用：

```txt
Route / Controller / Biz / Imp / Model
```

也可以理解为 Web 常见的：

```txt
Route / Controller / Service / Repository / Model
```

其中：

```txt
Biz = Service / UseCase / 业务层
Imp = RepositoryImpl / 数据访问实现层
```

对应关系：

```txt
route.ts        = 接口入口，只负责接收 HTTP 请求
Controller      = 处理入参、调用 Biz、统一返回
Biz             = 写业务流程，例如登录校验、权限拼装、分页参数处理
Imp             = 负责数据库访问，实现 MongoDB 查询、创建、更新、删除
Model           = Mongoose Schema 和 TypeScript 类型
```

调用链示例：

```txt
app/api/users/list/route.ts
    ↓
UserController.list()
    ↓
UserBiz.getUserList()
    ↓
UserImp.findList()
    ↓
UserModel.find()
```

重要要求：

```txt
Controller 不写复杂业务。
Biz 写业务流程。
Imp 只管数据库。
Model 只定义数据模型。
route.ts 只做接口入口，不要堆业务代码。
```

---

# 七、给 CC 的总提示词

```txt
你现在是我的全栈工程化重构助手。

请严格按照“全栈工程化重构关键词”执行。

我的项目原本是毕业设计，技术栈是 React + Express + MongoDB。
现在我要把它重构成一个可以用于全栈岗位展示的现代化工程案例。

我的目标不是重新做一个项目，而是在保持原业务逻辑、页面效果、接口路径、请求参数、返回结构不变的前提下，把旧项目逐步重构成 Next.js + React + TypeScript + MongoDB + Docker Compose 项目。

你每次只能做一个小重构点。

你每次改完必须告诉我：
1. 本次改了哪些文件
2. 为什么这样改
3. 有没有动业务逻辑
4. 怎么验证
5. 风险点是什么
6. 建议 commit message

任何时候都不要一次性大改。
任何时候都不要擅自改字段名、接口返回结构、页面交互、权限逻辑。
如果你不确定旧逻辑，请先读取旧代码再迁移。

最高优先级：
这是全栈案例重构，不是业务重写。
每次只做一个小点，改完必须能运行，再提交。
```

---

# 八、分阶段执行关键词

## 第 0 步：建重构分支 + 项目体检

```txt
基于当前两个仓库创建重构分支：refactor/fullstack-case-modernize。

先不要改业务代码，只做项目体检。

目标：
1. 扫描前端 react-manager 的 package.json、src/api、src/router、src/store、src/views。
2. 扫描后端 react-manager-server 的 index.cjs、router、models、tools/connect.cjs。
3. 输出当前接口清单。
4. 输出当前页面清单。
5. 输出当前数据模型清单。
6. 输出登录鉴权流程。
7. 输出前后端调用关系。
8. 生成 REFACTOR_PLAN.md，记录迁移路线。
9. 在文档中明确：这是用于全栈岗位展示的工程化重构案例。
10. 不要修改业务逻辑。

本次提交只允许新增文档，不允许改功能代码。

验证方式：
- 确认没有改动业务文件。
- 确认 REFACTOR_PLAN.md 内容完整。

建议 commit message：
docs: add fullstack modernization refactor plan
```

---

## 第 1 步：整理 monorepo 骨架

```txt
开始搭建 monorepo 骨架，但不要迁移业务逻辑。

目标：
1. 创建 apps/web 目录。
2. 使用 Next.js 最新稳定版 + React 最新稳定版 + TypeScript + App Router 初始化 apps/web。
3. 保留原 react-manager 和 react-manager-server 目录作为 legacy 参考，暂时不要删除。
4. 根目录增加 package.json workspace 配置。
5. 增加 .gitignore。
6. 增加 .env.example。
7. 确保 apps/web 可以 npm run dev 正常启动。
8. 不要迁移页面。
9. 不要迁移接口。
10. 不要删除旧代码。

验证方式：
- npm install
- npm run dev
- 浏览器打开 Next 首页正常。

建议 commit message：
chore: initialize nextjs monorepo structure
```

---

## 第 2 步：加 Docker Compose，只跑空 Next + Mongo

```txt
给项目增加 Docker 一键启动能力，但先不要接业务。

目标：
1. 根目录新增 docker-compose.yml。
2. 新增 apps/web/Dockerfile。
3. docker-compose 中至少包含：
   - web：Next.js 应用
   - mongo：MongoDB
4. mongo 使用 volume 持久化数据。
5. 使用 healthcheck 检查 MongoDB 可用。
6. web 通过环境变量 MONGODB_URI 连接 mongo 服务名，不要写死 127.0.0.1。
7. 新增 README 的本地启动说明：
   - npm install
   - npm run dev
   - docker compose up --build
8. 暂时只验证 Next 首页可以打开，Mongo 容器可以启动。
9. 不要迁移业务接口。
10. 不要迁移前端页面。

验证方式：
- docker compose up --build
- web 容器启动成功。
- mongo 容器启动成功。
- 浏览器可以访问 Next 首页。

建议 commit message：
chore: add docker compose for next and mongodb
```

---

## 第 3 步：迁移后端基础设施，不迁移业务接口

```txt
在 Next 项目中搭建 server 基础层，但不要迁移具体业务接口。

目标：
1. 在 apps/web/src/server/db/mongoose.ts 中封装 MongoDB 连接。
2. 在 apps/web/src/server/utils/response.ts 中封装统一返回：
   - success(data, msg)
   - fail(code, msg, data)
3. 在 apps/web/src/server/utils/jwt.ts 中封装：
   - signToken
   - verifyToken
4. 在 apps/web/src/server/middleware/auth.ts 中封装鉴权逻辑。
5. 新增 app/api/health/route.ts。
6. /api/health 返回：
   { code: 0, data: { ok: true }, msg: "ok" }
7. 不迁移原业务接口。
8. 确保本地和 Docker 下 /api/health 都能访问。

验证方式：
- npm run dev
- 访问 /api/health
- docker compose up --build
- Docker 环境下访问 /api/health

建议 commit message：
feat: add server foundation for next api routes
```

---

## 第 4 步：迁移 Mongo Models

```txt
把旧后端 models 逐个迁移到 Next 项目的 server/models 中。

要求：
1. 参考 react-manager-server/models 里的旧 Mongoose Schema。
2. 转成 TypeScript 写法。
3. 每个模型单独文件，例如：
   - UserModel.ts
   - DeptModel.ts
   - MenuModel.ts
   - RoleModel.ts
   - OrderModel.ts
   - DriverModel.ts
4. 保持 collection 名不变。
5. 保持字段名不变。
6. 保持默认值尽量不变。
7. 不要优化字段。
8. 不要改数据库结构。
9. 只迁移模型，不写接口逻辑。
10. 每个 model 要避免 Next.js 热更新下重复注册模型的问题。

验证方式：
- npm run build
- TypeScript 不报错。
- 不影响 /api/health。

建议 commit message：
refactor: migrate mongoose models to typescript
```

---

## 第 5 步：迁移登录接口 /user/login

```txt
只迁移登录接口，不迁移其他接口。

目标：
1. 新增 AuthImp。
2. 新增 AuthBiz。
3. 新增 AuthController。
4. 新增 app/api/user/login/route.ts。
5. 保持旧接口路径语义：
   - 前端请求仍是 /user/login
   - 或通过 rewrites 映射到 /api/user/login
6. 保持返回结构：
   成功：{ code: 0, data: { token }, msg: "登录成功" }
   失败：{ code: 1, data: {}, msg: "账号密码错误" }
7. JWT payload 和旧项目保持一致：
   - id
   - userName
   - roleList
8. 密码逻辑暂时保持旧逻辑，不做安全升级。
9. 不迁移其他接口。
10. 新增简单接口验证说明。

验证方式：
- 用旧账号密码调用登录接口。
- 确认 token 返回。
- 确认错误密码返回结构不变。
- 确认没有影响 /api/health。

建议 commit message：
refactor: migrate login api to next route handler
```

---

## 第 6 步：迁移用户相关接口

```txt
只迁移 users 模块接口，不迁移部门、菜单、角色、订单。

目标：
1. 参考旧后端 router/userList.cjs。
2. 新增 UserImp。
3. 新增 UserBiz。
4. 新增 UserController。
5. 迁移以下接口：
   - /users/getUserInfo
   - /users/getPermissionList
   - /users/list
   - /users/all/list
   - /users/create
   - /users/edit
   - /users/delete
6. 保持旧字段。
7. 保持旧分页。
8. 保持旧返回结构。
9. 所有需要登录的接口都走 auth middleware。
10. 不改前端页面。
11. 输出接口对照表。

验证方式：
- 登录后获取用户信息。
- 查询用户列表。
- 新增用户。
- 编辑用户。
- 删除用户。
- 确认返回结构和旧接口一致。

建议 commit message：
refactor: migrate user apis to next architecture
```

---

## 第 7 步：迁移部门、菜单、角色接口

```txt
迁移系统管理相关接口，但不要动前端 UI。

目标：
1. 参考旧后端 deptList.cjs、menuList.cjs、roleList.cjs。
2. 新增 DeptImp / DeptBiz / DeptController。
3. 新增 MenuImp / MenuBiz / MenuController。
4. 新增 RoleImp / RoleBiz / RoleController。
5. 迁移接口：
   - /dept/list
   - /dept/create
   - /dept/edit
   - /dept/delete
   - /menu/list
   - /menu/create
   - /menu/edit
   - /menu/delete
   - /roles/list
   - /roles/create
   - /roles/edit
   - /roles/delete
6. 保持旧请求参数。
7. 保持旧返回结构。
8. 不做权限逻辑重写。
9. 不改页面。

验证方式：
- 查询部门列表。
- 查询菜单列表。
- 查询角色列表。
- 新增/编辑/删除操作返回结构不变。
- 页面暂时不改。

建议 commit message：
refactor: migrate system management apis
```

---

## 第 8 步：迁移 dashboard 和订单接口

```txt
迁移 dashboard 和订单相关接口，不改业务逻辑。

目标：
1. 参考旧后端 getData.cjs、orderList.cjs 以及相关 models。
2. 新增 DashboardImp / DashboardBiz / DashboardController。
3. 新增 OrderImp / OrderBiz / OrderController。
4. 迁移接口：
   - /order/dashboard/getReportData
   - /order/dashboard/getLineData
   - /order/dashboard/getPieCityData
   - /order/dashboard/getPieAgeData
   - /order/dashboard/getRadarData
   - /order/list
   - /order/cluster
   - /driver/list
   具体以旧项目实际接口为准。
5. 保持 ECharts 所需数据结构不变。
6. 不改前端图表逻辑。
7. 输出接口对照表。

验证方式：
- 调用 dashboard 数据接口。
- 确认图表数据结构不变。
- 调用订单列表接口。
- 调用司机列表接口。

建议 commit message：
refactor: migrate dashboard and order apis
```

---

## 第 9 步：统一前端请求封装

```txt
开始迁移前端请求层，但不要改页面 UI。

目标：
1. 在 apps/web/src/shared/http/request.ts 中封装统一 request。
2. 支持 baseURL。
3. 支持 token 自动注入。
4. 支持统一处理 { code, data, msg }。
5. 支持 token 失效跳转登录。
6. 支持错误 message 统一处理。
7. 迁移旧 src/api/index.ts、orderApi.ts、roleApi.ts 为 feature service。
8. 不改变接口路径。
9. 不改变组件调用结果。
10. 不要一次性重写所有页面。
11. 只先迁移 auth、user、dept、menu、role、order、dashboard 的 api service 文件。

验证方式：
- 登录接口正常。
- 用户列表接口正常。
- token 正常携带。
- 错误提示正常。

建议 commit message：
refactor: centralize frontend request layer
```

---

## 第 10 步：迁移前端登录页为 Feature + 类 MVVM

```txt
只迁移登录页到 Feature + 类 MVVM 结构。

目标：
1. 创建 features/auth：
   - model/auth.types.ts
   - service/auth.api.ts
   - viewmodel/useLoginViewModel.ts
   - view/LoginView.tsx
2. page.tsx 只负责挂载 LoginView。
3. 登录逻辑放在 useLoginViewModel。
4. UI 视觉尽量保持旧项目一致。
5. 登录成功后的跳转逻辑保持旧逻辑。
6. 不改其他页面。
7. 不改登录接口返回结构。

验证方式：
- 打开登录页。
- 输入账号密码登录。
- 登录成功跳转。
- 登录失败提示正常。

建议 commit message：
refactor: migrate login page to mvvm structure
```

---

## 第 11 步：迁移 Layout、菜单、权限路由

```txt
迁移主布局和权限路由逻辑，保持页面效果不变。

目标：
1. 迁移旧 layout。
2. 迁移菜单渲染逻辑。
3. 迁移 token 校验逻辑。
4. 使用 Next.js App Router 的页面结构组织路由。
5. 保持旧菜单路径：
   - /welcome
   - /dashboard
   - /userList
   - /deptList
   - /menuList
   - /roleList
   - /orderList
   - /cluster
   - /driverList
6. 如果 Next 页面路径和旧路径不同，用 redirect 或 rewrites 保持兼容。
7. 不改业务逻辑。
8. 不改权限数据结构。

验证方式：
- 登录后进入主布局。
- 菜单正常显示。
- 刷新页面不丢登录态。
- 未登录访问业务页面会跳转登录。

建议 commit message：
refactor: migrate layout and route guards
```

---

## 第 12 步：迁移用户列表页面

```txt
开始迁移页面，但每次只迁移一个模块。

本次只迁移 userList。

目标：
1. 创建 features/user：
   - model/user.types.ts
   - service/user.api.ts
   - viewmodel/useUserListViewModel.ts
   - view/UserListView.tsx
2. 把旧页面逻辑拆分：
   - UI 放 View
   - 请求和状态放 ViewModel
   - 类型放 Model
   - 接口放 Service
3. 页面效果保持不变。
4. 表格列保持不变。
5. 查询条件保持不变。
6. 弹窗保持不变。
7. 按钮权限保持不变。
8. 不重构其他模块。
9. 迁移完成后输出验证清单。

验证方式：
- 用户列表正常展示。
- 查询正常。
- 新增正常。
- 编辑正常。
- 删除正常。
- 分页正常。

建议 commit message：
refactor: migrate user list page to mvvm
```

---

## 第 13 步：按模块继续迁移页面

每次只丢其中一个提示词给 CC。

### 13.1 部门页面

```txt
只迁移 deptList 页面到 Feature + 类 MVVM 结构。

要求：
1. 创建 features/dept。
2. 拆分 model / service / viewmodel / view。
3. 页面效果、字段、接口、弹窗、按钮权限保持不变。
4. 不改其他模块。

建议 commit message：
refactor: migrate dept page to mvvm
```

### 13.2 菜单页面

```txt
只迁移 menuList 页面到 Feature + 类 MVVM 结构。

要求：
1. 创建 features/menu。
2. 拆分 model / service / viewmodel / view。
3. 页面效果、字段、接口、树形结构、弹窗、按钮权限保持不变。
4. 不改其他模块。

建议 commit message：
refactor: migrate menu page to mvvm
```

### 13.3 角色页面

```txt
只迁移 roleList 页面到 Feature + 类 MVVM 结构。

要求：
1. 创建 features/role。
2. 拆分 model / service / viewmodel / view。
3. 页面效果、字段、接口、权限配置逻辑、弹窗、按钮权限保持不变。
4. 不改其他模块。

建议 commit message：
refactor: migrate role page to mvvm
```

### 13.4 Dashboard 页面

```txt
只迁移 dashboard 页面到 Feature + 类 MVVM 结构。

要求：
1. 创建 features/dashboard。
2. 拆分 model / service / viewmodel / view。
3. ECharts 图表结构保持不变。
4. 图表接口数据结构保持不变。
5. 页面效果尽量保持旧项目一致。
6. 不改其他模块。

建议 commit message：
refactor: migrate dashboard page to mvvm
```

### 13.5 订单页面

```txt
只迁移 orderList 页面到 Feature + 类 MVVM 结构。

要求：
1. 创建 features/order。
2. 拆分 model / service / viewmodel / view。
3. 表格字段、查询条件、分页、接口保持不变。
4. 不改其他模块。

建议 commit message：
refactor: migrate order list page to mvvm
```

### 13.6 司机页面

```txt
只迁移 driverList 页面到 Feature + 类 MVVM 结构。

要求：
1. 创建 features/driver。
2. 拆分 model / service / viewmodel / view。
3. 表格字段、查询条件、分页、接口保持不变。
4. 不改其他模块。

建议 commit message：
refactor: migrate driver list page to mvvm
```

---

## 第 14 步：删除旧 Express 后端依赖

```txt
在确认所有接口已经迁移到 Next Route Handlers 后，再删除旧 Express 后端。

目标：
1. 确认 react-manager-server 中所有接口都有 Next 版本。
2. 确认前端所有请求都走 Next API。
3. 删除 Express server 启动依赖。
4. 删除旧 index.cjs、router、tools/connect.cjs，或移动到 legacy 目录。
5. README 标注旧后端已废弃。
6. 不改业务逻辑。
7. 不改数据库结构。

验证方式：
- 不启动旧 Express 服务。
- Next 项目所有接口正常。
- 前端页面全部能正常请求数据。

建议 commit message：
chore: remove legacy express server after migration
```

---

## 第 15 步：Docker 一键完整部署

```txt
完善 Docker 一键部署。

目标：
1. docker compose up --build 后可以启动：
   - Next.js web
   - MongoDB
2. web 自动读取 MONGODB_URI。
3. MongoDB 数据通过 volume 持久化。
4. 增加可选 seed 脚本，用于初始化毕业设计演示数据。
5. README 写清楚：
   - 本地开发启动
   - Docker 启动
   - 初始化数据
   - 默认账号密码
   - 常见问题
6. 不改业务逻辑。
7. 不改数据库字段。

验证方式：
- docker compose down -v
- docker compose up --build
- 执行 seed
- 登录默认账号
- 访问核心页面

建议 commit message：
chore: complete dockerized deployment workflow
```

---

## 第 16 步：质量收尾

```txt
只做工程质量收尾，不改业务逻辑。

目标：
1. 统一 ESLint。
2. 统一 Prettier。
3. 检查 TypeScript 类型。
4. 删除无用 import。
5. 删除无用 console.log。
6. 删除无用文件。
7. 保证 npm run build 通过。
8. 保证 docker compose up --build 通过。
9. 不改业务逻辑。
10. 不改接口返回结构。

验证方式：
- npm run lint
- npm run build
- docker compose up --build

建议 commit message：
chore: cleanup and stabilize fullstack project
```

---

## 第 17 步：补充全栈案例展示文档

```txt
补充全栈岗位展示用的项目文档。

目标：
1. 完善 README.md。
2. 新增 ARCHITECTURE.md。
3. 新增 PROJECT_STORY.md。

README.md 需要包含：
1. 项目背景
2. 技术栈
3. 本地启动
4. Docker 一键启动
5. 默认账号
6. 功能模块截图
7. 项目亮点
8. 重构前后对比
9. 目录结构
10. 常见问题

ARCHITECTURE.md 需要说明：
1. 前端 Feature + 类 MVVM 架构
2. 后端 Route / Controller / Biz / Imp / Model 架构
3. 登录鉴权流程
4. 请求流转流程
5. MongoDB 模型关系
6. Docker 部署结构
7. 为什么这样分层

PROJECT_STORY.md 需要用面试表达的方式说明：
1. 为什么重构
2. 原项目有什么问题
3. 如何渐进式迁移
4. 如何保证业务逻辑不变
5. 这个项目体现了哪些全栈能力
6. 遇到的问题和解决方案
7. 如果继续优化，下一步会做什么

建议 commit message：
docs: add fullstack case study documentation
```

---

# 九、面试表达关键词

后续 README 或简历可以围绕这些关键词写：

```txt
旧项目工程化重构
Next.js 全栈项目
React 最新稳定版
TypeScript 类型化改造
前端 Feature 分层
类 MVVM 页面组织
自定义 Hook 作为 ViewModel
统一请求封装
JWT 登录鉴权
后端 Controller / Biz / Imp 分层
MongoDB / Mongoose 数据建模
Docker Compose 一键部署
保留业务逻辑的渐进式迁移
接口返回结构统一
后台管理系统
Dashboard 可视化
权限菜单
```

---

# 十、简历描述参考

```txt
全栈工程化重构项目｜Next.js + React + TypeScript + MongoDB

基于个人毕业设计后台管理系统进行现代化重构，将原 React + Express + MongoDB 前后端分离项目升级为 Next.js 全栈项目。前端按 Feature + 类 MVVM 思路拆分 View、ViewModel、Service、Model，后端按 Route、Controller、Biz、Imp、Model 分层组织，保留原有业务逻辑、接口语义与数据库结构。项目支持 JWT 登录鉴权、统一请求封装、统一接口返回、MongoDB 数据持久化，并通过 Docker Compose 实现 Web 服务与 MongoDB 一键部署。
```

---

# 十一、最重要的一句提示词

```txt
这是全栈岗位展示用的旧项目工程化重构案例，不是业务重写。接口路径、请求参数、返回结构、页面效果、权限逻辑、数据库字段全部尽量保持不变。每次只做一个小点，改完必须能运行，再提交。
```
