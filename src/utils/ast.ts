import generate from '@babel/generator'
import { parse, ParseResult } from '@babel/parser'
import { File } from '@babel/types'
import { ILibImportComponentDict, IPluginConfig } from 'src/typings'

/**
 * 获取 babel 解析后的 AST
 * @param code 代码
 * @returns AST
 */
export const getAst = (code: string) => parse(code, { sourceType: 'module', plugins: ['jsx'] })

/**
 * 解析引入库组件
 * @param ast
 * @param libList 库列表
 * @returns 引入库组件字典
 */
export const parseImportLibComponent = (ast: ParseResult<File>, libList: IPluginConfig['libList']) => {
  const libDict: ILibImportComponentDict = {}

  if (!Array.isArray(ast.program.body)) return libDict

  for (const astNode of ast.program.body) {
    const libName = (astNode as any)?.source?.value || ''

    const libNames = libList.map(lib => lib.name)
    if (astNode.type !== 'ImportDeclaration' || !libNames.includes(libName)) continue

    for (const specifier of (astNode as any).specifiers) {
      const importComponentName = specifier?.imported.name || ''
      const localComponentName = specifier?.local.name || ''
      if (!importComponentName) continue

      const index = libList.findIndex(lib => lib.name === libName)

      if (libDict[libName]) libDict[libName].push({ ...libList[index], importComponentName, localComponentName })
      else libDict[libName] = [{ ...libList[index], importComponentName, localComponentName }]
    }
  }

  return libDict
}

/**
 * 删除引入库
 * @param ast
 * @param removeLibKeys 删除的库
 */
export const removeImportLib = (ast: ParseResult<File>, removeLibKeys: Array<string>) => {
  const removeIndex: Array<number> = []

  ast.program.body.forEach((astNode, index) => {
    const libName = (astNode as any)?.source?.value || ''

    if (!removeLibKeys.includes(libName)) return

    removeIndex.push(index)
  })

  ast.program.body = ast.program.body.filter((_item, index) => !removeIndex.includes(index))

  return generate(ast).code
}
