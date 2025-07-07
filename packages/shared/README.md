# SDS解析器 (Semantic Document Standard Parser)

SDS解析器是一个强大的语义化文档解析工具，支持将SDS格式的文档解析为AST、HTML、Markdown等多种格式。

## 功能特性

- ✅ **完整的SDS语法支持**
  - YAML Front Matter解析
  - 语义块语法 (::: [type])
  - 结构化数据块
  - 表单定义
  - ID引用和内容引用

- ✅ **多种输出格式**
  - AST (抽象语法树)
  - JSON
  - HTML (带样式)
  - Markdown

- ✅ **插件系统**
  - 可扩展的插件架构
  - 调试插件
  - 统计插件
  - 自定义插件支持

- ✅ **渲染器系统**
  - HTML渲染器
  - Markdown渲染器
  - 自定义渲染器支持

- ✅ **错误处理和验证**
  - 详细的错误报告
  - 文档验证
  - 性能统计

## 快速开始

### 安装

```bash
npm install @sds/shared
```

### 基础使用

```typescript
import { SDSParser, HTMLRenderer, MarkdownRenderer } from '@sds/shared';

// 创建解析器实例
const parser = new SDSParser({
  debug: true,
  strict: false
});

// 注册渲染器
parser.registerRenderer('html', new HTMLRenderer());
parser.registerRenderer('markdown', new MarkdownRenderer());

// 解析SDS文档
const sdsText = `---
document_id: test-001
title: 测试文档
version: 1.0
---

# 标题 {#main-title}

这是一个段落。

::: [info] {title="提示"}
这是一个信息块。
:::`;

// 解析为AST
const astResult = parser.parse(sdsText, { outputFormat: 'ast' });
console.log('AST:', astResult.ast);

// 解析为HTML
const htmlResult = parser.parse(sdsText, { outputFormat: 'html' });
console.log('HTML:', htmlResult.ast.content);

// 解析为Markdown
const mdResult = parser.parse(sdsText, { outputFormat: 'markdown' });
console.log('Markdown:', mdResult.ast.content);
```

## SDS语法规范

### YAML Front Matter

文档开头的元数据块：

```yaml
---
document_id: doc-001
title: 文档标题
version: 1.0
status: active
author_dept: IT
description: 文档描述
keywords: 关键词1,关键词2
category: 分类
effective_date: 2024-01-01
reviewers: 审核者1,审核者2
---
```

### 语义块

```markdown
::: [info] {title="信息标题"}
这是信息块的内容。
:::

::: [warning] {title="警告标题"}
这是警告块的内容。
:::

::: [danger] {title="危险标题"}
这是危险块的内容。
:::

::: [tip] {title="提示标题"}
这是提示块的内容。
:::

::: [note] {title="注意标题"}
这是注意块的内容。
:::
```

### 数据块

```markdown
::: [data] {type="yaml"}
name: 张三
age: 30
department: IT
skills:
  - JavaScript
  - TypeScript
  - React
:::

::: [data] {type="json"}
{
  "name": "李四",
  "age": 25,
  "department": "HR"
}
:::
```

### 表单定义

```markdown
::: [form] {id="user-form", title="用户信息表单"}
::: [field] {id="name", type="text", label="姓名", required="true", placeholder="请输入姓名"}
::: [field] {id="email", type="email", label="邮箱", required="true", placeholder="请输入邮箱"}
::: [field] {id="age", type="number", label="年龄", required="false"}
::: [field] {id="department", type="select", label="部门", required="true"}
::: [field] {id="agree", type="checkbox", label="同意条款", required="true"}
:::
```

### 引用

```markdown
# 标题 {#section-id}

请参考 {#section-id} 获取更多信息。

请查看 ![[doc-001#section-1]] 获取详细信息。
```

## API参考

### SDSParser

主要的解析器类。

#### 构造函数

```typescript
new SDSParser(config?: ParserConfig)
```

#### 配置选项

```typescript
interface ParserConfig {
  strict?: boolean;           // 严格模式
  preserveOriginal?: boolean; // 保留原始文本
  debug?: boolean;           // 调试模式
  customSemanticBlocks?: string[]; // 自定义语义块类型
  customDataBlocks?: string[];     // 自定义数据块类型
  plugins?: ParserPlugin[];        // 插件列表
}
```

