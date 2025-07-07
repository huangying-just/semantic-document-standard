// 基础类型定义
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 用户相关类型
export interface User extends BaseEntity {
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

// 文档相关类型
export interface Document extends BaseEntity {
  documentId: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
  status: DocumentStatus;
  authorId: string;
  author?: User;
  tags: Tag[];
  permissions: Permission[];
}

export interface DocumentMetadata {
  version: string;
  description?: string;
  keywords?: string[];
  category?: string;
  department?: string;
  effectiveDate?: Date;
  expiryDate?: Date;
  reviewers?: string[];
  [key: string]: any;
}

export enum DocumentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DEPRECATED = 'deprecated'
}

// 文档版本类型
export interface DocumentVersion extends BaseEntity {
  documentId: string;
  versionNumber: number;
  content: string;
  metadata: DocumentMetadata;
  commitHash: string;
  createdBy: string;
  createdByUser?: User;
  changeLog?: string;
}

// 标签类型
export interface Tag extends BaseEntity {
  name: string;
  color: string;
  description?: string;
  documentCount?: number;
}

// 权限类型
export interface Permission extends BaseEntity {
  userId: string;
  documentId: string;
  permissionType: PermissionType;
  grantedBy?: string;
  grantedByUser?: User;
}

export enum PermissionType {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

// SDS解析相关类型
export interface SDSAST {
  type: 'document';
  metadata: DocumentMetadata;
  content: SDSNode[];
}

export type SDSNode = 
  | SDSHeadingNode
  | SDSParagraphNode
  | SDSSemanticBlockNode
  | SDSDataBlockNode
  | SDSFormNode
  | SDSReferenceNode
  | SDSListNode
  | SDSTableNode
  | SDSCodeBlockNode;

export interface SDSBaseNode {
  type: string;
  id?: string;
  attributes?: Record<string, any>;
}

export interface SDSHeadingNode extends SDSBaseNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

export interface SDSParagraphNode extends SDSBaseNode {
  type: 'paragraph';
  content: string;
}

export interface SDSSemanticBlockNode extends SDSBaseNode {
  type: 'semantic_block';
  blockType: 'info' | 'note' | 'tip' | 'warning' | 'danger' | string;
  content: SDSNode[];
  attributes: {
    title?: string;
    icon?: string;
    [key: string]: any;
  };
}

export interface SDSDataBlockNode extends SDSBaseNode {
  type: 'data_block';
  dataType: 'yaml' | 'json' | 'csv' | 'xml';
  content: string;
  attributes: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface SDSFormNode extends SDSBaseNode {
  type: 'form';
  formId: string;
  title: string;
  fields: SDSFormField[];
  attributes: {
    submitUrl?: string;
    method?: 'GET' | 'POST';
    [key: string]: any;
  };
}

export interface SDSFormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'email' | 'number';
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  validationRules?: ValidationRule[];
  options?: FormFieldOption[];
  attributes?: Record<string, any>;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message?: string;
}

export interface FormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SDSReferenceNode extends SDSBaseNode {
  type: 'reference';
  referenceType: 'document' | 'section' | 'element';
  target: string; // document_id#element_id
  displayText?: string;
  attributes: {
    inline?: boolean;
    [key: string]: any;
  };
}

export interface SDSListNode extends SDSBaseNode {
  type: 'list';
  listType: 'ordered' | 'unordered';
  items: SDSListItem[];
}

export interface SDSListItem {
  content: string;
  children?: SDSListItem[];
}

export interface SDSTableNode extends SDSBaseNode {
  type: 'table';
  headers: string[];
  rows: string[][];
  attributes: {
    caption?: string;
    [key: string]: any;
  };
}

export interface SDSCodeBlockNode extends SDSBaseNode {
  type: 'code_block';
  language: string;
  content: string;
  attributes: {
    filename?: string;
    [key: string]: any;
  };
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 搜索相关类型
export interface SearchQuery {
  q: string;
  filters?: SearchFilter[];
  sort?: SearchSort;
  page?: number;
  limit?: number;
}

export interface SearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'regex';
  value: any;
}

export interface SearchSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets?: SearchFacet[];
}

export interface SearchFacet {
  field: string;
  values: Array<{
    value: string;
    count: number;
  }>;
}

// 渲染相关类型
export interface RenderOptions {
  format: 'html' | 'pdf' | 'word' | 'markdown';
  theme?: string;
  template?: string;
  includeMetadata?: boolean;
  includeToc?: boolean;
  [key: string]: any;
}

// 协作相关类型
export interface CollaborationSession {
  id: string;
  documentId: string;
  participants: CollaborationParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationParticipant {
  userId: string;
  username: string;
  cursor?: CursorPosition;
  selection?: SelectionRange;
  lastActive: Date;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface SelectionRange {
  start: CursorPosition;
  end: CursorPosition;
}

// 评论相关类型
export interface Comment extends BaseEntity {
  documentId: string;
  authorId: string;
  author?: User;
  content: string;
  position?: CommentPosition;
  parentId?: string;
  replies?: Comment[];
  isResolved: boolean;
}

export interface CommentPosition {
  line: number;
  column: number;
  length: number;
}

// 工作流相关类型
export interface Workflow extends BaseEntity {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification' | 'action';
  assignees: string[];
  order: number;
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
}

export interface WorkflowAction {
  type: string;
  params: Record<string, any>;
}

// 系统配置类型
export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  updatedAt: Date;
}

// 审计日志类型
export interface AuditLog extends BaseEntity {
  userId: string;
  user?: User;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

// 导出解析器相关类型
export * from './parser'; 