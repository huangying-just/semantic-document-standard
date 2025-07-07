// 增强的SDS编辑器组件

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { common, createLowlight } from 'lowlight';
import { SDSParser, HTMLRenderer, MarkdownRenderer } from '@sds/shared';
import { Button, Divider, message, Tabs } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  TableOutlined,
  EyeOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,

  SettingOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import SemanticBlockEditor from './SemanticBlockEditor';
import FormDefinitionEditor from './FormDefinitionEditor';

const lowlight = createLowlight(common);

// 样式组件
const EditorContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #fafafa;
`;

const EditorPanel = styled.div<{ isPreview?: boolean }>`
  flex: ${props => props.isPreview ? '1' : '1'};
  display: flex;
  flex-direction: column;
  background: white;
  border-right: ${props => props.isPreview ? '1px solid #e8e8e8' : 'none'};
  position: relative;
  z-index: 1;
`;

const Toolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
`;

const EditorContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  
  .ProseMirror {
    outline: none;
    min-height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  .ProseMirror p {
    margin: 0 0 16px 0;
  }
  
  .ProseMirror h1,
  .ProseMirror h2,
  .ProseMirror h3,
  .ProseMirror h4,
  .ProseMirror h5,
  .ProseMirror h6 {
    margin: 24px 0 16px 0;
    font-weight: 600;
    line-height: 1.25;
  }
  
  .ProseMirror h1 { font-size: 2em; }
  .ProseMirror h2 { font-size: 1.5em; }
  .ProseMirror h3 { font-size: 1.25em; }
  .ProseMirror h4 { font-size: 1em; }
  .ProseMirror h5 { font-size: 0.875em; }
  .ProseMirror h6 { font-size: 0.85em; }
  
  .ProseMirror ul,
  .ProseMirror ol {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  .ProseMirror li {
    margin: 8px 0;
  }
  
  .ProseMirror blockquote {
    margin: 16px 0;
    padding: 0 16px;
    border-left: 4px solid #e8e8e8;
    color: #666;
  }
  
  .ProseMirror code {
    background: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  .ProseMirror pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  .ProseMirror pre code {
    background: none;
    padding: 0;
  }
  
  .ProseMirror table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  
  .ProseMirror table th,
  .ProseMirror table td {
    border: 1px solid #e8e8e8;
    padding: 8px 12px;
    text-align: left;
  }
  
  .ProseMirror table th {
    background: #fafafa;
    font-weight: 600;
  }
  
  .ProseMirror mark {
    background: #fff3cd;
    padding: 2px 4px;
    border-radius: 3px;
  }
  
  .ProseMirror .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
`;

const PreviewPanel = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: white;
  
  h1, h2, h3, h4, h5, h6 {
    margin: 24px 0 16px 0;
    font-weight: 600;
    line-height: 1.25;
  }
  
  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1em; }
  h5 { font-size: 0.875em; }
  h6 { font-size: 0.85em; }
  
  p { margin: 0 0 16px 0; }
  
  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  li { margin: 8px 0; }
  
  blockquote {
    margin: 16px 0;
    padding: 0 16px;
    border-left: 4px solid #e8e8e8;
    color: #666;
  }
  
  code {
    background: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 16px 0;
  }
  
  pre code {
    background: none;
    padding: 0;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  
  table th,
  table td {
    border: 1px solid #e8e8e8;
    padding: 8px 12px;
    text-align: left;
  }
  
  table th {
    background: #fafafa;
    font-weight: 600;
  }
  
  .semantic-block {
    margin: 20px 0;
    padding: 15px;
    border-radius: 5px;
  }
  
  .semantic-block.info {
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
  }
  
  .semantic-block.warning {
    background-color: #fff8e1;
    border-left: 4px solid #ffc107;
  }
  
  .semantic-block.danger {
    background-color: #ffebee;
    border-left: 4px solid #f44336;
  }
  
  .semantic-block.tip {
    background-color: #e8f5e8;
    border-left: 4px solid #4caf50;
  }
  
  .semantic-block.note {
    background-color: #fff3e0;
    border-left: 4px solid #ff9800;
  }
`;

interface EnhancedSDSEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  onPreview?: (html: string) => void;
}

const EnhancedSDSEditor: React.FC<EnhancedSDSEditorProps> = ({
  initialContent = '',
  onSave,
  onPreview
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [previewContent, setPreviewContent] = useState('');

  // 创建SDS解析器实例
  const parser = new SDSParser({
    debug: false
  });

  // 注册渲染器
  useEffect(() => {
    parser.registerRenderer('html', new HTMLRenderer());
    parser.registerRenderer('markdown', new MarkdownRenderer());
  }, []);

  // 创建Tiptap编辑器
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '开始编写您的SDS文档...',
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // 当编辑器内容更新时，更新预览
      if (showPreview) {
        updatePreview(editor.getHTML());
      }
    },
  });

  // 监听initialContent变化，更新编辑器内容
  useEffect(() => {
    if (editor && initialContent !== undefined) {
      // 将Markdown内容转换为HTML并设置到编辑器
      const htmlContent = markdownToHtml(initialContent);
      editor.commands.setContent(htmlContent);
    }
  }, [editor, initialContent]);

  // 更新预览内容
  const updatePreview = useCallback((editorHtmlContent: string) => {
    try {
      // 将HTML转换为Markdown，然后解析为SDS
      const markdownContent = htmlToMarkdown(editorHtmlContent);
      const result = parser.parse(markdownContent, { outputFormat: 'html' });
      const renderedHtml = typeof result.ast.content === 'string' ? result.ast.content : '';
      setPreviewContent(renderedHtml);
      
      if (onPreview) {
        onPreview(renderedHtml);
      }
    } catch (error) {
      console.error('预览更新失败:', error);
      setPreviewContent(editorHtmlContent);
    }
  }, [parser, onPreview]);

  // 简单的HTML到Markdown转换
  const htmlToMarkdown = (html: string): string => {
    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1')
      .replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1')
      .replace(/<h5[^>]*>(.*?)<\/h5>/g, '##### $1')
      .replace(/<h6[^>]*>(.*?)<\/h6>/g, '###### $1')
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gs, '```\n$1\n```')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (_, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n');
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gs, (_, content) => {
        let index = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/g, () => `${index++}. $1\n`);
      })
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return markdown.trim();
  };

  // 简单的Markdown到HTML转换
  const markdownToHtml = (markdown: string): string => {
    let html = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/~~(.*?)~~/g, '<s>$1</s>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^(\d+)\. (.*$)/gim, '<ol><li>$2</li></ol>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[h|u|o|b|p])/gm, '<p>')
      .replace(/$/gm, '</p>');

    // 处理代码块
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    return html;
  };

  // 工具栏按钮处理函数
  const handleBold = () => editor?.chain().focus().toggleBold().run();
  const handleItalic = () => editor?.chain().focus().toggleItalic().run();
  const handleStrike = () => editor?.chain().focus().toggleStrike().run();
  const handleCode = () => editor?.chain().focus().toggleCode().run();
  const handleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const handleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const handleTable = () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  const handleUndo = () => editor?.chain().focus().undo().run();
  const handleRedo = () => editor?.chain().focus().redo().run();

  // 保存文档
  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      if (onSave) {
        onSave(content);
      }
      message.success('文档已保存');
    }
  };

  // 切换预览
  const handleTogglePreview = () => {
    if (!showPreview && editor) {
      updatePreview(editor.getHTML());
    }
    setShowPreview(!showPreview);
  };

  // 插入语义块
  const handleInsertSemanticBlock = (block: any) => {
    if (editor) {
      const blockMarkdown = `:::${block.type}${block.title ? ` ${block.title}` : ''}
${block.content}
:::`;
      
      editor.chain().focus().insertContent(blockMarkdown).run();
      message.success('语义块已插入');
    }
  };

  // 插入表单定义
  const handleInsertFormDefinition = (form: any) => {
    if (editor) {
      let formMarkdown = `:::form ${form.id}
${form.title}
${form.description || ''}

`;
      
      form.fields.forEach((field: any) => {
        formMarkdown += `- ${field.label} (${field.type})${field.required ? ' *' : ''}\n`;
        if (field.placeholder) {
          formMarkdown += `  - 占位符: ${field.placeholder}\n`;
        }
        if (field.options && field.options.length > 0) {
          formMarkdown += `  - 选项: ${field.options.join(', ')}\n`;
        }
        if (field.validation) {
          formMarkdown += `  - 验证: ${field.validation}\n`;
        }
        formMarkdown += '\n';
      });
      
      formMarkdown += `${form.submitText || '提交'}
:::`;
      
      editor.chain().focus().insertContent(formMarkdown).run();
      message.success('表单定义已插入');
    }
  };

  if (!editor) {
    return <div>加载中...</div>;
  }

  return (
    <EditorContainer>
      {showSidebar && (
        <Sidebar>
          <Tabs
            defaultActiveKey="semantic"
            items={[
              {
                key: 'semantic',
                label: '语义块',
                children: (
                  <div style={{ padding: '16px' }}>
                    <SemanticBlockEditor onInsert={handleInsertSemanticBlock} />
                  </div>
                ),
              },
              {
                key: 'form',
                label: '表单定义',
                children: (
                  <div style={{ padding: '16px' }}>
                    <FormDefinitionEditor onInsert={handleInsertFormDefinition} />
                  </div>
                ),
              },
            ]}
          />
        </Sidebar>
      )}
      
      <EditorPanel isPreview={showPreview}>
        <Toolbar>
          <ToolbarLeft>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setShowSidebar(!showSidebar)}
              type={showSidebar ? 'primary' : 'default'}
            />
            <Divider type="vertical" />
            <Button
              icon={<UndoOutlined />}
              onClick={handleUndo}
              disabled={!editor.can().undo()}
            />
            <Button
              icon={<RedoOutlined />}
              onClick={handleRedo}
              disabled={!editor.can().redo()}
            />
            <Divider type="vertical" />
            <Button
              icon={<BoldOutlined />}
              onClick={handleBold}
              type={editor.isActive('bold') ? 'primary' : 'default'}
            />
            <Button
              icon={<ItalicOutlined />}
              onClick={handleItalic}
              type={editor.isActive('italic') ? 'primary' : 'default'}
            />
            <Button
              icon={<CodeOutlined />}
              onClick={handleStrike}
              type={editor.isActive('strike') ? 'primary' : 'default'}
            />
            <Button
              icon={<CodeOutlined />}
              onClick={handleCode}
              type={editor.isActive('code') ? 'primary' : 'default'}
            />
            <Divider type="vertical" />
            <Button
              icon={<UnorderedListOutlined />}
              onClick={handleBulletList}
              type={editor.isActive('bulletList') ? 'primary' : 'default'}
            />
            <Button
              icon={<OrderedListOutlined />}
              onClick={handleOrderedList}
              type={editor.isActive('orderedList') ? 'primary' : 'default'}
            />
            <Button
              icon={<TableOutlined />}
              onClick={handleTable}
            />
          </ToolbarLeft>
          
          <ToolbarRight>
            <Button
              icon={<EyeOutlined />}
              onClick={handleTogglePreview}
              type={showPreview ? 'primary' : 'default'}
            >
              {showPreview ? '编辑' : '预览'}
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              type="primary"
            >
              保存
            </Button>
          </ToolbarRight>
        </Toolbar>
        <EditorContentWrapper>
          <EditorContent editor={editor} />
        </EditorContentWrapper>
      </EditorPanel>
      
      {showPreview && (
        <PreviewPanel>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </PreviewPanel>
      )}
    </EditorContainer>
  );
};

export default EnhancedSDSEditor; 