#### 主要方法

```typescript
// 解析文档
parse(text: string, options?: ParserOptions): ParseResult

// 验证文档
validate(text: string): { isValid: boolean; errors: any[]; warnings: any[] }

// 注册插件
registerPlugin(plugin: ParserPlugin): void

// 注册渲染器
registerRenderer(name: string, renderer: Renderer): void

// 获取统计信息
getStats(): ParserStats

// 重置统计信息
resetStats(): void
```

### 插件系统

#### 创建自定义插件

```typescript
import { BasePlugin } from '@sds/shared';

class MyCustomPlugin extends BasePlugin {
  constructor() {
    super('my-custom-plugin', '1.0.0');
  }

  preprocess(text: string): string {
    // 预处理文本
    return text.replace(/custom-pattern/g, 'replacement');
  }

  postprocess(ast: any): any {
    // 后处理AST
    return ast;
  }

  parseNode(line: string, context: any): any {
    // 自定义节点解析
    return null;
  }
}

// 使用插件
const parser = new SDSParser({
  plugins: [new MyCustomPlugin()]
});
```

### 渲染器系统

#### 创建自定义渲染器

```typescript
import { BaseRenderer } from '@sds/shared';

class MyCustomRenderer extends BaseRenderer {
  render(ast: any, options?: any): string {
    // 自定义渲染逻辑
    return this.renderNodes(ast.content);
  }

  protected renderNode(node: any): string {
    switch (node.type) {
      case 'heading':
        return `<h${node.level}>${node.content}</h${node.level}>`;
      case 'paragraph':
        return `<p>${node.content}</p>`;
      default:
        return '';
    }
  }
}

// 注册渲染器
parser.registerRenderer('custom', new MyCustomRenderer());
```

## 示例

### 完整示例

```typescript
import { SDSParser, HTMLRenderer, MarkdownRenderer, DebugPlugin } from '@sds/shared';

async function processDocument() {
  // 创建解析器
  const parser = new SDSParser({
    debug: true,
    plugins: [new DebugPlugin()]
  });

  // 注册渲染器
  parser.registerRenderer('html', new HTMLRenderer());
  parser.registerRenderer('markdown', new MarkdownRenderer());

  // SDS文档内容
  const sdsText = `---
document_id: example-001
title: 示例文档
version: 1.0
---

# 示例标题 {#example}

这是一个示例段落。

::: [info] {title="重要信息"}
这是一个信息块。
:::

| 列1 | 列2 |
|-----|-----|
| 数据1 | 数据2 |

- 列表项1
- 列表项2

\`\`\`javascript
console.log('Hello World');
\`\`\``;

  try {
    // 解析为不同格式
    const astResult = parser.parse(sdsText, { outputFormat: 'ast' });
    const htmlResult = parser.parse(sdsText, { outputFormat: 'html' });
    const mdResult = parser.parse(sdsText, { outputFormat: 'markdown' });

    // 验证文档
    const validation = parser.validate(sdsText);

    // 获取统计信息
    const stats = parser.getStats();

    console.log('解析成功！');
    console.log('节点数量:', stats.totalNodes);
    console.log('解析时间:', stats.parseTime + 'ms');
    console.log('验证通过:', validation.isValid);

  } catch (error) {
    console.error('解析失败:', error.message);
  }
}

processDocument();
```

## 错误处理

解析器会提供详细的错误信息：

```typescript
const result = parser.parse(sdsText);

if (result.errors.length > 0) {
  console.log('解析错误:');
  result.errors.forEach(error => {
    console.log(`第${error.line}行: ${error.message} (${error.code})`);
  });
}

if (result.warnings.length > 0) {
  console.log('解析警告:');
  result.warnings.forEach(warning => {
    console.log(`第${warning.line}行: ${warning.message} (${warning.code})`);
  });
}
```

## 性能优化

- 使用流式解析处理大文件
- 启用缓存机制
- 使用Web Workers进行并行处理
- 优化正则表达式匹配

## 贡献

欢迎提交Issue和Pull Request来改进SDS解析器！

## 许可证

MIT License 