import {
  print,
  isObjectType,
  isInputObjectType,
  isEnumType,
  isScalarType,
  isSpecifiedScalarType,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLNamedType,
} from 'graphql'

/* *****************************************************************************
 * Utility functions based on graphql-js
 *
 * https://github.com/graphql/graphql-js/blob/master/src/language/printer.js
 * *****************************************************************************
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

/* ****************************************************************************/

const printObjectTypeDefintion = (type: GraphQLObjectType): string => {
  const name = type.name
  const node = type.astNode
  const nodeDirectives = node?.directives?.map((n) => print(n))
  const nodeFields = node?.fields

  const extNodes = type?.extensionASTNodes
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

  return typeDef
}

const printInputObjectTypeDefintion = (
  type: GraphQLInputObjectType
): string => {
  const name = type.name
  const node = type.astNode
  const nodeDirectives = node?.directives?.map((n) => print(n))
  const nodeFields = node?.fields

  const extNodes = type?.extensionASTNodes
  const extNodesFields = extNodes?.map((n) => n.fields)

  const allFields = [
    nodeFields ? nodeFields.map((n) => print(n)) : [],
    extNodesFields
      ? extNodesFields.map((ns) => (ns ? ns.map((n) => print(n)) : []))
      : [],
  ].flat(2)

  const typeDef = join(
    [
      'input',
      name,
      // wrap('implements ', join(interfaces, ' & ')), // FaunaDB does not use Interfaces
      join(nodeDirectives, ' '),
      block(allFields),
    ],
    ' '
  )

  return typeDef
}

const printScalarTypeDefintion = (type: GraphQLScalarType): string =>
  `scalar ${type.name}`

const printEnumDefintion = (type: GraphQLEnumType): string => {
  const name = type.name
  const node = type.astNode
  const nodeDirectives = node?.directives?.map((n) => print(n))
  const nodeValues = node?.values
  const nodeValuesPrinted = nodeValues ? nodeValues.map((n) => print(n)) : []

  const typeDef = join(
    ['enum', name, join(nodeDirectives, ' '), block(nodeValuesPrinted)],
    ' '
  )

  return typeDef
}

const isFaunaScalarType = (type: GraphQLNamedType): boolean => {
  return (type.name == "Time" || type.name == "Long" || type.name == "Date")
}

export const printSchemaWithDirectives = (schema: GraphQLSchema): string => {
  const str = Object.keys(schema.getTypeMap())
    .filter((k) => !k.match(/^__/))
    .reduce((accum, name) => {
      const type = schema.getType(name)
      if (!type?.astNode || isSpecifiedScalarType(type) || isFaunaScalarType(type)) return accum

      let typeDef

      if (isObjectType(type)) typeDef = printObjectTypeDefintion(type)
      if (isInputObjectType(type)) typeDef = printInputObjectTypeDefintion(type)
      if (isScalarType(type)) typeDef = printScalarTypeDefintion(type)
      if (isEnumType(type)) typeDef = printEnumDefintion(type)

      return typeDef ? accum + `${typeDef}\n` : accum
    }, '')

  return str
}
