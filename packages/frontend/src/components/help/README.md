# SDS编辑器帮助系统

## 概述

SDS编辑器帮助系统为用户提供了完整的使用指南和技术支持，包括详细的功能说明、操作步骤、快捷键、常见问题解答等。

## 组件结构

```
help/
├── HelpSystem.tsx      # 帮助系统主组件
├── UserGuide.tsx       # 用户使用指南组件
├── HelpButton.tsx      # 帮助按钮组件
└── index.ts           # 组件导出文件
```

## 功能特性

### 1. 帮助系统主界面 (HelpSystem)
- 快速操作区域：常用功能的快速入口
- 帮助资源列表：详细的使用指南和文档
- 相关链接：GitHub、文档、社区讨论等
- 技术支持：问题反馈和联系方式

### 2. 用户使用指南 (UserGuide)
- **快速开始**：5分钟上手教程
- **编辑功能**：基础文本编辑操作
- **语义块**：SDS核心功能详解
- **表单定义**：交互式表单创建
- **预览功能**：实时预览操作
- **快捷键**：提高效率的快捷键
- **使用技巧**：最佳实践和常见问题

### 3. 帮助按钮 (HelpButton)
- 可复用的帮助按钮组件
- 支持自定义样式和提示文本
- 一键打开帮助系统

## 使用方法

### 基本使用

```tsx
import { HelpSystem, HelpButton } from '../components/help';

// 在组件中使用
const [helpVisible, setHelpVisible] = useState(false);

// 直接使用帮助系统
<HelpSystem
  visible={helpVisible}
  onClose={() => setHelpVisible(false)}
/>

// 使用帮助按钮
<HelpButton type="primary" tooltip="查看使用指南">
  帮助
</HelpButton>
```

### 在编辑器页面中集成

```tsx
// EditorPage.tsx
import HelpSystem from '../components/help/HelpSystem';

const EditorPage: React.FC = () => {
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <Layout>
      <Header>
        <Button
          icon={<QuestionCircleOutlined />}
          onClick={() => setHelpVisible(true)}
        >
          帮助
        </Button>
      </Header>
      
      {/* 其他内容 */}
      
      <HelpSystem
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </Layout>
  );
};
```

## 帮助内容结构

### 快速开始
- 创建或导入文档
- 基础编辑操作
- 保存和导出

### 编辑功能
- 基础文本编辑（粗体、斜体、删除线、代码）
- 列表编辑（有序、无序、嵌套）
- 表格编辑
- 撤销和重做

### 语义块功能
- 信息块 (info)
- 警告块 (warning)
- 危险块 (danger)
- 提示块 (tip)
- 注意块 (note)

### 表单定义功能
- 支持的字段类型
- 创建表单步骤
- 验证规则配置

### 预览功能
- 实时预览操作
- 预览功能特点
- 样式说明

### 快捷键
- 文本编辑快捷键
- 文档操作快捷键
- 列表快捷键

### 使用技巧
- 提高编辑效率
- 文档组织技巧
- 最佳实践
- 常见问题解决

## 自定义配置

### 修改帮助内容
编辑 `UserGuide.tsx` 中的 `tabItems` 数组来修改帮助内容：

```tsx
const tabItems = [
  {
    key: 'custom',
    label: '自定义标签',
    children: <CustomContent />
  }
];
```

### 添加新的帮助资源
在 `HelpSystem.tsx` 中的 `helpItems` 数组中添加新的帮助项：

```tsx
const helpItems = [
  {
    key: 'new-help',
    label: '新帮助项',
    icon: <CustomIcon />,
    description: '描述信息',
    action: () => handleCustomAction()
  }
];
```

## 样式定制

帮助系统使用 Ant Design 组件和 styled-components，可以通过以下方式定制样式：

```tsx
// 自定义样式组件
const CustomHelpContainer = styled.div`
  // 自定义样式
`;

// 在组件中使用
<CustomHelpContainer>
  <HelpSystem />
</CustomHelpContainer>
```

## 国际化支持

帮助系统支持国际化，可以通过修改文本内容来支持不同语言：

```tsx
// 使用 i18n 库
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

const helpItems = [
  {
    label: t('help.userGuide'),
    description: t('help.userGuideDesc')
  }
];
```

## 扩展功能

### 添加视频教程
在帮助系统中添加视频教程链接：

```tsx
{
  key: 'video-tutorial',
  label: '视频教程',
  icon: <VideoCameraOutlined />,
  description: '观看操作演示视频',
  action: () => window.open('/videos/tutorial.mp4', '_blank')
}
```

### 添加在线文档
链接到在线文档系统：

```tsx
{
  key: 'online-docs',
  label: '在线文档',
  icon: <FileTextOutlined />,
  description: '查看详细技术文档',
  action: () => window.open('https://docs.example.com', '_blank')
}
```

## 维护和更新

### 内容更新
- 定期更新使用指南内容
- 根据用户反馈调整帮助信息
- 添加新功能的说明文档

### 版本管理
- 记录帮助系统的版本变更
- 保持与主应用版本的同步
- 维护向后兼容性

## 技术支持

如果遇到问题或需要技术支持，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- 邮箱: support@example.com
- 社区讨论: [GitHub Discussions](https://github.com/your-repo/discussions) 