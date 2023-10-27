import { NAMED_TYPE } from '@logically/prototype-string'
import { PRESET_LIB_CONFIG } from '../constants/index'
import { ILibConfig, IPluginConfig } from '../typings'

const presetLibConfigMap: Record<string, ILibConfig<false>> = {
  [PRESET_LIB_CONFIG.antd]: {
    name: PRESET_LIB_CONFIG.antd,
    directory: 'es',
    namedType: NAMED_TYPE['dash-named']
  },
  [PRESET_LIB_CONFIG['@lyrical/react']]: {
    name: PRESET_LIB_CONFIG['@lyrical/react'],
    directory: 'es/components',
    namedType: NAMED_TYPE.BigHumpNamed
  }
}

export const transformPluginConfig = (pluginConfig: IPluginConfig<false>) => {
  const { presetConfig } = pluginConfig

  pluginConfig.libList = pluginConfig.libList.map(config => {
    if (typeof config === 'function')
      config = JSON.parse(JSON.stringify(presetLibConfigMap[config(PRESET_LIB_CONFIG)] || {})) as ILibConfig<false>
    if (typeof config === 'string')
      config = { ...JSON.parse(JSON.stringify(presetLibConfigMap[config] || {})), name: config } as ILibConfig<false>

    if (config.directory === undefined) config.directory = presetConfig?.directory || 'es'

    if (config.namedType === undefined) config.namedType = presetConfig?.namedType || NAMED_TYPE.BigHumpNamed

    if (config.component === undefined || config.component === true) {
      config.component = presetConfig?.component || {
        transform: ({ name, directory, importComponentName }) => {
          return `${name}/${directory}/${importComponentName}`
        }
      }
    }

    if (config.style === undefined || config.style === true) {
      config.style = presetConfig?.style || {
        transform: ({ name, directory, importComponentName }) => {
          return `${name}/${directory}/${importComponentName}/style`
        },
        excludeNotExistFile: true
      }
    }
    if (config.style && config.style !== true && config.style.excludeNotExistFile === undefined) {
      config.style.excludeNotExistFile = true
    }

    return config
  })

  return pluginConfig as unknown as IPluginConfig<true>
}
