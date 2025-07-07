#!/bin/bash

# SDS项目初始化脚本
echo "🚀 开始初始化SDS项目..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node -v)
echo "当前Node.js版本: $node_version"

# 检查npm版本
echo "📋 检查npm版本..."
npm_version=$(npm -v)
echo "当前npm版本: $npm_version"

# 安装根目录依赖
echo "📦 安装根目录依赖..."
npm install

# 安装前端依赖
echo "📦 安装前端依赖..."
cd packages/frontend
npm install
cd ../..

# 安装后端依赖
echo "📦 安装后端依赖..."
cd packages/backend
npm install
cd ../..

# 安装共享包依赖
echo "📦 安装共享包依赖..."
cd packages/shared
npm install
cd ../..

# 构建共享包
echo "🔨 构建共享包..."
cd packages/shared
npm run build
cd ../..

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p packages/frontend/src/{components,pages,hooks,services,store,utils,types}
mkdir -p packages/backend/src/{controllers,services,models,middleware,utils,config,types}
mkdir -p docs/{api,user-guide,developer-guide}

# 创建环境配置文件
echo "⚙️ 创建环境配置文件..."
if [ ! -f .env.example ]; then
  cat > .env.example << EOF
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/sds_db

# Redis配置
REDIS_URL=redis://localhost:6379

# JWT配置
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# 文件存储配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=sds-files

# 搜索配置
ELASTICSEARCH_URL=http://localhost:9200

# 应用配置
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/app.log
EOF
fi

# 创建Git忽略文件
echo "📝 创建Git忽略文件..."
if [ ! -f .gitignore ]; then
  cat > .gitignore << EOF
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 构建输出
dist/
build/
*.tsbuildinfo

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
logs/
*.log

# 运行时数据
pids/
*.pid
*.seed
*.pid.lock

# 覆盖率目录
coverage/
*.lcov

# IDE
.vscode/
.idea/
*.swp
*.swo

# 操作系统
.DS_Store
Thumbs.db

# 临时文件
*.tmp
*.temp

# 数据库
*.db
*.sqlite

# 缓存
.cache/
.parcel-cache/

# 测试
.nyc_output/

# 文档生成
docs/build/
EOF
fi

# 创建README文件
echo "📖 创建README文件..."
if [ ! -f README.md ]; then
  cat > README.md << EOF
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
\`\`\`bash
npm run install:all
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

## 项目结构

\`\`\`
semantic-document-standard/
├── packages/
│   ├── frontend/          # 前端应用
│   ├── backend/           # 后端服务
│   └── shared/            # 共享类型和工具
├── docs/                  # 项目文档
├── scripts/               # 构建脚本
└── README.md
\`\`\`

## 开发指南

详细的开发指南请参考 [docs/developer-guide/](./docs/developer-guide/) 目录。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
EOF
fi

echo "✅ 项目初始化完成！"
echo ""
echo "📋 下一步操作："
echo "1. 复制 .env.example 为 .env 并配置环境变量"
echo "2. 启动数据库和Redis服务"
echo "3. 运行 'npm run dev' 启动开发服务器"
echo ""
echo "🎉 开始你的SDS开发之旅吧！" 