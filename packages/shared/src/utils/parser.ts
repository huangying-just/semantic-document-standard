// SDS解析器工具函数

import type {
  SDSAST,
  SDSNode,
  SDSParagraphNode,
  SDSSemanticBlockNode,
  SDSDataBlockNode,
  SDSFormNode,
  SDSFormField,
  SDSReferenceNode,
  SDSHeadingNode,
  SDSCodeBlockNode,
  SDSTableNode,
  SDSListNode,
  SDSListItem,
  DocumentMetadata,
  ParseContext,
  ParseError,
  ParseWarning,
  ParseResult,
  ParserConfig,
  SemanticBlockType,
  DataBlockType,
  FormFieldType
} from '../types';

import {
  ParserState,
  ReferenceType
} from '../types';

// 正则表达式模式
const PATTERNS = {
  // YAML Front Matter
  YAML_FRONT_MATTER: /^---\s*$/,
  YAML_END: /^---\s*$/,
  
  // 标题
  HEADING: /^(#{1,6})\s+(.+)$/,
  
  // 语义块
  SEMANTIC_BLOCK_START: /^:::\s*\[([^\]]+)\]\s*(?:\{([^}]*)\})?\s*$/,
  SEMANTIC_BLOCK_END: /^:::\s*$/,
  
  // 数据块
  DATA_BLOCK_START: /^:::\s*\[data\]\s*\{type="([^"]+)"\}\s*$/,
  
  // 表单
  FORM_START: /^:::\s*\[form\]\s*\{id="([^"]+)",\s*title="([^"]+)"\}\s*$/,
  FORM_FIELD: /^:::\s*\[field\]\s*\{([^}]+)\}\s*$/,
  
  // 引用
  ID_REFERENCE: /\{#([^}]+)\}/g,
  CONTENT_REFERENCE: /!\[\[([^\]]+)\]\]/g,
  
  // 代码块
  CODE_BLOCK_START: /^```(\w*)\s*$/,
  CODE_BLOCK_END: /^```\s*$/,
  
  // 表格
  TABLE_ROW: /^\|(.+)\|$/,
  TABLE_SEPARATOR: /^\|[\s\-:|]+\|$/,
  
  // 列表
  ORDERED_LIST: /^(\d+)\.\s+(.+)$/,
  UNORDERED_LIST: /^[\-\*\+]\s+(.+)$/,
  
  // 空行
  EMPTY_LINE: /^\s*$/,
  
  // 段落
  PARAGRAPH: /^(.+)$/
};

// 解析YAML Front Matter
export function parseYamlFrontMatter(lines: string[], startIndex: number): {
  metadata: DocumentMetadata;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const yamlLines: string[] = [];
  let endIndex = startIndex + 1;
  
  // 收集YAML内容
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (PATTERNS.YAML_END.test(line)) {
      endIndex = i;
      break;
    }
    yamlLines.push(line);
  }
  
  // 解析YAML
  const metadata: DocumentMetadata = {
    version: '1.0',
    description: '',
    keywords: [],
    category: '',
    department: '',
    effectiveDate: undefined,
    expiryDate: undefined,
    reviewers: []
  };
  
  try {
    for (const line of yamlLines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        switch (key) {
          case 'document_id':
            metadata.documentId = value;
            break;
          case 'title':
            metadata.title = value;
            break;
          case 'version':
            metadata.version = value;
            break;
          case 'status':
            metadata.status = value as any;
            break;
          case 'author_dept':
            metadata.department = value;
            break;
          case 'description':
            metadata.description = value;
            break;
          case 'keywords':
            metadata.keywords = value.split(',').map(k => k.trim());
            break;
          case 'category':
            metadata.category = value;
            break;
          case 'effective_date':
            metadata.effectiveDate = new Date(value);
            break;
          case 'expiry_date':
            metadata.expiryDate = new Date(value);
            break;
          case 'reviewers':
            metadata.reviewers = value.split(',').map(r => r.trim());
            break;
          default:
            (metadata as any)[key] = value;
        }
      }
    }
  } catch (error) {
    errors.push({
      line: startIndex + 1,
      column: 1,
      message: `YAML解析错误: ${error}`,
      code: 'YAML_PARSE_ERROR',
      severity: 'error'
    });
  }
  
  return { metadata, endIndex, errors };
}

