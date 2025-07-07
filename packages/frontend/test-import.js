// 导入功能测试脚本

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建一个简单的测试文档
const testContent = `# 测试导入功能

这是一个用于测试文档导入功能的简单文档。

## 功能列表

1. **文本格式化**
   - 粗体文本
   - 斜体文本
   - \`代码文本\`

2. **列表**
   - 无序列表项1
   - 无序列表项2

3. **引用**
   > 这是一个引用块

## 语义块测试

:::info 信息块
这是一个信息块，用于测试导入功能。
:::

:::warning 警告块
这是一个警告块，用于测试导入功能。
:::

## 总结

导入功能应该能够：
- 正确读取文件内容
- 更新编辑器状态
- 在编辑器中显示内容
`;

// 保存测试文档
const testFilePath = path.join(__dirname, 'import-test.sds');
fs.writeFileSync(testFilePath, testContent, 'utf8');

console.log('✅ 导入测试文档已创建:', testFilePath);
console.log('📝 文档内容:');
console.log('='.repeat(50));
console.log(testContent);
console.log('='.repeat(50));

console.log('\n🧪 测试步骤:');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 访问: http://localhost:3000');
console.log('3. 点击左侧菜单的"导入文档"');
console.log('4. 选择文件:', testFilePath);
console.log('5. 验证文档内容是否正确显示在编辑器中');

console.log('\n🔧 修复内容:');
console.log('- 添加了useEffect监听initialContent变化');
console.log('- 添加了markdownToHtml转换函数');
console.log('- 编辑器现在会响应外部内容更新'); 