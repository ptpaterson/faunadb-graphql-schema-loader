import { getTypeDefsFromFiles, importSchema, makeSchema } from '../src'

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

describe('makeSchema', () => {
  it('works with a single typeDef', () => {
    expect(makeSchema([basicSchema])).toEqual(basicSchema)
  })

  it('works with a multiple typeDefs', () => {
    expect(makeSchema(extendedTypes)).toEqual(basicSchema)
  })
})
