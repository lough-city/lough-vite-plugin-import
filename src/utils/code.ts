import { ILibImportComponentDict, IPluginConfig } from '../typings'
import { normalize, resolve } from 'path'
import { existsSync } from 'fs'

/**
 * 生成引入组件代码
 * @param libDict 引入库组件字典
 */
export const generateImportComponentCode = (libDict: ILibImportComponentDict) => {
  let importComponentCode = ''

  for (const libName of Object.keys(libDict)) {
    const componentList = libDict[libName]

    for (const config of componentList) {
      if (!config.component) continue
      importComponentCode += `import ${config.localComponentName} from '${config.component.transform(config)}';`
    }
  }

  return importComponentCode
}

/**
 * 生成引入组件样式代码
 * @param libDict 引入库组件字典
 */
export const generateImportStyleCode = (libDict: ILibImportComponentDict) => {
  let importStyleCode = ''

  for (const libName of Object.keys(libDict)) {
    const componentList = libDict[libName]

    for (const config of componentList) {
      if (!config.style) continue

      const path = config.style.transform(config)
      const importPath = `import '${path}';`

      if (!config.style.excludeNotExistFile) {
        importStyleCode += importPath
        continue
      }

      const modulePath = normalize(require.resolve(libName))
      const lastIndex = modulePath.lastIndexOf(libName)
      const realPath = normalize(resolve(modulePath.substring(0, lastIndex), path))
      const has = existsSync(realPath)

      importStyleCode += has ? importPath : ''
    }
  }

  return importStyleCode
}

/**
 * code 中是否有需要处理库
 * @param code 代码
 * @param libList 需要处理的库
 */
export const codeHasLib = (code: string, libList: Array<string>) => {
  return !libList.every(libName => !new RegExp(`('${libName}')|("${libName}")`).test(code))
}
