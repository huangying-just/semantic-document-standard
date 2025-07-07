// 用户使用指南组件

import React from 'react';
import { Modal, Tabs, Typography, Space, Divider, Alert, Card, Tag } from 'antd';
import {
  FileTextOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  CodeOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

const GuideContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding: 16px;
`;

const FeatureCard = styled(Card)`
  margin-bottom: 16px;
  
  .ant-card-head {
    background: #f8f9fa;
  }
`;

const ShortcutTable = styled.div`
  .shortcut-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .shortcut-row:last-child {
    border-bottom: none;
  }
  
  .shortcut-key {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 12px;
  }
`;

interface UserGuideProps {
  visible: boolean;
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ visible, onClose }) => {
  const tabItems = [
    {
      key: 'quickstart',
      label: (
        <Space>
          <FileTextOutlined />
          快速开始
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>🚀 快速开始</Title>
          
          <Alert
            message="欢迎使用SDS编辑器！"
            description="SDS（语义化文档标准）编辑器是一个强大的文档编辑工具，支持富文本编辑、语义块、表单定义等功能。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Title level={4}>第一步：创建或导入文档</Title>
          <Paragraph>
            <ul>
              <li><strong>新建文档</strong>：点击左侧菜单的"新建文档"按钮</li>
              <li><strong>导入文档</strong>：点击"导入文档"，选择.sds、.md或.txt文件</li>
              <li><strong>打开文档</strong>：支持打开本地文件（功能开发中）</li>
            </ul>
          </Paragraph>
          
          <Title level={4}>第二步：开始编辑</Title>
          <Paragraph>
            <ul>
              <li>在编辑区域直接输入文本</li>
              <li>使用工具栏进行格式化操作</li>
              <li>插入语义块和表单定义</li>
              <li>实时预览文档效果</li>
            </ul>
          </Paragraph>
          
          <Title level={4}>第三步：保存和导出</Title>
          <Paragraph>
            <ul>
              <li><strong>保存文档</strong>：点击"保存文档"按钮</li>
              <li><strong>导出文档</strong>：点击"导出文档"，下载为.sds格式</li>
              <li><strong>重命名</strong>：点击"重命名"修改文档标题</li>
            </ul>
          </Paragraph>
        </GuideContainer>
      ),
    },
    {
      key: 'editing',
      label: (
        <Space>
          <EditOutlined />
          编辑功能
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>✏️ 编辑功能</Title>
          
          <FeatureCard title="基础文本编辑" size="small">
            <Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>粗体文本</Text>：选中文本后点击 <Tag color="blue">B</Tag> 按钮
                </div>
                <div>
                  <Text strong>斜体文本</Text>：选中文本后点击 <Tag color="blue">I</Tag> 按钮
                </div>
                <div>
                  <Text strong>删除线</Text>：选中文本后点击 <Tag color="blue">S</Tag> 按钮
                </div>
                <div>
                  <Text strong>代码文本</Text>：选中文本后点击 <Tag color="blue">代码</Tag> 按钮
                </div>
              </Space>
            </Paragraph>
          </FeatureCard>
          
          <FeatureCard title="列表编辑" size="small">
            <Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>无序列表</Text>：点击 <Tag color="green">•</Tag> 按钮
                </div>
                <div>
                  <Text strong>有序列表</Text>：点击 <Tag color="green">1.</Tag> 按钮
                </div>
                <div>
                  <Text strong>嵌套列表</Text>：在列表项中按Tab键缩进
                </div>
              </Space>
            </Paragraph>
          </FeatureCard>
          
          <FeatureCard title="表格编辑" size="small">
            <Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>插入表格</Text>：点击 <Tag color="orange">表格</Tag> 按钮
                </div>
                <div>
                  <Text strong>调整列宽</Text>：拖拽表格列边界
                </div>
                <div>
                  <Text strong>添加行列</Text>：在表格中右键选择操作
                </div>
              </Space>
            </Paragraph>
          </FeatureCard>
          
          <FeatureCard title="撤销和重做" size="small">
            <Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>撤销操作</Text>：点击 <Tag color="red">↶</Tag> 按钮或按 Ctrl+Z
                </div>
                <div>
                  <Text strong>重做操作</Text>：点击 <Tag color="red">↷</Tag> 按钮或按 Ctrl+Y
                </div>
              </Space>
            </Paragraph>
          </FeatureCard>
        </GuideContainer>
      ),
    },
    {
      key: 'semantic',
      label: (
        <Space>
          <InfoCircleOutlined />
          语义块
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>📝 语义块功能</Title>
          
          <Paragraph>
            语义块是SDS编辑器的核心功能，用于创建具有特定语义的文档块，提供更好的视觉层次和信息组织。
          </Paragraph>
          
          <Title level={4}>语义块类型</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="信息块 (info)"
              description="用于提供重要的信息，蓝色背景"
              type="info"
              showIcon
            />
            <Alert
              message="警告块 (warning)"
              description="用于提醒用户注意某些事项，黄色背景"
              type="warning"
              showIcon
            />
            <Alert
              message="危险块 (danger)"
              description="用于警告用户潜在的风险，红色背景"
              type="error"
              showIcon
            />
            <Alert
              message="提示块 (tip)"
              description="用于提供有用的建议，绿色背景"
              type="success"
              showIcon
            />
            <Alert
              message="注意块 (note)"
              description="用于强调重要内容，橙色背景"
              type="warning"
              showIcon
            />
          </Space>
          
          <Divider />
          
          <Title level={4}>如何插入语义块</Title>
          <Paragraph>
            <ol>
              <li>点击左侧侧边栏的"语义块"标签</li>
              <li>选择要插入的语义块类型（信息、警告、危险、提示、注意等）</li>
              <li>在弹出的对话框中填写：
                <ul>
                  <li><Text strong>块类型</Text>：选择语义块类型</li>
                  <li><Text strong>标题</Text>：可选的块标题</li>
                  <li><Text strong>内容</Text>：块的主要内容</li>
                  <li><Text strong>自定义属性</Text>：JSON格式的额外属性</li>
                </ul>
              </li>
              <li>点击"确认"按钮插入语义块</li>
            </ol>
          </Paragraph>
          
          <Title level={4}>语义块语法</Title>
          <FeatureCard title="Markdown语法" size="small">
            <Paragraph>
              <Text code>
                :::info 信息标题{'\n'}
                这是信息块的内容{'\n'}
                :::
              </Text>
            </Paragraph>
          </FeatureCard>
        </GuideContainer>
      ),
    },
    {
      key: 'forms',
      label: (
        <Space>
          <FormOutlined />
          表单定义
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>📋 表单定义功能</Title>
          
          <Paragraph>
            表单定义功能允许你在文档中嵌入交互式表单，支持多种字段类型和验证规则。
          </Paragraph>
          
          <Title level={4}>支持的字段类型</Title>
          <Space wrap>
            <Tag color="blue">文本输入</Tag>
            <Tag color="blue">多行文本</Tag>
            <Tag color="blue">邮箱</Tag>
            <Tag color="blue">数字</Tag>
            <Tag color="blue">下拉选择</Tag>
            <Tag color="blue">单选</Tag>
            <Tag color="blue">多选</Tag>
            <Tag color="blue">日期</Tag>
            <Tag color="blue">文件上传</Tag>
            <Tag color="blue">密码</Tag>
          </Space>
          
          <Divider />
          
          <Title level={4}>如何创建表单定义</Title>
          <Paragraph>
            <ol>
              <li>点击左侧侧边栏的"表单定义"标签</li>
              <li>点击"插入表单"按钮</li>
              <li>在弹出的对话框中配置：
                <ul>
                  <li><Text strong>表单ID</Text>：唯一标识符</li>
                  <li><Text strong>表单标题</Text>：表单的显示标题</li>
                  <li><Text strong>表单描述</Text>：表单的详细描述</li>
                  <li><Text strong>提交按钮文本</Text>：自定义提交按钮文字</li>
                </ul>
              </li>
              <li>添加表单字段：
                <ul>
                  <li>点击"添加字段"按钮</li>
                  <li>配置字段名称、标签、类型</li>
                  <li>设置是否必填、占位符、验证规则</li>
                  <li>对于选择类型字段，配置选项列表</li>
                </ul>
              </li>
              <li>点击"确认"按钮插入表单定义</li>
            </ol>
          </Paragraph>
          
          <Title level={4}>表单验证规则</Title>
          <FeatureCard title="常用验证规则" size="small">
            <Paragraph>
              <ul>
                <li><Text code>required</Text>：必填字段</li>
                <li><Text code>email</Text>：邮箱格式验证</li>
                <li><Text code>min:5</Text>：最小长度5个字符</li>
                <li><Text code>max:100</Text>：最大长度100个字符</li>
                <li><Text code>pattern:^[0-9]+$</Text>：正则表达式验证</li>
              </ul>
            </Paragraph>
          </FeatureCard>
        </GuideContainer>
      ),
    },
    {
      key: 'preview',
      label: (
        <Space>
          <EyeOutlined />
          预览功能
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>👁️ 预览功能</Title>
          
          <Paragraph>
            实时预览功能让你在编辑文档的同时，实时查看最终渲染效果。
          </Paragraph>
          
          <Title level={4}>如何使用预览</Title>
          <Paragraph>
            <ol>
              <li>在编辑器中编写文档内容</li>
              <li>点击工具栏中的"预览"按钮</li>
              <li>编辑器会切换到预览模式，右侧显示渲染后的文档</li>
              <li>再次点击"预览"按钮返回编辑模式</li>
            </ol>
          </Paragraph>
          
          <Title level={4}>预览功能特点</Title>
          <FeatureCard title="实时同步" size="small">
            <Paragraph>
              <ul>
                <li>编辑内容实时同步到预览区域</li>
                <li>支持所有Markdown语法</li>
                <li>支持SDS语义块渲染</li>
                <li>支持表单定义预览</li>
                <li>响应式布局适配不同屏幕</li>
              </ul>
            </Paragraph>
          </FeatureCard>
          
          <Title level={4}>预览样式</Title>
          <Paragraph>
            预览区域会应用以下样式：
            <ul>
              <li>标题层级样式（h1-h6）</li>
              <li>列表样式（有序、无序）</li>
              <li>代码块语法高亮</li>
              <li>表格样式</li>
              <li>语义块颜色编码</li>
              <li>引用块样式</li>
            </ul>
          </Paragraph>
        </GuideContainer>
      ),
    },
    {
      key: 'shortcuts',
      label: (
        <Space>
          <CodeOutlined />
          快捷键
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>⌨️ 快捷键</Title>
          
          <Paragraph>
            使用快捷键可以提高编辑效率，以下是常用的快捷键列表。
          </Paragraph>
          
          <Title level={4}>文本编辑快捷键</Title>
          <ShortcutTable>
            <div className="shortcut-row">
              <span>粗体文本</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">B</span></span>
            </div>
            <div className="shortcut-row">
              <span>斜体文本</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">I</span></span>
            </div>
            <div className="shortcut-row">
              <span>删除线</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">Shift</span> + <span className="shortcut-key">S</span></span>
            </div>
            <div className="shortcut-row">
              <span>代码文本</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">`</span></span>
            </div>
            <div className="shortcut-row">
              <span>撤销</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">Z</span></span>
            </div>
            <div className="shortcut-row">
              <span>重做</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">Y</span></span>
            </div>
          </ShortcutTable>
          
          <Divider />
          
          <Title level={4}>文档操作快捷键</Title>
          <ShortcutTable>
            <div className="shortcut-row">
              <span>保存文档</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">S</span></span>
            </div>
            <div className="shortcut-row">
              <span>新建文档</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">N</span></span>
            </div>
            <div className="shortcut-row">
              <span>打开文档</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">O</span></span>
            </div>
            <div className="shortcut-row">
              <span>切换预览</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">Shift</span> + <span className="shortcut-key">P</span></span>
            </div>
          </ShortcutTable>
          
          <Divider />
          
          <Title level={4}>列表快捷键</Title>
          <ShortcutTable>
            <div className="shortcut-row">
              <span>无序列表</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">Shift</span> + <span className="shortcut-key">L</span></span>
            </div>
            <div className="shortcut-row">
              <span>有序列表</span>
              <span><span className="shortcut-key">Ctrl</span> + <span className="shortcut-key">Shift</span> + <span className="shortcut-key">O</span></span>
            </div>
          </ShortcutTable>
        </GuideContainer>
      ),
    },
    {
      key: 'tips',
      label: (
        <Space>
          <ExclamationCircleOutlined />
          使用技巧
        </Space>
      ),
      children: (
        <GuideContainer>
          <Title level={3}>💡 使用技巧</Title>
          
          <Title level={4}>提高编辑效率</Title>
          <FeatureCard title="快速格式化" size="small">
            <Paragraph>
              <ul>
                <li>选中文本后使用工具栏按钮快速格式化</li>
                <li>使用快捷键组合提高操作速度</li>
                <li>善用撤销/重做功能</li>
                <li>定期保存文档避免数据丢失</li>
              </ul>
            </Paragraph>
          </FeatureCard>
          
          <Title level={4}>文档组织技巧</Title>
          <FeatureCard title="结构化写作" size="small">
            <Paragraph>
              <ul>
                <li>使用标题层级组织文档结构</li>
                <li>合理使用语义块突出重要信息</li>
                <li>利用列表整理相关内容</li>
                <li>使用表格展示结构化数据</li>
                <li>插入表单收集用户反馈</li>
              </ul>
            </Paragraph>
          </FeatureCard>
          
          <Title level={4}>最佳实践</Title>
          <FeatureCard title="文档规范" size="small">
            <Paragraph>
              <ul>
                <li>保持文档结构清晰</li>
                <li>使用一致的格式风格</li>
                <li>合理使用语义块类型</li>
                <li>为表单字段添加合适的验证规则</li>
                <li>定期备份重要文档</li>
              </ul>
            </Paragraph>
          </FeatureCard>
          
          <Title level={4}>常见问题</Title>
          <FeatureCard title="问题解决" size="small">
            <Paragraph>
              <ul>
                <li><Text strong>文档导入后不显示</Text>：检查文件格式是否正确</li>
                <li><Text strong>工具栏被遮挡</Text>：刷新页面或调整浏览器窗口大小</li>
                <li><Text strong>预览不更新</Text>：确保编辑器内容已保存</li>
                <li><Text strong>语义块样式异常</Text>：检查语法格式是否正确</li>
              </ul>
            </Paragraph>
          </FeatureCard>
        </GuideContainer>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          SDS编辑器使用指南
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Tabs
        defaultActiveKey="quickstart"
        items={tabItems}
        size="large"
        tabPosition="left"
        style={{ minHeight: 600 }}
      />
    </Modal>
  );
};

export default UserGuide; 