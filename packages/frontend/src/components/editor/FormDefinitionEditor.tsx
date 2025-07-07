// 表单定义编辑器组件

import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, Space, message, Card, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

const FormDefinitionButton = styled(Button)`
  margin: 4px;
`;

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
}

interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  attributes?: Record<string, any>;
}

interface FormDefinitionEditorProps {
  onInsert: (form: FormDefinition) => void;
}

const fieldTypes = [
  { value: 'text', label: '文本输入' },
  { value: 'textarea', label: '多行文本' },
  { value: 'email', label: '邮箱' },
  { value: 'number', label: '数字' },
  { value: 'select', label: '下拉选择' },
  { value: 'radio', label: '单选' },
  { value: 'checkbox', label: '多选' },
  { value: 'date', label: '日期' },
  { value: 'file', label: '文件上传' },
  { value: 'password', label: '密码' },
];

const FormDefinitionEditor: React.FC<FormDefinitionEditorProps> = ({ onInsert }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fields, setFields] = useState<FormField[]>([]);

  const handleInsertForm = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const formDefinition: FormDefinition = {
        id: values.id || `form_${Date.now()}`,
        title: values.title,
        description: values.description,
        fields: fields,
        submitText: values.submitText || '提交',
        attributes: values.attributes ? JSON.parse(values.attributes) : {}
      };
      
      onInsert(formDefinition);
      setIsModalVisible(false);
      form.resetFields();
      setFields([]);
      message.success('表单定义已插入');
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFields([]);
  };

  const addField = () => {
    const newField: FormField = {
      name: `field_${fields.length + 1}`,
      label: `字段 ${fields.length + 1}`,
      type: 'text',
      required: false,
      placeholder: '',
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const updateField = (index: number, field: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...field };
    setFields(newFields);
  };

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    const newOptions = [...options, `选项 ${options.length + 1}`];
    updateField(fieldIndex, { options: newOptions });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    const newOptions = options.filter((_, i) => i !== optionIndex);
    updateField(fieldIndex, { options: newOptions });
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    const newOptions = [...options];
    newOptions[optionIndex] = value;
    updateField(fieldIndex, { options: newOptions });
  };

  return (
    <>
      <FormDefinitionButton
        icon={<FormOutlined />}
        onClick={handleInsertForm}
        type="primary"
      >
        插入表单
      </FormDefinitionButton>

      <Modal
        title="创建表单定义"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id"
                label="表单ID"
                rules={[{ required: true, message: '请输入表单ID' }]}
              >
                <Input placeholder="form_001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="title"
                label="表单标题"
                rules={[{ required: true, message: '请输入表单标题' }]}
              >
                <Input placeholder="用户反馈表单" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="表单描述"
          >
            <TextArea rows={2} placeholder="表单的详细描述" />
          </Form.Item>

          <Form.Item
            name="submitText"
            label="提交按钮文本"
          >
            <Input placeholder="提交" />
          </Form.Item>

          <Form.Item
            name="attributes"
            label="自定义属性（JSON格式，可选）"
          >
            <TextArea rows={3} placeholder='{"action": "/api/submit", "method": "POST"}' />
          </Form.Item>

          <Divider>表单字段</Divider>

          {fields.map((field, index) => (
            <Card
              key={index}
              size="small"
              title={`字段 ${index + 1}`}
              extra={
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeField(index)}
                />
              }
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="字段名">
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(index, { name: e.target.value })}
                      placeholder="field_name"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="显示标签">
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="字段标签"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="字段类型">
                    <Select
                      value={field.type}
                      onChange={(value) => updateField(index, { type: value })}
                    >
                      {fieldTypes.map((type) => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="占位符">
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                      placeholder="请输入..."
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="验证规则">
                    <Input
                      value={field.validation}
                      onChange={(e) => updateField(index, { validation: e.target.value })}
                      placeholder="required|email"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <span>必填：</span>
                  <Select
                    value={field.required ? 'true' : 'false'}
                    onChange={(value) => updateField(index, { required: value === 'true' })}
                    style={{ width: 80 }}
                  >
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>
                </Space>
              </Form.Item>

              {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                <Form.Item label="选项">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {(field.options || []).map((option, optionIndex) => (
                      <Space key={optionIndex}>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                          placeholder={`选项 ${optionIndex + 1}`}
                          style={{ width: 200 }}
                        />
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeOption(index, optionIndex)}
                        />
                      </Space>
                    ))}
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => addOption(index)}
                    >
                      添加选项
                    </Button>
                  </Space>
                </Form.Item>
              )}
            </Card>
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addField}
            block
          >
            添加字段
          </Button>
        </Form>
      </Modal>
    </>
  );
};

const Divider = styled.div`
  border-top: 1px solid #e8e8e8;
  margin: 16px 0;
  padding-top: 16px;
`;

export default FormDefinitionEditor; 