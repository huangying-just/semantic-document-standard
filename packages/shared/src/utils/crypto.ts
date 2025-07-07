import { v4 as uuidv4 } from 'uuid';

// 生成UUID
export const generateUUID = (): string => {
  return uuidv4();
};

// 生成随机字符串
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成随机数字
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成随机ID
export const generateRandomId = (prefix = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${prefix}${timestamp}${random}`;
};

// 哈希字符串
export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// 简单哈希函数（用于非安全场景）
export const simpleHash = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  return Math.abs(hash);
};

// Base64编码
export const encodeBase64 = (str: string): string => {
  if (typeof window !== 'undefined') {
    return btoa(str);
  } else {
    return Buffer.from(str).toString('base64');
  }
};

// Base64解码
export const decodeBase64 = (str: string): string => {
  if (typeof window !== 'undefined') {
    return atob(str);
  } else {
    return Buffer.from(str, 'base64').toString();
  }
};

// URL安全的Base64编码
export const encodeBase64Url = (str: string): string => {
  return encodeBase64(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// URL安全的Base64解码
export const decodeBase64Url = (str: string): string => {
  const padding = '='.repeat((4 - str.length % 4) % 4);
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
  return decodeBase64(base64);
};

// 生成密码盐
export const generateSalt = (length = 16): string => {
  return generateRandomString(length);
};

// 简单密码哈希（仅用于演示，生产环境应使用bcrypt等）
export const hashPassword = async (password: string, salt?: string): Promise<string> => {
  const saltToUse = salt || generateSalt();
  const combined = password + saltToUse;
  const hash = await hashString(combined);
  return `${saltToUse}:${hash}`;
};

// 验证密码
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const [salt, hash] = hashedPassword.split(':');
  const newHash = await hashPassword(password, salt);
  const [, newHashValue] = newHash.split(':');
  return hash === newHashValue;
};

// 生成API密钥
export const generateApiKey = (prefix = 'sds'): string => {
  const timestamp = Date.now().toString(36);
  const random = generateRandomString(32);
  return `${prefix}_${timestamp}_${random}`;
};

// 生成访问令牌
export const generateAccessToken = (): string => {
  return generateRandomString(64);
};

// 生成刷新令牌
export const generateRefreshToken = (): string => {
  return generateRandomString(128);
};

// 生成会话ID
export const generateSessionId = (): string => {
  return generateRandomString(32);
};

// 生成文件哈希
export const generateFileHash = async (file: File | Buffer): Promise<string> => {
  const buffer = file instanceof File ? await file.arrayBuffer() : file;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// 生成文档ID
export const generateDocumentId = (title: string): string => {
  const timestamp = Date.now().toString(36);
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20);
  return `${titleSlug}-${timestamp}`;
};

// 生成版本号
export const generateVersionNumber = (major = 1, minor = 0, patch = 0): string => {
  return `${major}.${minor}.${patch}`;
};

// 递增版本号
export const incrementVersion = (version: string, type: 'major' | 'minor' | 'patch' = 'patch'): string => {
  const [major, minor, patch] = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return version;
  }
}; 