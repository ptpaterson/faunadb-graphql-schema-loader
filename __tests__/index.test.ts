import { makeSchema } from '../src'

const basicSchema = `type A @embedded {
  field: Boolean
}
type User {
  name: String!
  budget: Budget! @relation
}
type Query {
  allUsers: [User!]!
}
type Budget {
  name: String!
  owner: User! @relation
}
`

const extendedTypes = [
  `type A @embedded {
  field: Boolean
}
type User {
  name: String!
}
type Query {
  allUsers: [User!]!
}`,
  `type Budget {
  name: String!
  owner: User! @relation
}
extend type User {
  budget: Budget! @relation
}`,
]

const inputSchema = `input HelloInput {
  name: String!
  fact: String!
}
type Query {
  hello(input: HelloInput): String!
}
`
const inputSchemaExtended = [
  `input HelloInput {
  name: String!
}
type Query {
  hello(input: HelloInput): String!
}
`,
  `extend input HelloInput {
  fact: String!
}
`,
]

const enumSchema = `type A {
  field: MyEnum!
}
enum MyEnum {
  YES
  NO
}
`

const scalarsSchema = `scalar Date
scalar Long
type A {
  date: Date
  time: Long
}
`

const interfaceSchema = `interface Node {
  id: String!
}
type User implements Node {
  id: String!
}
`
const interfaceSchemaResult = `type User {
  id: String!
}
`

describe('makeSchema', () => {
  it('works with a single typeDef', () => {
    expect(makeSchema([basicSchema])).toEqual(basicSchema)
  })

  it('works with a multiple typeDefs', () => {
    expect(makeSchema(extendedTypes)).toEqual(basicSchema)
  })

  it('works with input types', () => {
    expect(makeSchema(inputSchemaExtended)).toEqual(inputSchema)
  })

  it('works with enums', () => {
    expect(makeSchema([enumSchema])).toEqual(enumSchema)
  })

  it('works with scalars', () => {
    expect(makeSchema([scalarsSchema])).toEqual(scalarsSchema)
  })

  it('does not print interfaces', () => {
    expect(makeSchema([interfaceSchema])).toEqual(interfaceSchemaResult)
  })
})
