/**
 * 引入组件配置
 */
interface IComponentConfig extends ILibConfig {
  /**
   * 引入组件名称
   */
  importComponentName: string
  /**
   * 引入文件使用组件名称 (因为可能重命名)
   */
  localComponentName: string
}

/**
 * 库数据字典
 */
export interface ILibImportComponentDict {
  [libName: string]: Array<IComponentConfig>
}

/**
 * 库处理配置
 */
export interface ILibConfig {
  /**
   * 库名称
   */
  name: string
  /**
   * 库目录
   * @default 'es'
   */
  directory?: string
  /**
   * 组件配置
   */
  component?:
    | false
    | {
        /**
         * 组件引入地址转换
         * @param config 库组件配置
         * @default ({name, directory, importComponentName}: IComponentConfig) => `${name}/${directory}/${importComponentName}`
         */
        transform: (config: Omit<IComponentConfig, 'component'>) => string
      }
  /**
   * 样式配置
   */
  style?:
    | false
    | {
        /**
         * 样式引入地址转换
         * @param config 库组件配置
         * @default ({name, directory, importComponentName}: IComponentConfig) => `${name}/${directory}/${importComponentName}/style`
         */
        transform: (config: Omit<IComponentConfig, 'component'>) => string
        /**
         * 排除不存在文件
         * @default true
         */
        excludeNotExistFile?: boolean
      }
}

/**
 * 插件配置
 */
export interface IPluginConfig {
  // /**
  //  * 默认设置
  //  */
  // defaultConfig: Omit<ILibConfig, 'name'>
  /**
   * 库列表
   */
  libList: Array<ILibConfig>
}
