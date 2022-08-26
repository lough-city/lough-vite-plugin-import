import { FuncMap, RequiredPick } from '@lyrical/types'
import { NamedTypeFuncMapOrMap } from '@lyrical/js'
import { PRESET_LIB_CONFIG } from '../constants/index'

/**
 * 库处理组件配置
 */
export interface ILibComponentConfig {
  /**
   * 组件引入地址转换
   * @param config 库组件配置
   * @default ({name, directory, importComponentName}) => `${name}/${directory}/${importComponentName}`
   */
  transform: (config: Omit<IComponentConfig, 'component'>) => string
}

/**
 * 库处理样式配置
 */

export interface ILibStyleConfig {
  /**
   * 样式引入地址转换
   * @param config 库组件配置
   * @default ({name, directory, importComponentName}) => `${name}/${directory}/${importComponentName}/style`
   */
  transform: (config: Omit<IComponentConfig, 'style'>) => string
  /**
   * 排除不存在文件
   * @default true
   */
  excludeNotExistFile?: boolean
}

interface ILibConfigByCore<CORE extends boolean = true> {
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
   * 命名类型
   * @default 'BigHumpNamed'
   */
  namedType?: NamedTypeFuncMapOrMap
  /**
   * 组件配置
   */
  component?: (CORE extends true ? false : boolean) | ILibComponentConfig
  /**
   * 样式配置
   */
  style?:
    | (CORE extends true ? false : boolean)
    | (CORE extends true ? RequiredPick<ILibStyleConfig, 'excludeNotExistFile'> : ILibStyleConfig)
}

/**
 * 库处理配置
 */
export type ILibConfig<CORE extends boolean = true> = CORE extends true
  ? RequiredPick<ILibConfigByCore<CORE>, keyof ILibConfigByCore<CORE>>
  : ILibConfigByCore<CORE>

/**
 * 引入组件配置
 */
export interface IComponentConfig extends ILibConfig {
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
 * 插件配置
 */
export interface IPluginConfig<CORE extends boolean = true> {
  /**
   * 默认配置
   */
  presetConfig?: Omit<ILibConfig<false>, 'name'>
  /**
   * 库列表
   */
  libList: CORE extends true
    ? Array<ILibConfig<CORE>>
    :
        | Array<ILibConfig<CORE> | FuncMap<typeof PRESET_LIB_CONFIG, PRESET_LIB_CONFIG>>
        | Array<ILibConfig<CORE> | keyof typeof PRESET_LIB_CONFIG>
        | Array<ILibConfig<CORE> | string>
}
