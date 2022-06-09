import { NAMED_TYPE } from '@lyrical/js'
import { IPluginConfig } from 'src/typings'

export const transformPluginConfig = (pluginConfig: IPluginConfig<false>) => {
  const { defaultConfig, libList } = pluginConfig

  libList.forEach(config => {
    if (typeof config === 'string') config = { name: config }

    if (config.directory === undefined) config.directory = defaultConfig?.directory || 'es'

    if (config.namedType === undefined) config.namedType = defaultConfig?.namedType || NAMED_TYPE.BigHumpNamed

    if (config.component === undefined || config.style === true) {
      config.component = defaultConfig?.component || {
        transform: ({ name, directory, importComponentName }) => {
          return `${name}/${directory}/${importComponentName}`
        }
      }
    }

    if (config.style === undefined || config.style === true) {
      config.style = defaultConfig?.style || {
        transform: ({ name, directory, importComponentName }) => {
          return `${name}/${directory}/${importComponentName}/style`
        },
        excludeNotExistFile: true
      }
    }
    if (config.style && config.style !== true && config.style.excludeNotExistFile === undefined) {
      config.style.excludeNotExistFile = true
    }
  })

  return pluginConfig as unknown as IPluginConfig<true>
}
