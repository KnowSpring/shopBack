# vue项目
## 项目功能

- 1 登录
- 2 首页
- 3 退出
- 4 用户管理
  - 4.1 列表展示
  - 4.2 分页
  - 4.3 查询
  - 4.4 启用/禁用用户
  - 4.5 添加用户
  - 4.6 编辑用户
  - 4.7 删除用户
- 5 权限管理
  - 5.1 权限列表
- 6 角色管理
  - 6.1 角色列表
  - 6.2 编辑角色
  - 6.3 删除角色
  - 6.4 表格项展开，展示角色权限
  - 6.5 分配权限

## 项目搭建
### 1 vue init webpack shop_admin

    Project name                            ：默认
    Project description                     ：默认
    Author                                  ：默认
    Vue build                               ：选择 Runtime + Compiler
    Install vue-router?                     ：Y
    Use ESLint to lint your code?           ：Y 选择 Standard
    Set up unit tests                       ：n
    Setup e2e tests with Nightwatch?        : n
    Should we run `npm install` for you after the project has been created? (recommended) : Yes, use NPM

- 2 进入项目：cd shop_admin
- 3 运行项目：npm run dev
- 将脚手架默认生成的内容去掉，然后，添加了一个 Login 组件

如何添加一个新的功能？？？

- 1 在 components 中新建一个文件夹（login），在文件中创建组件(Login.vue)
- 2 在 router/index.js 中导入组件（Login.vue）
- 3 配置路由规则

### 在项目中使用 element-ui
- ElementUI 文档
- 安装：npm i element-ui -S
