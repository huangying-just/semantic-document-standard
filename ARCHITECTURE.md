# SDS系统技术架构设计

## 1. 系统整体架构

### 1.1 架构概览
```
┌─────────────────────────────────────────────────────────────────┐
│                          前端应用层                              │
├─────────────────────────────────────────────────────────────────┤
│  Web编辑器  │  文档查看器  │  管理界面  │  移动端适配  │  PWA    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API网关层                              │
├─────────────────────────────────────────────────────────────────┤
│  负载均衡  │  认证授权  │  限流控制  │  日志记录  │  监控告警  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         业务服务层                              │
├─────────────────────────────────────────────────────────────────┤
│ 文档服务 │ 解析服务 │ 渲染服务 │ 用户服务 │ 权限服务 │ 搜索服务 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         数据存储层                              │
├─────────────────────────────────────────────────────────────────┤
│ PostgreSQL │  Redis  │  MinIO  │  Git仓库  │  Elasticsearch │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心组件

#### 1.2.1 前端组件
- **SDS编辑器**：基于Tiptap的可视化编辑器
- **文档查看器**：支持多种格式的文档展示
- **管理界面**：文档管理、用户管理、系统配置
- **移动端适配**：响应式设计，支持移动设备

#### 1.2.2 后端服务
- **文档服务**：文档CRUD、版本控制、元数据管理
- **解析服务**：SDS语法解析、AST生成、错误处理
- **渲染服务**：HTML/PDF/Word渲染、模板管理
- **用户服务**：用户认证、角色管理、权限控制
- **搜索服务**：全文搜索、语义搜索、搜索建议

#### 1.2.3 数据存储
- **PostgreSQL**：用户数据、文档元数据、系统配置
- **Redis**：缓存、会话管理、实时数据
- **MinIO**：文件存储、图片、附件
- **Git仓库**：文档版本控制、协作历史
- **Elasticsearch**：全文搜索、文档索引

## 2. 详细架构设计

### 2.1 前端架构

#### 2.1.1 技术栈
```
React 18 + TypeScript
├── 状态管理: Redux Toolkit + RTK Query
├── UI组件: Ant Design + Styled Components
├── 编辑器: Tiptap + ProseMirror
├── 路由: React Router v6
├── 构建: Vite + Rollup
└── 测试: Jest + React Testing Library
```

#### 2.1.2 组件架构
```
src/
├── components/           # 通用组件
│   ├── common/          # 基础组件
│   ├── editor/          # 编辑器组件
│   ├── viewer/          # 查看器组件
│   └── admin/           # 管理组件
├── pages/               # 页面组件
├── hooks/               # 自定义Hooks
├── services/            # API服务
├── store/               # 状态管理
├── utils/               # 工具函数
└── types/               # TypeScript类型定义
```

#### 2.1.3 编辑器架构
```
Editor/
├── Core/                # 编辑器核心
│   ├── TiptapInstance   # Tiptap实例
│   ├── Schema           # 文档结构定义
│   └── Commands         # 编辑器命令
├── Extensions/          # 编辑器扩展
│   ├── SemanticBlocks   # 语义块扩展
│   ├── Forms            # 表单扩展
│   ├── References       # 引用扩展
│   └── Validation       # 验证扩展
├── UI/                  # 编辑器UI
│   ├── Toolbar          # 工具栏
│   ├── Sidebar          # 侧边栏
│   └── StatusBar        # 状态栏
└── Utils/               # 编辑器工具
    ├── Parser           # 解析器
    ├── Serializer       # 序列化器
    └── Validator        # 验证器
```

### 2.2 后端架构

#### 2.2.1 技术栈
```
Node.js 18 + TypeScript
├── 框架: Express.js + Fastify
├── 数据库: PostgreSQL + TypeORM
├── 缓存: Redis + ioredis
├── 文件存储: MinIO + AWS SDK
├── 搜索: Elasticsearch + @elastic/elasticsearch
├── 认证: JWT + Passport.js
└── 测试: Jest + Supertest
```

#### 2.2.2 服务架构
```
src/
├── controllers/         # 控制器层
├── services/            # 业务逻辑层
├── models/              # 数据模型层
├── middleware/          # 中间件
├── utils/               # 工具函数
├── config/              # 配置文件
└── types/               # TypeScript类型定义
```

#### 2.2.3 解析器架构
```
Parser/
├── Core/                # 解析器核心
│   ├── Lexer            # 词法分析器
│   ├── Parser           # 语法分析器
│   └── AST              # 抽象语法树
├── Extensions/          # 扩展解析器
│   ├── Markdown         # Markdown解析
│   ├── YAML             # YAML解析
│   ├── SemanticBlocks   # 语义块解析
│   └── References       # 引用解析
├── Output/              # 输出格式
│   ├── JSON             # JSON输出
│   ├── AST              # AST输出
│   └── HTML             # HTML输出
└── Validation/          # 验证器
    ├── Schema           # 模式验证
    ├── Syntax           # 语法验证
    └── Semantics        # 语义验证
```

### 2.3 数据架构

#### 2.3.1 数据库设计
```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文档表
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文档版本表
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    commit_hash VARCHAR(40) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#1890ff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文档标签关联表
CREATE TABLE document_tags (
    document_id UUID REFERENCES documents(id),
    tag_id UUID REFERENCES tags(id),
    PRIMARY KEY (document_id, tag_id)
);

