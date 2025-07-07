// 语义块编辑器组件

import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

const SemanticBlockButton = styled(Button)`
  margin: 4px;
`;

interface SemanticBlockConfig {
  type: string;
  title?: string;
  content: string;
  attributes?: Record<string, any>;
}

interface SemanticBlockEditorProps {
  onInsert: (block: SemanticBlockConfig) => void;
}

const semanticBlockTypes = [
  { value: 'info', label: '信息', icon: <InfoCircleOutlined />, color: '#1890ff' },
  { value: 'warning', label: '警告', icon: <ExclamationCircleOutlined />, color: '#faad14' },
  { value: 'danger', label: '危险', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
  { value: 'tip', label: '提示', icon: <InfoCircleOutlined />, color: '#52c41a' },
  { value: 'note', label: '注意', icon: <InfoCircleOutlined />, color: '#fa8c16' },
  { value: 'success', label: '成功', icon: <InfoCircleOutlined />, color: '#52c41a' },
  { value: 'error', label: '错误', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
];

const SemanticBlockEditor: React.FC<SemanticBlockEditorProps> = ({ onInsert }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('info');
  const [form] = Form.useForm();

  const handleInsertBlock = (type: string) => {
    setSelectedType(type);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const block: SemanticBlockConfig = {
        type: selectedType,
        title: values.title,
        content: values.content,
        attributes: values.attributes ? JSON.parse(values.attributes) : {}
      };
      
      onInsert(block);
      setIsModalVisible(false);
      form.resetFields();
      message.success('语义块已插入');
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const getBlockTemplate = (type: string) => {
    const templates = {
      info: '这是一个信息块，用于提供重要的信息。',
      warning: '这是一个警告块，用于提醒用户注意某些事项。',
      danger: '这是一个危险块，用于警告用户潜在的风险。',
      tip: '这是一个提示块，用于提供有用的建议。',
      note: '这是一个注意块，用于强调重要内容。',
      success: '这是一个成功块，用于显示成功信息。',
      error: '这是一个错误块，用于显示错误信息。'
    };
    return templates[type as keyof typeof templates] || '';
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    form.setFieldsValue({
      content: getBlockTemplate(type)
    });
  };

  return (
    <>
      <Space wrap>
        {semanticBlockTypes.map((blockType) => (
          <SemanticBlockButton
            key={blockType.value}
            icon={blockType.icon}
            onClick={() => handleInsertBlock(blockType.value)}
            style={{ color: blockType.color }}
          >
            {blockType.label}
          </SemanticBlockButton>
        ))}
      </Space>

      <Modal
        title="插入语义块"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: selectedType,
            content: getBlockTemplate(selectedType)
          }}
        >
          <Form.Item
            name="type"
            label="块类型"
            rules={[{ required: true, message: '请选择块类型' }]}
          >
            <Select onChange={handleTypeChange}>
              {semanticBlockTypes.map((blockType) => (
                <Option key={blockType.value} value={blockType.value}>
                  <Space>
                    {blockType.icon}
                    {blockType.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="标题（可选）"
          >
            <Input placeholder="输入语义块标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="输入语义块内容"
            />
          </Form.Item>

          <Form.Item
            name="attributes"
            label="自定义属性（JSON格式，可选）"
          >
            <TextArea
              rows={3}
              placeholder='{"key": "value"}'
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SemanticBlockEditor; 