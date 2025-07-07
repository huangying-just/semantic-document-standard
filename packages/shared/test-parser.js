// SDS解析器测试脚本

const fs = require('fs');
const path = require('path');

// 导入解析器
const { SDSParser, HTMLRenderer, MarkdownRenderer, DebugPlugin } = require('./dist/index');

async function testParser() {
  console.log('🚀 开始测试SDS解析器...\n');

  // 创建解析器实例
  const parser = new SDSParser({
    debug: true,
    plugins: [new DebugPlugin()]
  });

  // 注册渲染器
  parser.registerRenderer('html', new HTMLRenderer());
  parser.registerRenderer('markdown', new MarkdownRenderer());

  try {
    // 读取示例文档
    const samplePath = path.join(__dirname, '../../examples/sample-document.sds');
    const sdsText = fs.readFileSync(samplePath, 'utf8');

    console.log('📄 解析示例文档...');
    
    // 解析为AST
    const astResult = parser.parse(sdsText, { outputFormat: 'ast' });
    
    console.log('✅ AST解析完成');
    console.log(`📊 解析统计:`);
    console.log(`   - 总行数: ${astResult.originalText.split('\n').length}`);
    console.log(`   - 总节点数: ${astResult.ast.content.length}`);
    console.log(`   - 解析时间: ${astResult.parseTime}ms`);
    console.log(`   - 错误数: ${astResult.errors.length}`);
    console.log(`   - 警告数: ${astResult.warnings.length}`);

    // 显示元数据
    console.log('\n📋 文档元数据:');
    console.log(`   - 文档ID: ${astResult.ast.metadata.documentId}`);
    console.log(`   - 标题: ${astResult.ast.metadata.title}`);
    console.log(`   - 版本: ${astResult.ast.metadata.version}`);
    console.log(`   - 状态: ${astResult.ast.metadata.status}`);
    console.log(`   - 部门: ${astResult.ast.metadata.department}`);

    // 统计节点类型
    const nodeTypes = {};
    astResult.ast.content.forEach(node => {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    });

    console.log('\n📈 节点类型统计:');
    Object.entries(nodeTypes).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });

    // 解析为HTML
    console.log('\n🌐 生成HTML...');
    const htmlResult = parser.parse(sdsText, { outputFormat: 'html' });
    
    // 保存HTML文件
    const htmlPath = path.join(__dirname, '../../examples/sample-document.html');
    fs.writeFileSync(htmlPath, htmlResult.ast.content);
    console.log(`✅ HTML已保存到: ${htmlPath}`);

    // 解析为Markdown
    console.log('\n📝 生成Markdown...');
    const markdownResult = parser.parse(sdsText, { outputFormat: 'markdown' });
    
    // 保存Markdown文件
    const mdPath = path.join(__dirname, '../../examples/sample-document.md');
    fs.writeFileSync(mdPath, markdownResult.ast.content);
    console.log(`✅ Markdown已保存到: ${mdPath}`);

    // 验证文档
    console.log('\n🔍 验证文档...');
    const validation = parser.validate(sdsText);
    console.log(`✅ 文档验证: ${validation.isValid ? '通过' : '失败'}`);
    
    if (validation.errors.length > 0) {
      console.log('❌ 验证错误:');
      validation.errors.forEach(error => {
        console.log(`   - 第${error.line}行: ${error.message}`);
      });
    }

    if (validation.warnings.length > 0) {
      console.log('⚠️  验证警告:');
      validation.warnings.forEach(warning => {
        console.log(`   - 第${warning.line}行: ${warning.message}`);
      });
    }

    // 显示统计信息
    console.log('\n📊 解析器统计信息:');
    const stats = parser.getStats();
    console.log(`   - 总节点数: ${stats.totalNodes}`);
    console.log(`   - 语义块数: ${stats.semanticBlocks}`);
    console.log(`   - 数据块数: ${stats.dataBlocks}`);
    console.log(`   - 表单数: ${stats.forms}`);
    console.log(`   - 引用数: ${stats.references}`);
    console.log(`   - 表格数: ${stats.tables}`);
    console.log(`   - 代码块数: ${stats.codeBlocks}`);
    console.log(`   - 内存使用: ${(stats.memoryUsage / 1024).toFixed(2)}KB`);

    console.log('\n🎉 SDS解析器测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testParser(); 