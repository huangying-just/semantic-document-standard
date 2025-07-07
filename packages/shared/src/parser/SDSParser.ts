// SDS解析器主类

import type {
  SDSAST,
  SDSNode,
  ParseResult,
  ParserConfig,
  ParserPlugin,
  ParserOptions,
  ParserStats,
  Renderer,
  RenderOptions
} from '../types';
import { parseSDS, validateParseResult } from '../utils/parser';

/**
 * SDS解析器主类
 * 负责解析SDS文档并输出不同格式的结果
 */
export class SDSParser {
  private config: ParserConfig;
  private plugins: Map<string, ParserPlugin>;
  private renderers: Map<string, Renderer>;
  private stats: ParserStats;

  constructor(config: ParserConfig = {}) {
    this.config = {
      strict: false,
      preserveOriginal: true,
      debug: false,
      customSemanticBlocks: [],
      customDataBlocks: [],
      plugins: [],
      ...config
    };
    
    this.plugins = new Map();
    this.renderers = new Map();
    this.stats = this.initializeStats();
    
    // 初始化插件
    this.initializePlugins();
  }

  /**
   * 初始化统计信息
   */
  private initializeStats(): ParserStats {
    return {
      totalLines: 0,
      totalNodes: 0,
      semanticBlocks: 0,
      dataBlocks: 0,
      forms: 0,
      references: 0,
      tables: 0,
      codeBlocks: 0,
      parseTime: 0,
      memoryUsage: 0
    };
  }

  /**
   * 初始化插件
   */
  private initializePlugins(): void {
    if (this.config.plugins) {
      for (const plugin of this.config.plugins) {
        this.registerPlugin(plugin);
      }
    }
  }

