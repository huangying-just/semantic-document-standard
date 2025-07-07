// SDS解析器相关类型定义

// 从主类型文件导入基础类型
import type {
  SDSAST,
  SDSNode,
  SDSBaseNode,
  SDSHeadingNode,
  SDSParagraphNode,
  SDSSemanticBlockNode,
  SDSDataBlockNode,
  SDSFormNode,
  SDSFormField,
  SDSReferenceNode,
  SDSListNode,
  SDSListItem,
  SDSTableNode,
  SDSCodeBlockNode,
  DocumentMetadata,
  ValidationRule,
  FormFieldOption,
  RenderOptions
} from './index';

// 解析器配置
export interface ParserConfig {
  // 是否启用严格模式
  strict?: boolean;
  // 是否保留原始文本
  preserveOriginal?: boolean;
  // 是否启用调试模式
  debug?: boolean;
  // 自定义语义块类型
  customSemanticBlocks?: string[];
  // 自定义数据块类型
  customDataBlocks?: string[];
  // 插件配置
  plugins?: ParserPlugin[];
}

// 解析器插件接口
export interface ParserPlugin {
  name: string;
  version: string;
  // 插件初始化
  init?(config: ParserConfig): void;
  // 预处理文本
  preprocess?(text: string): string;
  // 后处理AST
  postprocess?(ast: SDSAST): SDSAST;
  // 自定义节点解析
  parseNode?(line: string, context: ParseContext): SDSNode | null;
}

// 解析上下文
export interface ParseContext {
  lineNumber: number;
  currentBlock?: SDSNode;
  parentBlock?: SDSNode;
  metadata?: DocumentMetadata;
  errors: ParseError[];
  warnings: ParseWarning[];
}

// 解析错误
export interface ParseError {
  line: number;
  column: number;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

// 解析警告
export interface ParseWarning {
  line: number;
  column: number;
  message: string;
  code: string;
}

// 解析结果
export interface ParseResult {
  ast: SDSAST;
  errors: ParseError[];
  warnings: ParseWarning[];
  metadata: DocumentMetadata;
  originalText: string;
  parseTime: number;
}

// 语义块类型枚举
export enum SemanticBlockType {
  INFO = 'info',
  NOTE = 'note',
  TIP = 'tip',
  WARNING = 'warning',
  DANGER = 'danger',
  SUCCESS = 'success',
  ERROR = 'error'
}

// 数据块类型枚举
export enum DataBlockType {
  YAML = 'yaml',
  JSON = 'json',
  CSV = 'csv',
  XML = 'xml',
  TOML = 'toml'
}

// 表单字段类型枚举
export enum FormFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  DATETIME = 'datetime',
  FILE = 'file',
  EMAIL = 'email',
  NUMBER = 'number',
  PASSWORD = 'password',
  URL = 'url',
  TEL = 'tel'
}

// 引用类型枚举
export enum ReferenceType {
  DOCUMENT = 'document',
  SECTION = 'section',
  ELEMENT = 'element'
}

// 解析器状态
export enum ParserState {
  INITIAL = 'initial',
  IN_METADATA = 'in_metadata',
  IN_SEMANTIC_BLOCK = 'in_semantic_block',
  IN_DATA_BLOCK = 'in_data_block',
  IN_FORM = 'in_form',
  IN_CODE_BLOCK = 'in_code_block',
  IN_TABLE = 'in_table',
  IN_LIST = 'in_list'
}

// 解析器选项
export interface ParserOptions {
  // 输出格式
  outputFormat?: 'ast' | 'json' | 'html' | 'markdown';
  // 是否包含位置信息
  includePosition?: boolean;
  // 是否包含原始文本
  includeOriginal?: boolean;
  // 自定义渲染器
  renderer?: Renderer;
}

// 渲染器接口
export interface Renderer {
  render(ast: SDSAST, options?: RenderOptions): string;
}

// 解析器统计信息
export interface ParserStats {
  totalLines: number;
  totalNodes: number;
  semanticBlocks: number;
  dataBlocks: number;
  forms: number;
  references: number;
  tables: number;
  codeBlocks: number;
  parseTime: number;
  memoryUsage: number;
}

 