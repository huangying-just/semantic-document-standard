// 基础插件类

import type { ParserPlugin, ParserConfig } from '../../types';

/**
 * 基础插件类
 * 所有自定义插件都应该继承此类
 */
export abstract class BasePlugin implements ParserPlugin {
  public name: string;
  public version: string;
  protected config: ParserConfig;

  constructor(name: string, version: string = '1.0.0') {
    this.name = name;
    this.version = version;
    this.config = {};
  }

  /**
   * 插件初始化
   */
  public init(config: ParserConfig): void {
    this.config = config;
  }

  /**
   * 预处理文本
   */
  public preprocess?(text: string): string;

  /**
   * 后处理AST
   */
  public postprocess?(ast: any): any;

  /**
   * 自定义节点解析
   */
  public parseNode?(line: string, context: any): any;
}

/**
 * 调试插件
 * 用于调试解析过程
 */
export class DebugPlugin extends BasePlugin {
  constructor() {
    super('debug', '1.0.0');
  }

  public init(config: ParserConfig): void {
    super.init(config);
    if (this.config.debug) {
      console.log('调试插件已启用');
    }
  }

  public preprocess(text: string): string {
    if (this.config.debug) {
      console.log('预处理文本长度:', text.length);
    }
    return text;
  }

  public postprocess(ast: any): any {
    if (this.config.debug) {
      console.log('后处理AST节点数量:', ast.content?.length || 0);
    }
    return ast;
  }
}

/**
 * 统计插件
 * 用于收集解析统计信息
 */
export class StatsPlugin extends BasePlugin {
  private stats: any = {};

  constructor() {
    super('stats', '1.0.0');
  }

  public init(config: ParserConfig): void {
    super.init(config);
    this.stats = {
      startTime: Date.now(),
      nodes: 0,
      errors: 0,
      warnings: 0
    };
  }

  public postprocess(ast: any): any {
    this.stats.nodes = this.countNodes(ast.content);
    this.stats.endTime = Date.now();
    this.stats.duration = this.stats.endTime - this.stats.startTime;
    
    if (this.config.debug) {
      console.log('解析统计:', this.stats);
    }
    
    return ast;
  }

  private countNodes(nodes: any[]): number {
    let count = nodes.length;
    for (const node of nodes) {
      if (node.type === 'semantic_block' && node.content) {
        count += this.countNodes(node.content);
      }
    }
    return count;
  }

  public getStats(): any {
    return { ...this.stats };
  }
} 