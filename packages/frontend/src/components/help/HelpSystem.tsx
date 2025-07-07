// 帮助系统主组件

import React, { useState } from 'react';
import { Button, Space, Typography, Modal, List, Card, Tag } from 'antd';
import {
  QuestionCircleOutlined,
  BookOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  BugOutlined,
  GithubOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import UserGuide from './UserGuide';
import styled from 'styled-components';

const { Text, Title, Paragraph } = Typography;

const HelpContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const HelpCard = styled(Card)`
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;



interface HelpSystemProps {
  visible: boolean;
  onClose: () => void;
}

const HelpSystem: React.FC<HelpSystemProps> = ({ visible, onClose }) => {
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const helpItems = [
    {
      key: 'user-guide',
      label: '使用指南',
      icon: <BookOutlined />,
      description: '详细的使用说明和功能介绍',
      action: () => setShowUserGuide(true)
    },
    {
      key: 'video-tutorial',
      label: '视频教程',
      icon: <VideoCameraOutlined />,
      description: '观看操作演示视频',
      action: () => window.open('https://github.com/your-repo/videos', '_blank')
    },
    {
      key: 'faq',
      label: '常见问题',
      icon: <QuestionCircleOutlined />,
      description: '查看常见问题解答',
      action: () => window.open('https://github.com/your-repo/wiki/FAQ', '_blank')
    },
    {
      key: 'feedback',
      label: '反馈建议',
      icon: <MessageOutlined />,
      description: '提交功能建议或问题反馈',
      action: () => window.open('https://github.com/your-repo/issues', '_blank')
    },
    {
      key: 'bug-report',
      label: '报告问题',
      icon: <BugOutlined />,
      description: '报告软件缺陷或错误',
      action: () => window.open('https://github.com/your-repo/issues/new', '_blank')
    },
    {
      key: 'about',
      label: '关于软件',
      icon: <InfoCircleOutlined />,
      description: '软件版本信息和开发团队',
      action: () => setShowAbout(true)
    }
  ];

  const quickActions = [
    {
      title: '快速开始',
      description: '5分钟了解基本操作',
      icon: <FileTextOutlined style={{ fontSize: 20, color: '#52c41a' }} />,
      action: () => setShowUserGuide(true)
    },
    {
      title: '快捷键',
      description: '查看所有快捷键',
      icon: <ExclamationCircleOutlined style={{ fontSize: 20, color: '#faad14' }} />,
      action: () => {
        setShowUserGuide(true);
        // 这里可以通过ref直接跳转到快捷键标签
      }
    },
    {
      title: '语义块',
      description: '了解语义块的使用',
      icon: <InfoCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      action: () => {
        setShowUserGuide(true);
        // 这里可以通过ref直接跳转到语义块标签
      }
    }
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined />
            帮助中心
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        <HelpContainer>
          <Title level={3}>欢迎使用SDS编辑器帮助中心</Title>
          <Text type="secondary">
            在这里你可以找到使用指南、常见问题解答以及获取技术支持。
          </Text>

          <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
            🚀 快速操作
          </Title>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
            dataSource={quickActions}
            renderItem={(item) => (
              <List.Item>
                <HelpCard onClick={item.action}>
                  <div style={{ textAlign: 'center' }}>
                    {item.icon}
                    <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
                      {item.title}
                    </Title>
                    <Text type="secondary">{item.description}</Text>
                  </div>
                </HelpCard>
              </List.Item>
            )}
          />

          <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
            📚 帮助资源
          </Title>
          <List
            dataSource={helpItems}
            renderItem={(item) => (
              <List.Item>
                <HelpCard onClick={item.action} style={{ width: '100%' }}>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.label}
                    description={item.description}
                  />
                </HelpCard>
              </List.Item>
            )}
          />

          <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
            🔗 相关链接
          </Title>
          <Space wrap>
            <Button 
              type="link" 
              icon={<GithubOutlined />}
              onClick={() => window.open('https://github.com/your-repo', '_blank')}
            >
              GitHub 仓库
            </Button>
            <Button 
              type="link" 
              icon={<FileTextOutlined />}
              onClick={() => window.open('https://github.com/your-repo/wiki', '_blank')}
            >
              项目文档
            </Button>
            <Button 
              type="link" 
              icon={<MessageOutlined />}
              onClick={() => window.open('https://github.com/your-repo/discussions', '_blank')}
            >
              社区讨论
            </Button>
          </Space>

          <div style={{ marginTop: 32, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
            <Text type="secondary">
              <strong>需要更多帮助？</strong> 如果这里没有找到你需要的答案，请通过以下方式联系我们：
            </Text>
            <br />
            <Space style={{ marginTop: 8 }}>
              <Button 
                size="small" 
                type="primary"
                onClick={() => window.open('https://github.com/your-repo/issues/new', '_blank')}
              >
                提交问题
              </Button>
              <Button 
                size="small"
                onClick={() => window.open('mailto:support@example.com', '_blank')}
              >
                发送邮件
              </Button>
            </Space>
          </div>
        </HelpContainer>
      </Modal>

      {/* 使用指南模态框 */}
      <UserGuide 
        visible={showUserGuide} 
        onClose={() => setShowUserGuide(false)} 
      />

      {/* 关于软件模态框 */}
      <Modal
        title="关于SDS编辑器"
        open={showAbout}
        onCancel={() => setShowAbout(false)}
        footer={[
          <Button key="close" onClick={() => setShowAbout(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <div style={{ padding: 16 }}>
          <Title level={3}>SDS编辑器 v1.0.0</Title>
          <Paragraph>
            SDS（语义化文档标准）编辑器是一个基于Web的文档编辑工具，支持富文本编辑、
            语义块、表单定义等功能，旨在提供更好的文档创作体验。
          </Paragraph>
          
          <Title level={4}>主要特性</Title>
          <ul>
            <li>富文本编辑支持</li>
            <li>语义块功能</li>
            <li>表单定义</li>
            <li>实时预览</li>
            <li>文档导入导出</li>
            <li>响应式设计</li>
          </ul>
          
          <Title level={4}>技术栈</Title>
          <Space wrap>
            <Tag color="blue">React</Tag>
            <Tag color="blue">TypeScript</Tag>
            <Tag color="green">Tiptap</Tag>
            <Tag color="orange">Ant Design</Tag>
            <Tag color="purple">Node.js</Tag>
            <Tag color="cyan">PostgreSQL</Tag>
          </Space>
          
          <Title level={4}>开发团队</Title>
          <Paragraph>
            本项目由开源社区贡献者共同开发维护。
          </Paragraph>
          
          <Title level={4}>许可证</Title>
          <Paragraph>
            MIT License - 详见 <a href="https://github.com/your-repo/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">LICENSE</a> 文件
          </Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default HelpSystem; 