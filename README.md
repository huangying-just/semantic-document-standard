# 语义化文档标准(SDS)系统

## 项目简介

SDS是一个下一代人机协同知识库系统，通过语义化文档标准实现文档内容与表现的分离，为AI和人类提供更好的知识管理体验。

## 技术栈

### 前端
- React 18 + TypeScript
- Tiptap编辑器
- Ant Design UI组件
- Redux Toolkit状态管理

### 后端
- Node.js + Express
- PostgreSQL数据库
- Redis缓存
- Elasticsearch搜索

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 13
- Redis >= 6
- Elasticsearch >= 7

### 安装依赖
```bash
npm run install:all
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
semantic-document-standard/
├── packages/
│   ├── frontend/          # 前端应用
│   ├── backend/           # 后端服务
│   └── shared/            # 共享类型和工具
├── docs/                  # 项目文档
├── scripts/               # 构建脚本
└── README.md
```

## 开发指南

详细的开发指南请参考 [docs/developer-guide/](./docs/developer-guide/) 目录。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