  /**
   * 注册插件
   */
  public registerPlugin(plugin: ParserPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`插件 ${plugin.name} 已存在`);
    }
    
    this.plugins.set(plugin.name, plugin);
    
    // 初始化插件
    if (plugin.init) {
      plugin.init(this.config);
    }
  }

  /**
   * 注册渲染器
   */
  public registerRenderer(name: string, renderer: Renderer): void {
    this.renderers.set(name, renderer);
  }

  /**
   * 解析SDS文档
   */
  public parse(text: string, options: ParserOptions = { outputFormat: 'ast' }): ParseResult {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    // 预处理文本
    let processedText = text;
    for (const plugin of this.plugins.values()) {
      if (plugin.preprocess) {
        processedText = plugin.preprocess(processedText);
      }
    }
    
    // 解析文档
    const result = parseSDS(processedText, this.config);
    
    // 后处理AST
    let processedAST = result.ast;
    for (const plugin of this.plugins.values()) {
      if (plugin.postprocess) {
        processedAST = plugin.postprocess(processedAST);
      }
    }
    
    // 更新结果
    result.ast = processedAST;
    
    // 验证结果
    const validation = validateParseResult(result);
    result.errors.push(...validation.errors);
    result.warnings.push(...validation.warnings);
    
    // 更新统计信息
    this.updateStats(result, startTime, startMemory);
    
    // 根据输出格式处理结果
    return this.formatResult(result, options);
  }

  /**
   * 更新统计信息
   */
  private updateStats(result: ParseResult, startTime: number, startMemory: number): void {
    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;
    
    this.stats = {
      totalLines: result.originalText.split('\n').length,
      totalNodes: this.countNodes(result.ast.content),
      semanticBlocks: this.countNodeType(result.ast.content, 'semantic_block'),
      dataBlocks: this.countNodeType(result.ast.content, 'data_block'),
      forms: this.countNodeType(result.ast.content, 'form'),
      references: this.countNodeType(result.ast.content, 'reference'),
      tables: this.countNodeType(result.ast.content, 'table'),
      codeBlocks: this.countNodeType(result.ast.content, 'code_block'),
      parseTime: endTime - startTime,
      memoryUsage: endMemory - startMemory
    };
  }

  /**
   * 统计节点数量
   */
  private countNodes(nodes: SDSNode[]): number {
    let count = nodes.length;
    for (const node of nodes) {
      if (node.type === 'semantic_block') {
        count += this.countNodes((node as any).content);
      }
    }
    return count;
  }

  /**
   * 统计特定类型节点数量
   */
  private countNodeType(nodes: SDSNode[], type: string): number {
    let count = 0;
    for (const node of nodes) {
      if (node.type === type) {
        count++;
      }
      if (node.type === 'semantic_block') {
        count += this.countNodeType((node as any).content, type);
      }
    }
    return count;
  }

  /**
   * 格式化结果
   */
  private formatResult(result: ParseResult, options: ParserOptions): ParseResult {
    switch (options.outputFormat) {
      case 'json':
        return this.formatAsJSON(result, options);
      case 'html':
        return this.formatAsHTML(result, options);
      case 'markdown':
        return this.formatAsMarkdown(result, options);
      case 'ast':
      default:
        return result;
    }
  }

  /**
   * 格式化为JSON
   */
  private formatAsJSON(result: ParseResult, options: ParserOptions): ParseResult {
    const jsonResult = {
      ...result,
      ast: JSON.parse(JSON.stringify(result.ast))
    };
    
    if (!options.includePosition) {
      this.removePositionInfo(jsonResult.ast);
    }
    
    return jsonResult;
  }

  /**
   * 格式化为HTML
   */
  private formatAsHTML(result: ParseResult, options: ParserOptions): ParseResult {
    const renderer = options.renderer || this.renderers.get('html');
    if (!renderer) {
      throw new Error('未找到HTML渲染器');
    }
    
    const html = renderer.render(result.ast, { format: 'html', ...options });
    return {
      ...result,
      ast: {
        type: 'html',
        content: html
      } as any
    };
  }

  /**
   * 格式化为Markdown
   */
  private formatAsMarkdown(result: ParseResult, options: ParserOptions): ParseResult {
    const renderer = options.renderer || this.renderers.get('markdown');
    if (!renderer) {
      throw new Error('未找到Markdown渲染器');
    }
    
    const markdown = renderer.render(result.ast, { format: 'markdown', ...options });
    return {
      ...result,
      ast: {
        type: 'markdown',
        content: markdown
      } as any
    };
  }

  /**
   * 移除位置信息
   */
  private removePositionInfo(ast: SDSAST): void {
    const removeFromNode = (node: SDSNode) => {
      delete (node as any).line;
      delete (node as any).column;
      
      if (node.type === 'semantic_block') {
        for (const child of (node as any).content) {
          removeFromNode(child);
        }
      }
    };
    
    for (const node of ast.content) {
      removeFromNode(node);
    }
  }

  /**
   * 获取解析统计信息
   */
  public getStats(): ParserStats {
    return { ...this.stats };
  }

  /**
   * 重置统计信息
   */
  public resetStats(): void {
    this.stats = this.initializeStats();
  }

  /**
   * 获取配置
   */
  public getConfig(): ParserConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<ParserConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 获取已注册的插件
   */
  public getPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * 获取已注册的渲染器
   */
  public getRenderers(): string[] {
    return Array.from(this.renderers.keys());
  }

  /**
   * 验证SDS文档
   */
  public validate(text: string): {
    isValid: boolean;
    errors: any[];
    warnings: any[];
  } {
    const result = this.parse(text);
    return {
      isValid: result.errors.filter(e => e.severity === 'error').length === 0,
      errors: result.errors,
      warnings: result.warnings
    };
  }

  /**
   * 解析文件
   */
  public async parseFile(filePath: string, options: ParserOptions = {}): Promise<ParseResult> {
    // 这里需要根据运行环境来实现文件读取
    // 在Node.js环境中可以使用fs模块
    // 在浏览器环境中需要传入文件内容
    throw new Error('parseFile方法需要在具体环境中实现');
  }

  /**
   * 批量解析
   */
  public async parseBatch(
    texts: string[],
    options: ParserOptions = {}
  ): Promise<ParseResult[]> {
    const results: ParseResult[] = [];
    
    for (const text of texts) {
      try {
        const result = this.parse(text, options);
        results.push(result);
      } catch (error) {
        // 记录错误但继续处理其他文档
        console.error('解析文档时出错:', error);
        results.push({
          ast: { type: 'document', metadata: { version: '1.0' }, content: [] },
          errors: [{
            line: 1,
            column: 1,
            message: `解析失败: ${error}`,
            code: 'PARSE_FAILED',
            severity: 'error'
          }],
          warnings: [],
          metadata: { version: '1.0' },
          originalText: text,
          parseTime: 0
        });
      }
    }
    
    return results;
  }
} 