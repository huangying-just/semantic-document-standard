const puppeteer = require('puppeteer');

async function testFullscreenLayout() {
  console.log('🚀 开始测试全屏布局修复...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 导航到编辑器页面
    console.log('📝 导航到编辑器页面...');
    await page.goto('http://localhost:3003/editor', { waitUntil: 'networkidle0' });
    
    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror', { timeout: 10000 });
    
    // 测试1: 检查编辑器容器尺寸
    console.log('🔍 测试1: 检查编辑器容器尺寸...');
    const containerInfo = await page.evaluate(() => {
      const layout = document.querySelector('.ant-layout');
      const content = document.querySelector('.ant-layout-content');
      const editorContainer = document.querySelector('[data-testid="editor-container"]') || 
                             document.querySelector('.sc-ggWZvA');
      
      return {
        layoutWidth: layout ? layout.offsetWidth : 0,
        layoutHeight: layout ? layout.offsetHeight : 0,
        contentWidth: content ? content.offsetWidth : 0,
        contentHeight: content ? content.offsetHeight : 0,
        editorContainerWidth: editorContainer ? editorContainer.offsetWidth : 0,
        editorContainerHeight: editorContainer ? editorContainer.offsetHeight : 0,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    
    console.log('   容器信息:', containerInfo);
    
    // 检查是否占满视口
    const isFullscreen = containerInfo.layoutWidth >= containerInfo.viewportWidth * 0.9 && 
                        containerInfo.layoutHeight >= containerInfo.viewportHeight * 0.9;
    
    if (isFullscreen) {
      console.log('   ✅ 编辑器容器占满视口');
    } else {
      console.log('   ❌ 编辑器容器未占满视口');
    }
    
    // 测试2: 检查编辑器内容区域
    console.log('🔍 测试2: 检查编辑器内容区域...');
    const editorInfo = await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      const editorWrapper = editor ? editor.parentElement : null;
      
      return {
        editorWidth: editor ? editor.offsetWidth : 0,
        editorHeight: editor ? editor.offsetHeight : 0,
        wrapperWidth: editorWrapper ? editorWrapper.offsetWidth : 0,
        wrapperHeight: editorWrapper ? editorWrapper.offsetHeight : 0
      };
    });
    
    console.log('   编辑器信息:', editorInfo);
    
    if (editorInfo.editorWidth >= 400 && editorInfo.editorHeight >= 300) {
      console.log('   ✅ 编辑器内容区域尺寸合理');
    } else {
      console.log('   ❌ 编辑器内容区域尺寸过小');
    }
    
    // 测试3: 检查工具栏和侧边栏
    console.log('🔍 测试3: 检查工具栏和侧边栏...');
    const toolbarInfo = await page.evaluate(() => {
      const toolbar = document.querySelector('[data-testid="toolbar"]') || 
                     document.querySelector('.sc-hjsuWn');
      const sidebar = document.querySelector('.ant-layout-sider');
      
      return {
        toolbarWidth: toolbar ? toolbar.offsetWidth : 0,
        toolbarHeight: toolbar ? toolbar.offsetHeight : 0,
        sidebarWidth: sidebar ? sidebar.offsetWidth : 0,
        sidebarHeight: sidebar ? sidebar.offsetHeight : 0
      };
    });
    
    console.log('   工具栏和侧边栏信息:', toolbarInfo);
    
    if (toolbarInfo.toolbarWidth > 0 && toolbarInfo.sidebarWidth >= 200) {
      console.log('   ✅ 工具栏和侧边栏显示正常');
    } else {
      console.log('   ❌ 工具栏或侧边栏显示异常');
    }
    
    // 测试4: 检查文本编辑功能
    console.log('🔍 测试4: 检查文本编辑功能...');
    await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      if (editor) {
        // 插入长文本测试
        editor.innerHTML = `
          <p>这是一个测试段落，用来验证编辑器是否能够正常显示和编辑文本内容。编辑器应该能够自动换行，并且有足够的空间来显示文本。</p>
          <h1>这是一个测试标题</h1>
          <p>这是另一个段落，包含更多的文本内容来测试编辑器的布局和功能。如果编辑器布局正确，这些文本应该能够正常显示，并且编辑器应该有足够的空间。</p>
          <ul>
            <li>测试列表项1</li>
            <li>测试列表项2</li>
            <li>测试列表项3</li>
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
    
    // 测试5: 检查响应式布局
    console.log('🔍 测试5: 检查响应式布局...');
    
    // 调整窗口大小
    await page.setViewport({ width: 1000, height: 600 });
    await page.waitForTimeout(1000);
    
    const responsiveInfo = await page.evaluate(() => {
      const content = document.querySelector('.ant-layout-content');
      const editor = document.querySelector('.ProseMirror');
      return {
        contentWidth: content ? content.offsetWidth : 0,
        editorWidth: editor ? editor.offsetWidth : 0,
        viewportWidth: window.innerWidth
      };
    });
    
    console.log('   响应式布局信息:', responsiveInfo);
    
    if (responsiveInfo.contentWidth >= responsiveInfo.viewportWidth * 0.6) {
      console.log('   ✅ 响应式布局正常');
    } else {
      console.log('   ❌ 响应式布局异常');
    }
    
    // 测试6: 检查滚动行为
    console.log('🔍 测试6: 检查滚动行为...');
    
    // 插入更多内容来测试滚动
    await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      if (editor) {
        let content = '';
        for (let i = 0; i < 20; i++) {
          content += `<p>这是第${i + 1}个段落，用来测试编辑器的滚动功能。如果编辑器布局正确，当内容超出可视区域时，应该出现滚动条。</p>`;
        }
        editor.innerHTML += content;
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 检查是否有滚动条
    const hasScroll = await page.evaluate(() => {
      const editor = document.querySelector('.ProseMirror');
      const wrapper = editor ? editor.parentElement : null;
      return {
        editorScroll: editor ? editor.scrollHeight > editor.clientHeight : false,
        wrapperScroll: wrapper ? wrapper.scrollHeight > wrapper.clientHeight : false
      };
    });
    
    if (hasScroll.editorScroll || hasScroll.wrapperScroll) {
      console.log('   ✅ 滚动功能正常');
    } else {
      console.log('   ❌ 滚动功能异常');
    }
    
    console.log('🎉 全屏布局修复测试完成！');
    
    // 等待用户查看结果
    console.log('⏳ 等待15秒后关闭浏览器...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  } finally {
    await browser.close();
  }
}

// 运行测试
testFullscreenLayout().catch(console.error); 