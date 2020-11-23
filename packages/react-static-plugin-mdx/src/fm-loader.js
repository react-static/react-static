const matter = require('gray-matter')
const stringifyObject = require('stringify-object')

export default function(source) {
  const { content, data } = matter(source)
  const frontMatter = stringifyObject(data)

  const newSource = `export const frontMatter = ${frontMatter};

  ${content}`

  return newSource
}
