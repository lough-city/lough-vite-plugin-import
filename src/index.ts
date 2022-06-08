import { IPluginConfig } from './typings'
import { Plugin, ResolvedConfig } from 'vite'
import { codeHasLib, generateImportComponentCode, generateImportStyleCode } from './utils/code'
import { getAst, parseImportLibComponent, removeImportLib } from './utils/ast'

let isSourcemap = false

/**
 * vite 按需引入插件
 */
const vitePluginImportLyrical = (config: IPluginConfig): Plugin => {
  let viteConfig: ResolvedConfig

  return {
    name: 'vite-plugin-import-lyrical',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
      isSourcemap = !!viteConfig.build?.sourcemap
    },
    transform(code, id) {
      if (
        /(node_modules)/.test(id) ||
        !codeHasLib(
          code,
          config.libList.map(lib => lib.name)
        )
      ) {
        return { code, map: null }
      }

      const ast = getAst(code)

      const libDice = parseImportLibComponent(ast, config.libList)

      if (viteConfig.command === 'build') {
        code =
          generateImportComponentCode(libDice) +
          removeImportLib(
            ast,
            Object.keys(libDice).filter(key => libDice[key][0].component)
          )
      }

      code = generateImportStyleCode(libDice) + code

      const sourcemap = this?.getCombinedSourcemap()

      return {
        code,
        map: isSourcemap ? sourcemap : null
      }
    }
  }
}

export default vitePluginImportLyrical