-- 权限表
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_id UUID REFERENCES documents(id),
    permission_type VARCHAR(20) NOT NULL, -- read, write, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.3.2 缓存策略
```typescript
// Redis缓存键设计
const CACHE_KEYS = {
  // 文档缓存
  DOCUMENT: (id: string) => `doc:${id}`,
  DOCUMENT_CONTENT: (id: string) => `doc:content:${id}`,
  DOCUMENT_METADATA: (id: string) => `doc:metadata:${id}`,
  
  // 用户缓存
  USER: (id: string) => `user:${id}`,
  USER_SESSION: (sessionId: string) => `session:${sessionId}`,
  
  // 搜索缓存
  SEARCH_RESULT: (query: string) => `search:${hash(query)}`,
  
  // 渲染缓存
  RENDER_HTML: (id: string) => `render:html:${id}`,
  RENDER_PDF: (id: string) => `render:pdf:${id}`,
  RENDER_WORD: (id: string) => `render:word:${id}`,
};
```

## 3. 核心流程设计

### 3.1 文档编辑流程
```
1. 用户打开编辑器
   ↓
2. 加载文档内容
   ↓
3. 初始化Tiptap编辑器
   ↓
4. 用户进行编辑操作
   ↓
5. 实时保存到本地缓存
   ↓
6. 定期同步到服务器
   ↓
7. 生成版本记录
```

### 3.2 文档解析流程
```
1. 接收SDS文档内容
   ↓
2. 词法分析（Lexer）
   ↓
3. 语法分析（Parser）
   ↓
4. 构建AST
   ↓
5. 语义验证
   ↓
6. 生成结构化数据
   ↓
7. 返回解析结果
```

### 3.3 文档渲染流程
```
1. 获取文档AST
   ↓
2. 选择渲染模板
   ↓
3. 应用样式主题
   ↓
4. 处理引用链接
   ↓
5. 生成目标格式
   ↓
6. 缓存渲染结果
   ↓
7. 返回渲染内容
```

## 4. 安全设计

### 4.1 认证授权
```typescript
// JWT认证中间件
const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};

// 权限检查中间件
const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user, params } = req;
    const documentId = params.id;
    
    const hasPermission = await permissionService.checkPermission(
      user.id, 
      documentId, 
      permission
    );
    
    if (!hasPermission) {
      return res.status(403).json({ message: '权限不足' });
    }
    
    next();
  };
};
```

### 4.2 数据安全
- **传输加密**：使用HTTPS/TLS加密所有数据传输
- **存储加密**：敏感数据使用AES-256加密存储
- **访问控制**：基于角色的访问控制（RBAC）
- **审计日志**：记录所有重要操作和访问记录

## 5. 性能优化

### 5.1 前端优化
- **代码分割**：使用动态导入实现按需加载
- **缓存策略**：合理使用浏览器缓存和Service Worker
- **虚拟滚动**：大列表使用虚拟滚动优化性能
- **懒加载**：图片和组件懒加载

### 5.2 后端优化
- **数据库优化**：索引优化、查询优化、连接池
- **缓存策略**：Redis缓存热点数据
- **异步处理**：使用消息队列处理耗时操作
- **负载均衡**：多实例部署，负载均衡

### 5.3 渲染优化
- **预渲染**：静态内容预渲染
- **增量渲染**：只渲染变更的部分
- **缓存机制**：渲染结果缓存
- **并行处理**：多格式并行渲染

## 6. 监控和日志

### 6.1 监控指标
- **系统指标**：CPU、内存、磁盘、网络
- **应用指标**：响应时间、错误率、吞吐量
- **业务指标**：用户活跃度、文档创建量、搜索量
- **用户体验指标**：页面加载时间、编辑器响应时间

### 6.2 日志系统
```typescript
// 日志配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// 审计日志
const auditLog = (action: string, userId: string, details: any) => {
  logger.info('AUDIT', {
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
};
```

## 7. 部署架构

### 7.1 容器化部署
```dockerfile
# 前端Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 后端Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 7.2 Kubernetes部署
```yaml
# 前端部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sds-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sds-frontend
  template:
    metadata:
      labels:
        app: sds-frontend
    spec:
      containers:
      - name: frontend
        image: sds-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

# 后端部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sds-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sds-backend
  template:
    metadata:
      labels:
        app: sds-backend
    spec:
      containers:
      - name: backend
        image: sds-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: sds-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

## 8. 扩展性设计

### 8.1 水平扩展
- **无状态设计**：服务无状态，支持水平扩展
- **负载均衡**：使用Nginx或Kubernetes进行负载均衡
- **数据库分片**：支持数据库水平分片
- **缓存集群**：Redis集群支持

### 8.2 功能扩展
- **插件系统**：支持自定义解析器和渲染器
- **API扩展**：RESTful API支持功能扩展
- **主题系统**：支持自定义主题和样式
- **集成接口**：标准化的第三方集成接口

### 8.3 数据扩展
- **多租户支持**：支持多租户数据隔离
- **数据迁移**：支持数据格式升级和迁移
- **备份恢复**：完善的数据备份和恢复机制
- **数据导出**：支持多种格式的数据导出 