// 解析标题
export function parseHeading(line: string, lineNumber: number): SDSHeadingNode | null {
  const match = line.match(PATTERNS.HEADING);
  if (!match) return null;
  
  const [, hashes, content] = match;
  const level = hashes.length as 1 | 2 | 3 | 4 | 5 | 6;
  
  // 提取ID
  const idMatch = content.match(/\{#([^}]+)\}/);
  const id = idMatch ? idMatch[1] : undefined;
  const cleanContent = content.replace(/\{#[^}]+\}/, '').trim();
  
  return {
    type: 'heading',
    id,
    level,
    content: cleanContent
  };
}

// 解析语义块
export function parseSemanticBlock(
  lines: string[], 
  startIndex: number,
  context: ParseContext
): {
  node: SDSSemanticBlockNode;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const startLine = lines[startIndex];
  const match = startLine.match(PATTERNS.SEMANTIC_BLOCK_START);
  
  if (!match) {
    throw new Error('无效的语义块开始标记');
  }
  
  const [, blockType, attributesStr] = match;
  const attributes: Record<string, any> = {};
  
  // 解析属性
  if (attributesStr) {
    try {
      const attrPairs = attributesStr.split(',').map(pair => pair.trim());
      for (const pair of attrPairs) {
        const [key, value] = pair.split('=').map(s => s.trim());
        if (key && value) {
          // 移除引号
          const cleanValue = value.replace(/^["']|["']$/g, '');
          attributes[key] = cleanValue;
        }
      }
    } catch (error) {
      errors.push({
        line: startIndex + 1,
        column: 1,
        message: `语义块属性解析错误: ${error}`,
        code: 'SEMANTIC_BLOCK_ATTR_ERROR',
        severity: 'error'
      });
    }
  }
  
  // 收集块内容
  const content: SDSNode[] = [];
  let endIndex = startIndex + 1;
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (PATTERNS.SEMANTIC_BLOCK_END.test(line)) {
      endIndex = i;
      break;
    }
    
    // 递归解析内容
    const node = parseLine(line, i, { ...context, parentBlock: undefined });
    if (node) {
      content.push(node);
    }
  }
  
  return {
    node: {
      type: 'semantic_block',
      blockType: blockType as any,
      content,
      attributes
    },
    endIndex,
    errors
  };
}

// 解析数据块
export function parseDataBlock(
  lines: string[],
  startIndex: number,
  context: ParseContext
): {
  node: SDSDataBlockNode;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const startLine = lines[startIndex];
  const match = startLine.match(PATTERNS.DATA_BLOCK_START);
  
  if (!match) {
    throw new Error('无效的数据块开始标记');
  }
  
  const [, dataType] = match;
  const attributes: Record<string, any> = {};
  
  // 收集数据内容
  const dataLines: string[] = [];
  let endIndex = startIndex + 1;
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (PATTERNS.SEMANTIC_BLOCK_END.test(line)) {
      endIndex = i;
      break;
    }
    
    dataLines.push(line);
  }
  
  const content = dataLines.join('\n');
  
  return {
    node: {
      type: 'data_block',
      dataType: dataType as any,
      content,
      attributes
    },
    endIndex,
    errors
  };
}

// 解析表单
export function parseForm(
  lines: string[],
  startIndex: number,
  context: ParseContext
): {
  node: SDSFormNode;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const startLine = lines[startIndex];
  const match = startLine.match(PATTERNS.FORM_START);
  
  if (!match) {
    throw new Error('无效的表单开始标记');
  }
  
  const [, formId, title] = match;
  const fields: SDSFormField[] = [];
  let endIndex = startIndex + 1;
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (PATTERNS.SEMANTIC_BLOCK_END.test(line)) {
      endIndex = i;
      break;
    }
    
    // 解析表单字段
    const fieldMatch = line.match(PATTERNS.FORM_FIELD);
    if (fieldMatch) {
      const [, fieldAttrs] = fieldMatch;
      const field = parseFormField(fieldAttrs, i);
      if (field) {
        fields.push(field);
      }
    }
  }
  
  return {
    node: {
      type: 'form',
      formId,
      title,
      fields,
      attributes: {}
    },
    endIndex,
    errors
  };
}

// 解析表单字段
export function parseFormField(attributesStr: string, lineNumber: number): SDSFormField | null {
  try {
    const attributes: Record<string, any> = {};
    const attrPairs = attributesStr.split(',').map(pair => pair.trim());
    
    for (const pair of attrPairs) {
      const [key, value] = pair.split('=').map(s => s.trim());
      if (key && value) {
        const cleanValue = value.replace(/^["']|["']$/g, '');
        attributes[key] = cleanValue;
      }
    }
    
    return {
      id: attributes.id || '',
      type: attributes.type as any,
      label: attributes.label || '',
      required: attributes.required === 'true',
      placeholder: attributes.placeholder,
      defaultValue: attributes.default,
      validationRules: [],
      options: [],
      attributes
    };
  } catch (error) {
    return null;
  }
}

// 解析引用
export function parseReference(line: string, lineNumber: number): SDSReferenceNode | null {
  // 解析ID引用 {#id}
  const idMatch = line.match(PATTERNS.ID_REFERENCE);
  if (idMatch) {
    return {
      type: 'reference',
      referenceType: ReferenceType.ELEMENT,
      target: idMatch[1],
      displayText: line,
      attributes: { inline: true }
    };
  }
  
  // 解析内容引用 ![[doc#id]]
  const contentMatch = line.match(PATTERNS.CONTENT_REFERENCE);
  if (contentMatch) {
    return {
      type: 'reference',
      referenceType: ReferenceType.DOCUMENT,
      target: contentMatch[1],
      displayText: line,
      attributes: { inline: false }
    };
  }
  
  return null;
}

// 解析代码块
export function parseCodeBlock(
  lines: string[],
  startIndex: number,
  context: ParseContext
): {
  node: SDSCodeBlockNode;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const startLine = lines[startIndex];
  const match = startLine.match(PATTERNS.CODE_BLOCK_START);
  
  if (!match) {
    throw new Error('无效的代码块开始标记');
  }
  
  const [, language] = match;
  const codeLines: string[] = [];
  let endIndex = startIndex + 1;
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (PATTERNS.CODE_BLOCK_END.test(line)) {
      endIndex = i;
      break;
    }
    
    codeLines.push(line);
  }
  
  return {
    node: {
      type: 'code_block',
      language: language || 'text',
      content: codeLines.join('\n'),
      attributes: {}
    },
    endIndex,
    errors
  };
}

// 解析表格
export function parseTable(
  lines: string[],
  startIndex: number,
  context: ParseContext
): {
  node: SDSTableNode;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const headers: string[] = [];
  const rows: string[][] = [];
  let endIndex = startIndex;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    if (PATTERNS.EMPTY_LINE.test(line)) {
      endIndex = i;
      break;
    }
    
    const rowMatch = line.match(PATTERNS.TABLE_ROW);
    if (rowMatch) {
      const cells = rowMatch[1]
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      
      if (headers.length === 0) {
        headers.push(...cells);
      } else {
        rows.push(cells);
      }
    } else if (PATTERNS.TABLE_SEPARATOR.test(line)) {
      // 跳过分隔行
      continue;
    } else {
      endIndex = i;
      break;
    }
  }
  
  return {
    node: {
      type: 'table',
      headers,
      rows,
      attributes: {}
    },
    endIndex,
    errors
  };
}

// 解析列表
export function parseList(
  lines: string[],
  startIndex: number,
  context: ParseContext
): {
  node: SDSListNode;
  endIndex: number;
  errors: ParseError[];
} {
  const errors: ParseError[] = [];
  const items: SDSListItem[] = [];
  let endIndex = startIndex;
  let listType: 'ordered' | 'unordered' = 'unordered';
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    if (PATTERNS.EMPTY_LINE.test(line)) {
      endIndex = i;
      break;
    }
    
    const orderedMatch = line.match(PATTERNS.ORDERED_LIST);
    const unorderedMatch = line.match(PATTERNS.UNORDERED_LIST);
    
    if (orderedMatch) {
      if (listType === 'unordered' && items.length > 0) {
        endIndex = i;
        break;
      }
      listType = 'ordered';
      items.push({ content: orderedMatch[2] });
    } else if (unorderedMatch) {
      if (listType === 'ordered' && items.length > 0) {
        endIndex = i;
        break;
      }
      listType = 'unordered';
      items.push({ content: unorderedMatch[1] });
    } else {
      endIndex = i;
      break;
    }
  }
  
  return {
    node: {
      type: 'list',
      listType,
      items
    },
    endIndex,
    errors
  };
}

// 解析单行
export function parseLine(
  line: string,
  lineNumber: number,
  context: ParseContext
): SDSNode | null {
  // 空行
  if (PATTERNS.EMPTY_LINE.test(line)) {
    return null;
  }
  
  // 标题
  const heading = parseHeading(line, lineNumber);
  if (heading) return heading;
  
  // 引用
  const reference = parseReference(line, lineNumber);
  if (reference) return reference;
  
  // 段落（默认）
  return {
    type: 'paragraph',
    content: line
  };
}

// 主解析函数
export function parseSDS(
  text: string,
  config: ParserConfig = {}
): ParseResult {
  const startTime = Date.now();
  const lines = text.split('\n');
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];
  
  // 初始化AST
  const ast: SDSAST = {
    type: 'document',
    metadata: {
      version: '1.0',
      description: '',
      keywords: [],
      category: '',
      department: '',
      effectiveDate: undefined,
      expiryDate: undefined,
      reviewers: []
    },
    content: []
  };
  
  // 解析上下文
  const context: ParseContext = {
    lineNumber: 0,
    errors,
    warnings
  };
  
  let i = 0;
  let state: ParserState = ParserState.INITIAL;
  
  while (i < lines.length) {
    const line = lines[i];
    context.lineNumber = i + 1;
    
    try {
      // 解析YAML Front Matter
      if (state === ParserState.INITIAL && PATTERNS.YAML_FRONT_MATTER.test(line)) {
        const { metadata, endIndex, errors: yamlErrors } = parseYamlFrontMatter(lines, i);
        ast.metadata = { ...ast.metadata, ...metadata };
        errors.push(...yamlErrors);
        i = endIndex + 1;
        state = ParserState.INITIAL;
        continue;
      }
      
      // 解析语义块
      if (PATTERNS.SEMANTIC_BLOCK_START.test(line)) {
        const { node, endIndex, errors: blockErrors } = parseSemanticBlock(lines, i, context);
        ast.content.push(node);
        errors.push(...blockErrors);
        i = endIndex + 1;
        continue;
      }
      
      // 解析数据块
      if (PATTERNS.DATA_BLOCK_START.test(line)) {
        const { node, endIndex, errors: dataErrors } = parseDataBlock(lines, i, context);
        ast.content.push(node);
        errors.push(...dataErrors);
        i = endIndex + 1;
        continue;
      }
      
      // 解析表单
      if (PATTERNS.FORM_START.test(line)) {
        const { node, endIndex, errors: formErrors } = parseForm(lines, i, context);
        ast.content.push(node);
        errors.push(...formErrors);
        i = endIndex + 1;
        continue;
      }
      
      // 解析代码块
      if (PATTERNS.CODE_BLOCK_START.test(line)) {
        const { node, endIndex, errors: codeErrors } = parseCodeBlock(lines, i, context);
        ast.content.push(node);
        errors.push(...codeErrors);
        i = endIndex + 1;
        continue;
      }
      
      // 解析表格
      if (PATTERNS.TABLE_ROW.test(line)) {
        const { node, endIndex, errors: tableErrors } = parseTable(lines, i, context);
        ast.content.push(node);
        errors.push(...tableErrors);
        i = endIndex + 1;
        continue;
      }
      
      // 解析列表
      if (PATTERNS.ORDERED_LIST.test(line) || PATTERNS.UNORDERED_LIST.test(line)) {
        const { node, endIndex, errors: listErrors } = parseList(lines, i, context);
        ast.content.push(node);
        errors.push(...listErrors);
        i = endIndex + 1;
        continue;
      }
      
      // 解析普通行
      const node = parseLine(line, i, context);
      if (node) {
        ast.content.push(node);
      }
      
      i++;
    } catch (error) {
      errors.push({
        line: i + 1,
        column: 1,
        message: `解析错误: ${error}`,
        code: 'PARSE_ERROR',
        severity: 'error'
      });
      i++;
    }
  }
  
  const parseTime = Date.now() - startTime;
  
  return {
    ast,
    errors,
    warnings,
    metadata: ast.metadata,
    originalText: config.preserveOriginal ? text : '',
    parseTime
  };
}

// 验证解析结果
export function validateParseResult(result: ParseResult): {
  isValid: boolean;
  errors: ParseError[];
  warnings: ParseWarning[];
} {
  const errors: ParseError[] = [...result.errors];
  const warnings: ParseWarning[] = [...result.warnings];
  
  // 基本验证
  if (!result.ast.metadata.documentId) {
    errors.push({
      line: 1,
      column: 1,
      message: '缺少必需的document_id字段',
      code: 'MISSING_DOCUMENT_ID',
      severity: 'error'
    });
  }
  
  if (!result.ast.metadata.title) {
    errors.push({
      line: 1,
      column: 1,
      message: '缺少必需的title字段',
      code: 'MISSING_TITLE',
      severity: 'error'
    });
  }
  
  // 内容验证
  if (result.ast.content.length === 0) {
          warnings.push({
        line: 1,
        column: 1,
        message: '文档内容为空',
        code: 'EMPTY_CONTENT'
      });
  }
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    warnings
  };
} 