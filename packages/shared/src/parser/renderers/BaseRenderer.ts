// 基础渲染器类

import type { SDSAST, SDSNode, Renderer, RenderOptions } from '../../types';

/**
 * 基础渲染器类
 * 所有自定义渲染器都应该继承此类
 */
export abstract class BaseRenderer implements Renderer {
  protected options: RenderOptions;

  constructor(options: RenderOptions = { format: 'html' }) {
    this.options = options;
  }

  /**
   * 渲染AST为字符串
   */
  public abstract render(ast: SDSAST, options?: RenderOptions): string;

  /**
   * 渲染单个节点
   */
  protected abstract renderNode(node: SDSNode): string;

  /**
   * 渲染节点列表
   */
  protected renderNodes(nodes: SDSNode[]): string {
    return nodes.map(node => this.renderNode(node)).join('\n');
  }

  /**
   * 获取节点属性字符串
   */
  protected getAttributesString(attributes: Record<string, any> = {}): string {
    const attrs = Object.entries(attributes)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}="${this.escapeHtml(String(value))}"`)
      .join(' ');
    
    return attrs ? ` ${attrs}` : '';
  }

  /**
   * HTML转义
   */
  protected escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

/**
 * HTML渲染器
 */
export class HTMLRenderer extends BaseRenderer {
  constructor(options: RenderOptions = { format: 'html' }) {
    super(options);
  }

  public render(ast: SDSAST, options?: RenderOptions): string {
    this.options = { ...this.options, ...options };
    
    const content = this.renderNodes(ast.content);
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ast.metadata.title || 'SDS文档'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .semantic-block { margin: 20px 0; padding: 15px; border-radius: 5px; }
        .semantic-block.info { background-color: #e3f2fd; border-left: 4px solid #2196f3; }
        .semantic-block.note { background-color: #fff3e0; border-left: 4px solid #ff9800; }
        .semantic-block.tip { background-color: #e8f5e8; border-left: 4px solid #4caf50; }
        .semantic-block.warning { background-color: #fff8e1; border-left: 4px solid #ffc107; }
        .semantic-block.danger { background-color: #ffebee; border-left: 4px solid #f44336; }
        .semantic-block h4 { margin-top: 0; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; }
        pre { background-color: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .form-field { margin: 10px 0; }
        .form-field label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-field input, .form-field select, .form-field textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; }
        .form-field.required label::after { content: ' *'; color: red; }
    </style>
</head>
<body>
    <h1>${ast.metadata.title || 'SDS文档'}</h1>
    ${content}
</body>
</html>`;
  }

  protected renderNode(node: SDSNode): string {
    switch (node.type) {
      case 'heading':
        return this.renderHeading(node as any);
      case 'paragraph':
        return this.renderParagraph(node as any);
      case 'semantic_block':
        return this.renderSemanticBlock(node as any);
      case 'data_block':
        return this.renderDataBlock(node as any);
      case 'form':
        return this.renderForm(node as any);
      case 'reference':
        return this.renderReference(node as any);
      case 'list':
        return this.renderList(node as any);
      case 'table':
        return this.renderTable(node as any);
      case 'code_block':
        return this.renderCodeBlock(node as any);
      default:
        return `<div class="unknown-node">未知节点类型: ${(node as any).type}</div>`;
    }
  }

  private renderHeading(node: any): string {
    const tag = `h${node.level}`;
    const id = node.id ? ` id="${node.id}"` : '';
    return `<${tag}${id}>${this.escapeHtml(node.content)}</${tag}>`;
  }

  private renderParagraph(node: any): string {
    return `<p>${this.escapeHtml(node.content)}</p>`;
  }

  private renderSemanticBlock(node: any): string {
    const title = node.attributes?.title ? `<h4>${this.escapeHtml(node.attributes.title)}</h4>` : '';
    const content = this.renderNodes(node.content);
    const attrs = this.getAttributesString(node.attributes);
    
    return `<div class="semantic-block ${node.blockType}"${attrs}>
        ${title}
        ${content}
    </div>`;
  }

  private renderDataBlock(node: any): string {
    const title = node.attributes?.title ? `<h4>${this.escapeHtml(node.attributes.title)}</h4>` : '';
    const content = `<pre><code class="language-${node.dataType}">${this.escapeHtml(node.content)}</code></pre>`;
    
    return `<div class="data-block">
        ${title}
        ${content}
    </div>`;
  }

  private renderForm(node: any): string {
    const fields = node.fields.map((field: any) => this.renderFormField(field)).join('');
    
    return `<form id="${node.formId}" class="sds-form">
        <h3>${this.escapeHtml(node.title)}</h3>
        ${fields}
        <button type="submit">提交</button>
    </form>`;
  }

  private renderFormField(field: any): string {
    const required = field.required ? 'required' : '';
    const placeholder = field.placeholder ? ` placeholder="${this.escapeHtml(field.placeholder)}"` : '';
    const value = field.defaultValue ? ` value="${this.escapeHtml(String(field.defaultValue))}"` : '';
    
    let input = '';
    switch (field.type) {
      case 'textarea':
        input = `<textarea name="${field.id}"${placeholder} ${required}>${field.defaultValue || ''}</textarea>`;
        break;
      case 'select':
        const options = field.options?.map((opt: any) => 
          `<option value="${this.escapeHtml(opt.value)}"${opt.disabled ? ' disabled' : ''}>${this.escapeHtml(opt.label)}</option>`
        ).join('') || '';
        input = `<select name="${field.id}" ${required}>${options}</select>`;
        break;
      case 'checkbox':
        input = `<input type="checkbox" name="${field.id}"${value} ${required}>`;
        break;
      case 'radio':
        input = `<input type="radio" name="${field.id}"${value} ${required}>`;
        break;
      default:
        input = `<input type="${field.type}" name="${field.id}"${placeholder}${value} ${required}>`;
    }
    
    return `<div class="form-field${field.required ? ' required' : ''}">
        <label for="${field.id}">${this.escapeHtml(field.label)}</label>
        ${input}
    </div>`;
  }

  private renderReference(node: any): string {
    const text = node.displayText || node.target;
    return `<a href="#${node.target}" class="sds-reference">${this.escapeHtml(text)}</a>`;
  }

  private renderList(node: any): string {
    const tag = node.listType === 'ordered' ? 'ol' : 'ul';
    const items = node.items.map((item: any) => `<li>${this.escapeHtml(item.content)}</li>`).join('');
    return `<${tag}>${items}</${tag}>`;
  }

  private renderTable(node: any): string {
    const headers = node.headers.map((header: string) => `<th>${this.escapeHtml(header)}</th>`).join('');
    const rows = node.rows.map((row: string[]) => 
      `<tr>${row.map(cell => `<td>${this.escapeHtml(cell)}</td>`).join('')}</tr>`
    ).join('');
    
    return `<table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
  }

  private renderCodeBlock(node: any): string {
    return `<pre><code class="language-${node.language}">${this.escapeHtml(node.content)}</code></pre>`;
  }
}

/**
 * Markdown渲染器
 */
export class MarkdownRenderer extends BaseRenderer {
  constructor(options: RenderOptions = { format: 'markdown' }) {
    super(options);
  }

  public render(ast: SDSAST, options?: RenderOptions): string {
    this.options = { ...this.options, ...options };
    return this.renderNodes(ast.content);
  }

  protected renderNode(node: SDSNode): string {
    switch (node.type) {
      case 'heading':
        return this.renderHeading(node as any);
      case 'paragraph':
        return this.renderParagraph(node as any);
      case 'semantic_block':
        return this.renderSemanticBlock(node as any);
      case 'data_block':
        return this.renderDataBlock(node as any);
      case 'form':
        return this.renderForm(node as any);
      case 'reference':
        return this.renderReference(node as any);
      case 'list':
        return this.renderList(node as any);
      case 'table':
        return this.renderTable(node as any);
      case 'code_block':
        return this.renderCodeBlock(node as any);
      default:
        return `<!-- 未知节点类型: ${(node as any).type} -->`;
    }
  }

  private renderHeading(node: any): string {
    const hashes = '#'.repeat(node.level);
    const id = node.id ? ` {#${node.id}}` : '';
    return `${hashes} ${node.content}${id}`;
  }

  private renderParagraph(node: any): string {
    return node.content;
  }

  private renderSemanticBlock(node: any): string {
    const title = node.attributes?.title ? ` {title="${node.attributes.title}"}` : '';
    const content = this.renderNodes(node.content);
    return `::: [${node.blockType}]${title}\n${content}\n:::`;
  }

  private renderDataBlock(node: any): string {
    return `::: [data] {type="${node.dataType}"}\n${node.content}\n:::`;
  }

  private renderForm(node: any): string {
    const fields = node.fields.map((field: any) => this.renderFormField(field)).join('\n');
    return `::: [form] {id="${node.formId}", title="${node.title}"}\n${fields}\n:::`;
  }

  private renderFormField(field: any): string {
    const attrs = [
      `id="${field.id}"`,
      `type="${field.type}"`,
      `label="${field.label}"`,
      `required="${field.required}"`
    ];
    
    if (field.placeholder) attrs.push(`placeholder="${field.placeholder}"`);
    if (field.defaultValue) attrs.push(`default="${field.defaultValue}"`);
    
    return `::: [field] {${attrs.join(', ')}}`;
  }

  private renderReference(node: any): string {
    return `![[${node.target}]]`;
  }

  private renderList(node: any): string {
    const items = node.items.map((item: any) => 
      node.listType === 'ordered' ? `1. ${item.content}` : `- ${item.content}`
    );
    return items.join('\n');
  }

  private renderTable(node: any): string {
    const headers = `| ${node.headers.join(' | ')} |`;
    const separator = `| ${node.headers.map(() => '---').join(' | ')} |`;
    const rows = node.rows.map((row: string[]) => `| ${row.join(' | ')} |`);
    
    return [headers, separator, ...rows].join('\n');
  }

  private renderCodeBlock(node: any): string {
    return `\`\`\`${node.language}\n${node.content}\n\`\`\``;
  }
} 