// 帮助按钮组件

import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import HelpSystem from './HelpSystem';

interface HelpButtonProps {
  type?: 'text' | 'link' | 'default' | 'primary' | 'dashed';
  size?: 'large' | 'middle' | 'small';
  tooltip?: string;
  children?: React.ReactNode;
}

const HelpButton: React.FC<HelpButtonProps> = ({
  type = 'text',
  size = 'middle',
  tooltip = '查看帮助',
  children
}) => {
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <>
      <Tooltip title={tooltip}>
        <Button
          type={type}
          size={size}
          icon={<QuestionCircleOutlined />}
          onClick={() => setHelpVisible(true)}
        >
          {children || '帮助'}
        </Button>
      </Tooltip>

      <HelpSystem
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </>
  );
};

export default HelpButton; 