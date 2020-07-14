import {
  print,
  isSpecifiedScalarType,
  GraphQLSchema,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'

/* ***************************************************************************************
 * Utility functions based on graphql-js
 *
 * https://github.com/graphql/graphql-js/blob/master/src/language/printer.js
 * ***************************************************************************************
 */

const join = (maybeArray: string[] | undefined, separator = ''): string =>
  maybeArray ? maybeArray.filter((s) => s !== '').join(separator) : ''

const indent = (maybeString: string | undefined): string =>
  maybeString ? '  ' + maybeString.replace(/\n/g, '\n  ') : ''

const block = (array: string[]): string =>
  array && array.length !== 0 ? '{\n' + indent(join(array, '\n')) + '\n}' : ''

// function wrap(start: string, maybeString: string | undefined): string {
//   const end = maybeString ? maybeString : ''
//   return maybeString ? start + maybeString + end : ''
// }

/* **************************************************************************************/

export const printSchemaWithDirectives = (schema: GraphQLSchema): string => {
  const str = Object.keys(schema.getTypeMap())
    .filter((k) => !k.match(/^__/))
    .reduce((accum, name) => {
      const type = schema.getType(name)

      if (!type?.astNode || isSpecifiedScalarType(type)) return accum

      const node = type.astNode as ObjectTypeDefinitionNode
      const nodeDirectives = node.directives?.map((n) => print(n))
      const nodeFields = node.fields

      const extNodes = type?.extensionASTNodes as ObjectTypeExtensionNode[]
      const extNodesFields = extNodes?.map((n) => n.fields)

      const allFields = [
        nodeFields ? nodeFields.map((n) => print(n)) : [],
        extNodesFields
          ? extNodesFields.map((ns) => (ns ? ns.map((n) => print(n)) : []))
          : [],
      ].flat(2)

      const typeDef = join(
        [
          'type',
          name,
          // wrap('implements ', join(interfaces, ' & ')), // FaunaDB does not use Interfaces
          join(nodeDirectives, ' '),
          block(allFields),
        ],
        ' '
      )

      return (accum += `${typeDef}\n`)
    }, '')

  return str
}
