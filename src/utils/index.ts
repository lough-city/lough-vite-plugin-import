/**
 * 驼峰命名转换为连接符命名
 * @param str 待转换命名
 * @returns 已转换命名
 */
export const humpToDashNamed = (str: string) => {
  const v = str.replace(/([A-Z])/g, '-$1').toLowerCase()

  if (v[0] === '-') return v.substring(1)
  return v
}

// 深度遍历合并预设参数
