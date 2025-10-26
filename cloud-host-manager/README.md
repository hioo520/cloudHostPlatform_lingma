# 云主机管理平台

这是一个基于 React + Vite + TypeScript + Ant Design 的云主机管理平台前端项目。

## 功能模块

1. **仪表盘** - 展示云主机资源的整体态势
2. **云主机管理** - 对云主机信息进行增删改查操作
3. **云主机变更管理** - 查看和管理云主机变更记录
4. **低效云主机** - 展示和分析低效云主机信息
5. **公共池管理** - 管理可申请的公共池云主机
6. **多维度指标管理** - 从不同维度查看云主机指标

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design
- React Router

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 公共组件
├── pages/            # 页面组件
├── services/         # 服务层（API调用等）
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── hooks/            # 自定义 hooks
├── styles/           # 样式文件
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
```

## 开发规范

1. 使用 TypeScript 进行类型检查
2. 遵循 Ant Design 设计规范
3. 组件化开发，提高代码复用性
4. 使用 ESLint 和 Prettier 保证代码风格统一

## 数据模拟

项目使用 mock 数据来模拟后端接口，实际使用时可以替换为真实的 API 调用。