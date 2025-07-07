import { z } from 'zod';

// 通用验证模式
export const emailSchema = z.string().email('无效的邮箱地址');
export const passwordSchema = z.string().min(8, '密码至少8位').max(128, '密码最多128位');
export const usernameSchema = z.string().min(3, '用户名至少3位').max(50, '用户名最多50位');

// 文档ID验证
export const documentIdSchema = z.string()
  .min(1, '文档ID不能为空')
  .max(100, '文档ID最多100位')
  .regex(/^[a-zA-Z0-9_-]+$/, '文档ID只能包含字母、数字、下划线和连字符');

// 验证邮箱
export const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// 验证密码强度
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('密码至少8位');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('需要包含小写字母');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('需要包含大写字母');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('需要包含数字');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('需要包含特殊字符');

  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

// 验证文档ID
export const isValidDocumentId = (documentId: string): boolean => {
  try {
    documentIdSchema.parse(documentId);
    return true;
  } catch {
    return false;
  }
};

// 验证URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 验证JSON
export const isValidJson = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

// 验证YAML
export const isValidYaml = (yaml: string): boolean => {
  try {
    // 这里可以集成js-yaml库进行更严格的验证
    return yaml.trim().length > 0;
  } catch {
    return false;
  }
};

// 验证文件大小
export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

// 验证文件类型
export const validateFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

// 验证日期范围
export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};

// 验证必填字段
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// 验证字符串长度
export const validateStringLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

// 验证数字范围
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
}; 