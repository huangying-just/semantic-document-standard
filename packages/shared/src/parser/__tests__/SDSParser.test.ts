// SDS解析器测试

import { SDSParser, HTMLRenderer, MarkdownRenderer, DebugPlugin } from '../index';

describe('SDSParser', () => {
  let parser: SDSParser;

  beforeEach(() => {
    parser = new SDSParser({
      debug: true,
      plugins: [new DebugPlugin()]
    });
    
    // 注册默认渲染器
    parser.registerRenderer('html', new HTMLRenderer());
    parser.registerRenderer('markdown', new MarkdownRenderer());
  });

  describe('基础解析功能', () => {
    test('应该解析简单的SDS文档', () => {
      const sdsText = `---
document_id: test-001
title: 测试文档
version: 1.0
status: draft
author_dept: IT
---

# 标题 {#main-title}

这是一个段落。

::: [info] {title="重要提示"}
这是一个信息块。
:::

::: [form] {id="test-form", title="测试表单"}
::: [field] {id="name", type="text", label="姓名", required="true"}
::: [field] {id="email", type="email", label="邮箱", required="true"}
:::

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |

- 列表项1
- 列表项2
- 列表项3

\`\`\`javascript
console.log('Hello World');
\`\`\``;

      const result = parser.parse(sdsText);

      expect(result.errors).toHaveLength(0);
      expect(result.ast.metadata.documentId).toBe('test-001');
      expect(result.ast.metadata.title).toBe('测试文档');
      expect(result.ast.content).toHaveLength(7); // 标题、段落、信息块、表单、表格、列表、代码块
    });

    test('应该解析YAML Front Matter', () => {
      const sdsText = `---
document_id: doc-001
title: 测试文档
version: 2.0
status: active
author_dept: HR
description: 这是一个测试文档
keywords: 测试,文档,SDS
category: 指南
effective_date: 2024-01-01
reviewers: 张三,李四
---

# 内容`;

      const result = parser.parse(sdsText);

      expect(result.ast.metadata).toEqual({
        documentId: 'doc-001',
        title: '测试文档',
        version: '2.0',
        status: 'active',
        department: 'HR',
        description: '这是一个测试文档',
        keywords: ['测试', '文档', 'SDS'],
        category: '指南',
        effectiveDate: new Date('2024-01-01'),
        reviewers: ['张三', '李四']
      });
    });

    test('应该解析标题和ID', () => {
      const sdsText = `# 一级标题 {#h1}
## 二级标题 {#h2}
### 三级标题 {#h3}`;

      const result = parser.parse(sdsText);

      expect(result.ast.content).toHaveLength(3);
      expect(result.ast.content[0]).toEqual({
        type: 'heading',
        id: 'h1',
        level: 1,
        content: '一级标题'
      });
    });
  });

  describe('语义块解析', () => {
    test('应该解析不同类型的语义块', () => {
      const sdsText = `::: [info] {title="信息"}
这是信息块。
:::

::: [warning] {title="警告"}
这是警告块。
:::

::: [danger] {title="危险"}
这是危险块。
:::

::: [tip] {title="提示"}
这是提示块。
:::

::: [note] {title="注意"}
这是注意块。
:::`;

      const result = parser.parse(sdsText);

      expect(result.ast.content).toHaveLength(5);
      expect(result.ast.content[0].type).toBe('semantic_block');
      expect(result.ast.content[0].blockType).toBe('info');
      expect(result.ast.content[1].blockType).toBe('warning');
    });

    test('应该解析带属性的语义块', () => {
      const sdsText = `::: [info] {title="自定义标题", icon="info-circle"}
这是带自定义属性的信息块。
:::`;

      const result = parser.parse(sdsText);

      const block = result.ast.content[0] as any;
      expect(block.type).toBe('semantic_block');
      expect(block.attributes.title).toBe('自定义标题');
      expect(block.attributes.icon).toBe('info-circle');
    });
  });

  describe('数据块解析', () => {
    test('应该解析YAML数据块', () => {
      const sdsText = `::: [data] {type="yaml"}
name: 张三
age: 30
department: IT
skills:
  - JavaScript
  - TypeScript
  - React
:::`;

      const result = parser.parse(sdsText);

      const dataBlock = result.ast.content[0] as any;
      expect(dataBlock.type).toBe('data_block');
      expect(dataBlock.dataType).toBe('yaml');
      expect(dataBlock.content).toContain('name: 张三');
    });

    test('应该解析JSON数据块', () => {
      const sdsText = `::: [data] {type="json"}
{
  "name": "李四",
  "age": 25,
  "department": "HR"
}
:::`;

      const result = parser.parse(sdsText);

      const dataBlock = result.ast.content[0] as any;
      expect(dataBlock.type).toBe('data_block');
      expect(dataBlock.dataType).toBe('json');
      expect(dataBlock.content).toContain('"name": "李四"');
    });
  });

  describe('表单解析', () => {
    test('应该解析表单定义', () => {
      const sdsText = `::: [form] {id="user-form", title="用户信息表单"}
::: [field] {id="name", type="text", label="姓名", required="true", placeholder="请输入姓名"}
::: [field] {id="email", type="email", label="邮箱", required="true", placeholder="请输入邮箱"}
::: [field] {id="age", type="number", label="年龄", required="false"}
::: [field] {id="department", type="select", label="部门", required="true"}
::: [field] {id="agree", type="checkbox", label="同意条款", required="true"}
:::`;

      const result = parser.parse(sdsText);

      const form = result.ast.content[0] as any;
      expect(form.type).toBe('form');
      expect(form.formId).toBe('user-form');
      expect(form.title).toBe('用户信息表单');
      expect(form.fields).toHaveLength(5);
      expect(form.fields[0].id).toBe('name');
      expect(form.fields[0].type).toBe('text');
      expect(form.fields[0].required).toBe(true);
    });
  });

  describe('表格解析', () => {
    test('应该解析Markdown表格', () => {
      const sdsText = `| 姓名 | 年龄 | 部门 |
|------|------|------|
| 张三 | 30   | IT   |
| 李四 | 25   | HR   |
| 王五 | 35   | 财务 |`;

      const result = parser.parse(sdsText);

      const table = result.ast.content[0] as any;
      expect(table.type).toBe('table');
      expect(table.headers).toEqual(['姓名', '年龄', '部门']);
      expect(table.rows).toHaveLength(3);
      expect(table.rows[0]).toEqual(['张三', '30', 'IT']);
    });
  });

  describe('列表解析', () => {
    test('应该解析无序列表', () => {
      const sdsText = `- 项目1
- 项目2
- 项目3`;

      const result = parser.parse(sdsText);

      const list = result.ast.content[0] as any;
      expect(list.type).toBe('list');
      expect(list.listType).toBe('unordered');
      expect(list.items).toHaveLength(3);
    });

    test('应该解析有序列表', () => {
      const sdsText = `1. 第一步
2. 第二步
3. 第三步`;

      const result = parser.parse(sdsText);

      const list = result.ast.content[0] as any;
      expect(list.type).toBe('list');
      expect(list.listType).toBe('ordered');
      expect(list.items).toHaveLength(3);
    });
  });

  describe('代码块解析', () => {
    test('应该解析代码块', () => {
      const sdsText = `\`\`\`javascript
function hello() {
  console.log('Hello World');
}
\`\`\``;

      const result = parser.parse(sdsText);

      const codeBlock = result.ast.content[0] as any;
      expect(codeBlock.type).toBe('code_block');
      expect(codeBlock.language).toBe('javascript');
      expect(codeBlock.content).toContain('function hello()');
    });
  });

  describe('引用解析', () => {
    test('应该解析ID引用', () => {
      const sdsText = `# 标题 {#main-title}

请参考 {#main-title} 获取更多信息。`;

      const result = parser.parse(sdsText);

      expect(result.ast.content).toHaveLength(2);
      expect(result.ast.content[1].type).toBe('reference');
    });

    test('应该解析内容引用', () => {
      const sdsText = `请查看 ![[doc-001#section-1]] 获取详细信息。`;

      const result = parser.parse(sdsText);

      const reference = result.ast.content[0] as any;
      expect(reference.type).toBe('reference');
      expect(reference.target).toBe('doc-001#section-1');
    });
  });

  describe('渲染功能', () => {
    test('应该渲染为HTML', () => {
      const sdsText = `# 标题

这是一个段落。

::: [info] {title="提示"}
这是信息块。
:::`;

      const result = parser.parse(sdsText, { outputFormat: 'html' });

      expect(result.ast.type).toBe('html');
      expect(result.ast.content).toContain('<h1>标题</h1>');
      expect(result.ast.content).toContain('<p>这是一个段落。</p>');
      expect(result.ast.content).toContain('class="semantic-block info"');
    });

    test('应该渲染为Markdown', () => {
      const sdsText = `# 标题

这是一个段落。

::: [info] {title="提示"}
这是信息块。
:::`;

      const result = parser.parse(sdsText, { outputFormat: 'markdown' });

      expect(result.ast.type).toBe('markdown');
      expect(result.ast.content).toContain('# 标题');
      expect(result.ast.content).toContain('这是一个段落。');
      expect(result.ast.content).toContain('::: [info]');
    });
  });

  describe('错误处理', () => {
    test('应该报告解析错误', () => {
      const sdsText = `::: [invalid-block]
未闭合的语义块

# 标题`;

      const result = parser.parse(sdsText);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('应该验证必需字段', () => {
      const sdsText = `---
title: 测试文档
---

# 内容`;

      const result = parser.parse(sdsText);

      const validation = parser.validate(sdsText);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.code === 'MISSING_DOCUMENT_ID')).toBe(true);
    });
  });

  describe('统计信息', () => {
    test('应该收集解析统计信息', () => {
      const sdsText = `# 标题

::: [info]
信息块
:::

| 列1 | 列2 |
|-----|-----|
| 数据1 | 数据2 |

- 列表项1
- 列表项2

\`\`\`javascript
console.log('test');
\`\`\``;

      parser.parse(sdsText);
      const stats = parser.getStats();

      expect(stats.totalNodes).toBeGreaterThan(0);
      expect(stats.semanticBlocks).toBe(1);
      expect(stats.tables).toBe(1);
      expect(stats.codeBlocks).toBe(1);
      expect(stats.parseTime).toBeGreaterThan(0);
    });
  });
}); 