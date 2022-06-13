# `@lough/vite-plugin-import`

> An on-demand import plug-in that is exclusive to Vite.

## Install

```shell
npm i @lough/vite-plugin-import -D
```

or

```shell
yarn add @lough/vite-plugin-import -D
```

## Usage

> 配置会按层级往下兜底

- `libName` 预设配置: `presetLibConfig` => `presetConfig` => `defaultConfig` => 插件

- `libConfig` 自定义配置: `customConfig` => `presetConfig` => `defaultConfig` => 插件

### presetLibConfig 预设库配置

> 插件内置了 `antd` 以及 `@lyrical/react` 的预设库配置

```ts
import { defineConfig } from 'vite'
import loughVitePluginImport from '@lough/vite-plugin-import'

export default defineConfig({
  plugins: [
    loughVitePluginImport({
      libList: ['antd', '@lyrical/react']
    })
  ]
})
```

### presetConfig 预设配置

> 可以统一预设配置

```ts
import { defineConfig } from 'vite'
import loughVitePluginImport from '@lough/vite-plugin-import'

export default defineConfig({
  plugins: [
    loughVitePluginImport({
      presetConfig: {
        style: {
          transform: ({ name, directory, importComponentName }) =>
            `${name}/${directory}/components/${importComponentName}/index.css`
        }
      },
      libList: ['null']
    })
  ]
})
```

### defaultConfig 默认配置

> 没有预设库配置以及预设配置的参数将使用默认配置

```ts
import { defineConfig } from 'vite'
import loughVitePluginImport from '@lough/vite-plugin-import'

export default defineConfig({
  plugins: [
    loughVitePluginImport({
      libList: ['null']
    })
  ]
})
```

### customConfig 自定义配置

> 除了一系列兜底配置处理，还可以自定义特殊处理

```ts
import { defineConfig } from 'vite'
import loughVitePluginImport from '@lough/vite-plugin-import'

export default defineConfig({
  plugins: [
    loughVitePluginImport({
      libList: [
        {
          name: 'antd',
          namedType: map => map['dash-named']
        },
        {
          name: '@lyrical/react',
          directory: 'es/components'
        }
      ]
    })
  ]
})
```

### 高级的

> 高级属性可进行复杂的计算，例如：屏蔽单一库等

```ts
import { defineConfig } from 'vite'
import loughVitePluginImport from '@lough/vite-plugin-import'

export default defineConfig({
  plugins: [
    loughVitePluginImport(
      {
        name: 'antd',
        namedType: map => map['dash-named'],
        component: false
      },
      {
        libList: [
          {
            name: '@lyrical/react',
            component: {
              transform: ({ name, directory, importComponentName }) =>
                `${name}/${directory}/components/${importComponentName}`
            },
            style: {
              transform: ({ name, directory, importComponentName }) =>
                `${name}/${directory}/components/${importComponentName}/style`,
              excludeNotExistFile: true
            }
          }
        ]
      }
    )
  ]
})
```

## Interface

> 配置都有类型提示，这里不详细描述了，详情看类型源文件 `lib/typings/index.d.ts`

```ts
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
 * 库处理组件配置
 */
export interface ILibComponentConfig {
  /**
   * 组件引入地址转换
   * @param config 库组件配置
   * @default ({name, directory, importComponentName}: IComponentConfig) => `${name}/${directory}/${importComponentName}`
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
   * @default ({name, directory, importComponentName}: IComponentConfig) => `${name}/${directory}/${importComponentName}/style`
   */
  transform: (config: Omit<IComponentConfig, 'style'>) => string
  /**
   * 排除不存在文件
   * @default true
   */
  excludeNotExistFile?: boolean
}

/**
 * 库配置
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
   * 命名类型
   * @default 'BigHumpNamed'
   */
  namedType?: NamedTypeFuncMapOrMap
  /**
   * 组件配置
   */
  component?: boolean | ILibComponentConfig
  /**
   * 样式配置
   */
  style?: boolean | ILibStyleConfig
}

/**
 * 插件配置
 */
export interface IPluginConfig {
  /**
   * 默认设置
   */
  presetConfig?: Omit<ILibConfig, 'name'>
  /**
   * 库列表
   */
  libList:
    | Array<ILibConfig | FuncMap<typeof PRESET_LIB_CONFIG, PRESET_LIB_CONFIG>>
    | Array<ILibConfig | keyof typeof PRESET_LIB_CONFIG>
    | Array<ILibConfig | string>
}
```
