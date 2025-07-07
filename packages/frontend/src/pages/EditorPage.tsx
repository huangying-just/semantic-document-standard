// 编辑器页面

import React, { useState } from 'react';
import { Layout, Menu, Button, message, Modal, Input } from 'antd';
import {
  FileTextOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  DownloadOutlined,
  UploadOutlined,
  SettingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import EnhancedSDSEditor from '../components/editor/EnhancedSDSEditor';
import HelpSystem from '../components/help/HelpSystem';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: relative;
  z-index: 5;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSider = styled(Sider)`
  background: #fff;
  border-right: 1px solid #e8e8e8;
  position: relative;
  z-index: 2;
`;

const StyledContent = styled(Content)`
  background: #fafafa;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const DocumentTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const EditorPage: React.FC = () => {
  const [documentTitle, setDocumentTitle] = useState('未命名文档');
  const [documentContent, setDocumentContent] = useState('');
  const [isTitleModalVisible, setIsTitleModalVisible] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);

  // 保存文档
  const handleSave = (content: string) => {
    setDocumentContent(content);
    
    // 这里可以调用API保存到后端
    console.log('保存文档:', {
      title: documentTitle,
      content: content
    });
    
    message.success('文档已保存');
  };

  // 预览文档
  const handlePreview = (html: string) => {
    console.log('预览HTML:', html);
  };

  // 新建文档
  const handleNewDocument = () => {
    Modal.confirm({
      title: '新建文档',
      content: '当前文档未保存，确定要新建文档吗？',
      onOk: () => {
        setDocumentTitle('未命名文档');
        setDocumentContent('');
        message.success('已新建文档');
      }
    });
  };

  // 打开文档
  const handleOpenDocument = () => {
    // 这里可以实现文件选择器
    message.info('打开文档功能待实现');
  };

  // 导出文档
  const handleExportDocument = () => {
    if (!documentContent) {
      message.warning('请先编辑文档内容');
      return;
    }

    // 创建下载链接
    const blob = new Blob([documentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.sds`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    message.success('文档已导出');
  };

  // 导入文档
  const handleImportDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sds,.md,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setDocumentContent(content);
          setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
          message.success('文档已导入');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // 重命名文档
  const handleRenameDocument = () => {
    setTempTitle(documentTitle);
    setIsTitleModalVisible(true);
  };

  // 确认重命名
  const handleConfirmRename = () => {
    if (tempTitle.trim()) {
      setDocumentTitle(tempTitle.trim());
      setIsTitleModalVisible(false);
      message.success('文档已重命名');
    } else {
      message.error('文档标题不能为空');
    }
  };

  // 菜单项
  const menuItems = [
    {
      key: 'new',
      icon: <FileTextOutlined />,
      label: '新建文档',
      onClick: handleNewDocument
    },
    {
      key: 'open',
      icon: <FolderOpenOutlined />,
      label: '打开文档',
      onClick: handleOpenDocument
    },
    {
      key: 'save',
      icon: <SaveOutlined />,
      label: '保存文档',
      onClick: () => handleSave(documentContent)
    },
    {
      key: 'export',
      icon: <DownloadOutlined />,
      label: '导出文档',
      onClick: handleExportDocument
    },
    {
      key: 'import',
      icon: <UploadOutlined />,
      label: '导入文档',
      onClick: handleImportDocument
    },
    {
      key: 'rename',
      icon: <SettingOutlined />,
      label: '重命名',
      onClick: handleRenameDocument
    }
  ];

  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderLeft>
          <DocumentTitle>{documentTitle}</DocumentTitle>
        </HeaderLeft>
        <HeaderRight>
          <Button
            icon={<QuestionCircleOutlined />}
            type="text"
            onClick={() => setHelpVisible(true)}
          >
            帮助
          </Button>
        </HeaderRight>
      </StyledHeader>
      
      <Layout>
        <StyledSider width={200}>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </StyledSider>
        
        <StyledContent>
          <EnhancedSDSEditor
            initialContent={documentContent}
            onSave={handleSave}
            onPreview={handlePreview}
          />
        </StyledContent>
      </Layout>

      {/* 重命名对话框 */}
      <Modal
        title="重命名文档"
        open={isTitleModalVisible}
        onOk={handleConfirmRename}
        onCancel={() => setIsTitleModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          placeholder="请输入文档标题"
          onPressEnter={handleConfirmRename}
          autoFocus
        />
      </Modal>

      {/* 帮助系统 */}
      <HelpSystem
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </StyledLayout>
  );
};

export default EditorPage; 