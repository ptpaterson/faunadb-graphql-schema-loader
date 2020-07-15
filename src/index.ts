import * as fs from 'fs'
import got from 'got'
import * as path from 'path'
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

export const getTypeDefsFromFiles = (paths: string[]): string[] =>
  paths.map((p) => fs.readFileSync(path.join(process.cwd(), p), 'utf-8'))

export const makeSchema = (typeDefs: string[]): string => {
  const extendedTypeDefs = extendFaunaSchema(typeDefs)
  const executableSchema = makeExecutableSchema({ typeDefs: extendedTypeDefs })
  const schema = printSchemaWithDirectives(executableSchema)
  return schema
}

export const importSchema = async (
  faunadbKey: string,
  schema: string,
  mode: 'merge' | 'override' = 'merge'
): Promise<string> => {
  try {
    let params = ''
    if (mode === 'override') params = '?mode=override'

    const response = await got.post(
      `https://graphql.fauna.com/import${params}`,
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
