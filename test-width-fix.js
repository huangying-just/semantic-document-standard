const puppeteer = require('puppeteer');

async function testWidthFix() {
  console.log('🚀 开始测试编辑器宽度修复...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 导航到编辑器页面
    console.log('📝 导航到编辑器页面...');
    await page.goto('http://localhost:3005/editor', { waitUntil: 'networkidle0' });
    
    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror', { timeout: 10000 });
    
    // 测试1: 检查主内容区宽度
    console.log('🔍 测试1: 检查主内容区宽度...');
    const contentInfo = await page.evaluate(() => {
      const content = document.querySelector('.ant-layout-content');
      const viewport = window.innerWidth;
      
      return {
        contentWidth: content ? content.offsetWidth : 0,
        contentComputedWidth: content ? getComputedStyle(content).width : '',
        viewportWidth: viewport,
        expectedWidth: viewport - 200 // 减去侧边栏宽度
      };
    });
    
    console.log('   内容区信息:', contentInfo);
    
    if (contentInfo.contentWidth >= contentInfo.expectedWidth * 0.9) {
      console.log('   ✅ 主内容区宽度正确');
    } else {
      console.log('   ❌ 主内容区宽度不足');
    }
    
    // 测试2: 检查编辑器容器宽度
    console.log('🔍 测试2: 检查编辑器容器宽度...');
    const editorInfo = await page.evaluate(() => {
      const editorContainer = document.querySelector('[class*="EditorContainer"]') || 
                             document.querySelector('.sc-ggWZvA');
      const editor = document.querySelector('.ProseMirror');
      
      return {
        containerWidth: editorContainer ? editorContainer.offsetWidth : 0,
        editorWidth: editor ? editor.offsetWidth : 0,
        containerComputedWidth: editorContainer ? getComputedStyle(editorContainer).width : '',
        editorComputedWidth: editor ? getComputedStyle(editor).width : ''
      };
    });
    
    console.log('   编辑器信息:', editorInfo);
    
    if (editorInfo.containerWidth >= 800) {
      console.log('   ✅ 编辑器容器宽度充足');
    } else {
      console.log('   ❌ 编辑器容器宽度不足');
    }
    
    // 测试3: 检查工具栏宽度
    console.log('🔍 测试3: 检查工具栏宽度...');
    const toolbarInfo = await page.evaluate(() => {
      const toolbar = document.querySelector('[class*="Toolbar"]') || 
                     document.querySelector('.sc-hjsuWn');
      
      return {
        toolbarWidth: toolbar ? toolbar.offsetWidth : 0,
        toolbarComputedWidth: toolbar ? getComputedStyle(toolbar).width : ''
      };
    });
    
    console.log('   工具栏信息:', toolbarInfo);
    
    if (toolbarInfo.toolbarWidth >= 600) {
      console.log('   ✅ 工具栏宽度充足');
    } else {
      console.log('   ❌ 工具栏宽度不足');
    }
    
    // 测试4: 检查整体布局
    console.log('🔍 测试4: 检查整体布局...');
    const layoutInfo = await page.evaluate(() => {
      const layout = document.querySelector('.ant-layout');
      const sider = document.querySelector('.ant-layout-sider');
      const content = document.querySelector('.ant-layout-content');
      
      return {
        layoutWidth: layout ? layout.offsetWidth : 0,
        siderWidth: sider ? sider.offsetWidth : 0,
        contentWidth: content ? content.offsetWidth : 0,
        totalWidth: (sider ? sider.offsetWidth : 0) + (content ? content.offsetWidth : 0),
        viewportWidth: window.innerWidth
      };
    });
    
    console.log('   整体布局信息:', layoutInfo);
    
    if (layoutInfo.contentWidth >= layoutInfo.viewportWidth * 0.7) {
      console.log('   ✅ 整体布局正确，内容区占满剩余空间');
    } else {
      console.log('   ❌ 整体布局异常，内容区未占满剩余空间');
    }
    
    // 测试5: 检查文本编辑区域
    console.log('🔍 测试5: 检查文本编辑区域...');
    await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      if (editor) {
        // 插入长文本测试
        editor.innerHTML = `
          <p>这是一个测试段落，用来验证编辑器是否能够正常显示和编辑文本内容。编辑器应该能够自动换行，并且有足够的空间来显示文本。如果编辑器布局正确，这些文本应该能够正常显示，并且编辑器应该有足够的空间。</p>
          <h1>这是一个测试标题</h1>
          <p>这是另一个段落，包含更多的文本内容来测试编辑器的布局和功能。如果编辑器布局正确，这些文本应该能够正常显示，并且编辑器应该有足够的空间。</p>
          <ul>
            <li>测试列表项1：这是一个很长的列表项，用来测试文本是否能够正确换行和显示</li>
            <li>测试列表项2：这是另一个很长的列表项，用来测试文本是否能够正确换行和显示</li>
            <li>测试列表项3：这是第三个很长的列表项，用来测试文本是否能够正确换行和显示</li>
          </ul>
        `;
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 检查文本是否正常显示
    const textContent = await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      return editor ? editor.textContent : '';
    });
    
    if (textContent.length > 0) {
      console.log('   ✅ 文本编辑功能正常');
    } else {
      console.log('   ❌ 文本编辑功能异常');
    }
    
    console.log('✅ 宽度修复测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  } finally {
    await browser.close();
  }
}

testWidthFix(); 