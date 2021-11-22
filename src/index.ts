import got from 'got'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { printSchemaWithDirectives } from './printer'

const faunaDirectives = [
  `directive @embedded on OBJECT`,
  `directive @collection(name: String!) on OBJECT`,
  `directive @index(name: String!) on FIELD_DEFINITION`,
  `directive @resolver(name: String, paginated: Boolean! = false) on FIELD_DEFINITION`,
  `directive @relation(name: String) on FIELD_DEFINITION`,
  `directive @unique(index: String) on FIELD_DEFINITION`,
]

const extendFaunaSchema = (typeDefs: string[]): string[] => [
  ...faunaDirectives,
  ...typeDefs,
]

export const makeSchema = (typeDefs: string[]): string => {
  const autoExtendedTypedefs = typeDefs.reduce(
    (result, value) => {
      const hasQueryType =
        value.indexOf('type Query') >= 0 &&
        value.indexOf('extend type Query') === -1
      const newQueryDefined = result.queryDefined || hasQueryType
      const newTypeDef =
        result.queryDefined && hasQueryType
          ? value.replace('type Query', 'extend type Query')
          : value

      return {
        typedefs: [...result.typedefs, newTypeDef],
        queryDefined: newQueryDefined,
      }
    },
    {
      typedefs: [] as string[],
      queryDefined: false,
    }
  ).typedefs

  // const extendedTypeDefs = extendFaunaSchema(typeDefs)
  const extendedTypeDefs = extendFaunaSchema(autoExtendedTypedefs)
  const executableSchema = makeExecutableSchema({ typeDefs: extendedTypeDefs })
  const schema = printSchemaWithDirectives(executableSchema)
  return schema
}

export const importSchema = async (
  faunadbKey: string,
  schema: string,
  mode: 'replace' | 'merge' | 'override' = 'replace',
  endpoint: string = 'https://graphql.fauna.com'
): Promise<string> => {
  try {
    let params = `?mode=${mode}`

    const response = await got.post(
      `${endpoint}/import${params}`,
      {
        body: schema,
        headers: {
          Authorization: `Bearer ${faunadbKey}`,
        },
      }
    )

    if (response.statusCode !== 200) {
      throw new Error(response.body)
    }

    return response.body
  } catch (error) {
    return error.response.body
  }
}
