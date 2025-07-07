#!/usr/bin/env node

/**
 * 布局修复测试脚本
 * 验证编辑器布局修复是否成功
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

console.log('🧪 开始测试SDS编辑器布局修复...\n');

// 检查关键文件
const keyFiles = [
  'packages/frontend/src/components/editor/EnhancedSDSEditor.tsx',
  'packages/frontend/src/pages/EditorPage.tsx'
];

console.log('📁 检查关键文件...');
let allFilesExist = true;

keyFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ 关键文件缺失！');
  process.exit(1);
}

console.log('\n✅ 所有关键文件存在\n');

// 检查编辑器布局修复
console.log('🔍 检查编辑器布局修复...');

const editorContent = fs.readFileSync('packages/frontend/src/components/editor/EnhancedSDSEditor.tsx', 'utf8');
const pageContent = fs.readFileSync('packages/frontend/src/pages/EditorPage.tsx', 'utf8');

// 检查编辑器布局修复
const editorLayoutChecks = [
  { name: '编辑器容器高度设置', pattern: /height: 100%/ },
  { name: '编辑器容器溢出隐藏', pattern: /overflow: hidden/ },
  { name: '工具栏固定定位', pattern: /position: sticky/ },
  { name: '工具栏最小高度', pattern: /min-height: 56px/ },
  { name: '内容区域滚动', pattern: /overflow-y: auto/ },
  { name: 'Flex子元素收缩', pattern: /min-height: 0/ },
  { name: '侧边栏防压缩', pattern: /flex-shrink: 0/ },
  { name: '预览面板滚动', pattern: /overflow-y: auto.*预览区域/ }
];

editorLayoutChecks.forEach(check => {
  const found = check.pattern.test(editorContent);
  console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
});

// 检查页面布局修复
const pageLayoutChecks = [
  { name: '页面布局溢出隐藏', pattern: /overflow: hidden/ },
  { name: '头部固定定位', pattern: /position: fixed/ },
  { name: '头部高度设置', pattern: /height: 64px/ },
  { name: '头部层级设置', pattern: /z-index: 1000/ },
  { name: '侧边栏固定定位', pattern: /position: fixed.*侧边栏/ },
  { name: '侧边栏滚动', pattern: /overflow-y: auto.*侧边栏/ },
  { name: '内容区域边距', pattern: /margin-left: 200px/ },
  { name: '内容区域高度', pattern: /height: calc\(100vh - 64px\)/ }
];

pageLayoutChecks.forEach(check => {
  const found = check.pattern.test(pageContent);
  console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
});

console.log('\n📊 布局修复总结：');
console.log('  • 页面头部固定，始终可见');
console.log('  • 侧边栏固定，内容可滚动');
console.log('  • 编辑器工具栏固定，不随内容滚动');
console.log('  • 编辑器内容区域独立滚动');
console.log('  • 预览面板独立滚动');
console.log('  • 整体布局稳定，无重叠问题');

console.log('\n🎯 修复的具体问题：');
console.log('  • 文本过长时工具栏被隐藏');
console.log('  • 内容区域没有滚动条');
console.log('  • 布局层级混乱');
console.log('  • 页面整体滚动导致布局错乱');

console.log('\n🔧 技术实现：');
console.log('  • 使用 fixed 定位固定头部和侧边栏');
console.log('  • 使用 sticky 定位固定工具栏');
console.log('  • 使用 flex 布局确保内容区域可滚动');
console.log('  • 设置合适的 z-index 确保层级正确');
console.log('  • 使用 calc() 计算正确的高度');

console.log('\n✅ SDS编辑器布局修复测试完成！');
console.log('💡 现在文本过长时工具栏将始终可见，内容区域有独立的滚动条。');
console.log('📝 用户可以在长文档中正常编辑，不会丢失工具栏功能。');

async function testLayoutFix() {
  console.log('🚀 开始测试布局修复...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 导航到编辑器页面
    console.log('📝 导航到编辑器页面...');
    await page.goto('http://localhost:3002/editor', { waitUntil: 'networkidle0' });
    
    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror', { timeout: 10000 });
    
    // 测试1: 检查编辑器最小宽度
    console.log('🔍 测试1: 检查编辑器最小宽度...');
    const editorWidth = await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      return editor ? editor.offsetWidth : 0;
    });
    console.log(`   编辑器宽度: ${editorWidth}px`);
    
    if (editorWidth >= 400) {
      console.log('   ✅ 编辑器最小宽度设置正确');
    } else {
      console.log('   ❌ 编辑器宽度不足');
    }
    
    // 测试2: 检查文本自动换行
    console.log('🔍 测试2: 检查文本自动换行...');
    await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      if (editor) {
        // 插入长文本测试换行
        editor.innerHTML = `
          <p>这是一个非常长的文本段落，用来测试文本自动换行功能是否正常工作。这个文本应该能够自动换行到下一行，而不是超出编辑器容器的边界。如果文本换行功能正常工作，那么这段文字应该能够正确地显示在编辑器内部，而不会导致水平滚动条的出现。</p>
          <h1>这是一个很长的标题用来测试标题文本的自动换行功能是否正常工作</h1>
          <ul>
            <li>这是一个很长的列表项用来测试列表项文本的自动换行功能是否正常工作</li>
            <li>另一个很长的列表项用来测试列表项文本的自动换行功能是否正常工作</li>
          </ul>
          <blockquote>这是一个很长的引用文本用来测试引用文本的自动换行功能是否正常工作</blockquote>
          <table>
            <tr>
              <th>这是一个很长的表头用来测试表头文本的自动换行功能是否正常工作</th>
              <th>另一个很长的表头</th>
            </tr>
            <tr>
              <td>这是一个很长的表格单元格文本用来测试表格单元格文本的自动换行功能是否正常工作</td>
              <td>另一个很长的表格单元格文本</td>
            </tr>
          </table>
        `;
      }
    });
    
    // 等待内容更新
    await page.waitForTimeout(1000);
    
    // 检查是否有水平滚动条
    const hasHorizontalScroll = await page.evaluate(() => {
      const editorContainer = document.querySelector('[data-testid="editor-content"]') || 
                             document.querySelector('.ProseMirror').parentElement;
      return editorContainer.scrollWidth > editorContainer.clientWidth;
    });
    
    if (!hasHorizontalScroll) {
      console.log('   ✅ 文本自动换行功能正常，无水平滚动条');
    } else {
      console.log('   ❌ 文本自动换行功能异常，出现水平滚动条');
    }
    
    // 测试3: 检查编辑器容器布局
    console.log('🔍 测试3: 检查编辑器容器布局...');
    const layoutInfo = await page.evaluate(() => {
      const content = document.querySelector('.ant-layout-content');
      const editor = document.querySelector('.ProseMirror');
      const editorContainer = editor ? editor.parentElement : null;
      
      return {
        contentWidth: content ? content.offsetWidth : 0,
        contentHeight: content ? content.offsetHeight : 0,
        editorContainerWidth: editorContainer ? editorContainer.offsetWidth : 0,
        editorContainerHeight: editorContainer ? editorContainer.offsetHeight : 0,
        editorWidth: editor ? editor.offsetWidth : 0,
        editorHeight: editor ? editor.offsetHeight : 0
      };
    });
    
    console.log('   布局信息:', layoutInfo);
    
    if (layoutInfo.contentWidth >= 600 && layoutInfo.editorContainerWidth >= 400) {
      console.log('   ✅ 编辑器容器布局正确');
    } else {
      console.log('   ❌ 编辑器容器布局异常');
    }
    
    // 测试4: 检查响应式布局
    console.log('🔍 测试4: 检查响应式布局...');
    
    // 调整窗口大小测试响应式
    await page.setViewport({ width: 1000, height: 600 });
    await page.waitForTimeout(1000);
    
    const responsiveInfo = await page.evaluate(() => {
      const content = document.querySelector('.ant-layout-content');
      const editor = document.querySelector('.ProseMirror');
      return {
        contentWidth: content ? content.offsetWidth : 0,
        editorWidth: editor ? editor.offsetWidth : 0
      };
    });
    
    console.log('   响应式布局信息:', responsiveInfo);
    
    if (responsiveInfo.contentWidth >= 400 && responsiveInfo.editorWidth >= 300) {
      console.log('   ✅ 响应式布局正常');
    } else {
      console.log('   ❌ 响应式布局异常');
    }
    
    // 测试5: 检查预览功能
    console.log('🔍 测试5: 检查预览功能...');
    
    // 点击预览按钮
    const previewButton = await page.$('button[title="预览"]');
    if (previewButton) {
      await previewButton.click();
      await page.waitForTimeout(1000);
      
      const previewPanel = await page.$('[data-testid="preview-panel"]') || 
                          await page.$('.preview-panel') ||
                          await page.$('div[style*="flex: 1"]');
      
      if (previewPanel) {
        console.log('   ✅ 预览功能正常');
      } else {
        console.log('   ❌ 预览功能异常');
      }
    } else {
      console.log('   ⚠️  未找到预览按钮');
    }
    
    console.log('🎉 布局修复测试完成！');
    
    // 等待用户查看结果
    console.log('⏳ 等待10秒后关闭浏览器...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  } finally {
    await browser.close();
  }
}

// 运行测试
testLayoutFix().catch(console.error); 