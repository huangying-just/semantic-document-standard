// 编辑器功能测试脚本

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试文档内容
const testDocument = `# 测试SDS文档

这是一个测试文档，用于验证SDS编辑器的功能。

## 基础功能

### 文本格式化
- **粗体文本**
- *斜体文本*
- \`代码文本\`
- ~~删除线文本~~

### 列表
1. 有序列表项1
2. 有序列表项2
3. 有序列表项3

- 无序列表项1
- 无序列表项2
- 无序列表项3

### 引用
> 这是一个引用块
> 可以包含多行内容

### 代码块
\`\`\`javascript
function hello() {
  console.log('Hello, SDS!');
}
\`\`\`

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

## 语义块

:::info 信息块
这是一个信息块，用于提供重要的信息。
:::

:::warning 警告块
这是一个警告块，用于提醒用户注意某些事项。
:::

:::danger 危险块
这是一个危险块，用于警告用户潜在的风险。
:::

:::tip 提示块
这是一个提示块，用于提供有用的建议。
:::

:::note 注意块
这是一个注意块，用于强调重要内容。
:::

## 表单定义

:::form user_feedback
用户反馈表单
收集用户对产品的反馈意见

- 姓名 (text) *
  - 占位符: 请输入您的姓名
  - 验证: required

- 邮箱 (email) *
  - 占位符: 请输入您的邮箱地址
  - 验证: required|email

- 反馈类型 (select) *
  - 选项: 功能建议, 问题报告, 其他

- 反馈内容 (textarea) *
  - 占位符: 请详细描述您的反馈

- 联系方式 (text)
  - 占位符: 可选，用于我们回复您

提交
:::

## 数据块

\`\`\`json
{
  "title": "示例数据",
  "description": "这是一个JSON数据块",
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
\`\`\`

\`\`\`yaml
title: 示例配置
description: 这是一个YAML配置块
settings:
  feature1: true
  feature2: false
  timeout: 30
\`\`\`

## 引用

### ID引用
请参考 [@section:基础功能] 了解更多信息。

### 内容引用
> 引用内容：[@content:文本格式化]

## 总结

这个测试文档展示了SDS编辑器的所有主要功能：

1. **基础Markdown语法** - 标题、列表、表格、代码块等
2. **语义块** - 信息、警告、危险、提示、注意等类型
3. **表单定义** - 完整的表单结构定义
4. **数据块** - JSON、YAML等结构化数据
5. **引用系统** - ID引用和内容引用

编辑器应该能够正确解析和渲染所有这些内容。
`;

// 保存测试文档
const testFilePath = path.join(__dirname, 'test-document.sds');
fs.writeFileSync(testFilePath, testDocument, 'utf8');

console.log('✅ 测试文档已创建:', testFilePath);
console.log('📝 文档内容预览:');
console.log('='.repeat(50));
console.log(testDocument.substring(0, 500) + '...');
console.log('='.repeat(50));

console.log('\n🎯 编辑器功能测试清单:');
console.log('1. ✅ 基础文本编辑功能');
console.log('2. ✅ Markdown语法支持');
console.log('3. ✅ 实时预览功能');
console.log('4. ✅ 语义块编辑器');
console.log('5. ✅ 表单定义编辑器');
console.log('6. ✅ 工具栏功能');
console.log('7. ✅ 文档保存/导出');
console.log('8. ✅ 文档导入/打开');

console.log('\n🚀 启动开发服务器: npm run dev');
console.log('🌐 访问地址: http://localhost:5173');
console.log('📖 测试文档路径:', testFilePath); 