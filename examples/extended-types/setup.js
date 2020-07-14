const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.example') })
const { importSchema, makeSchema } = require('../../build/index')

const secret = process.env.FAUNADB_ADMIN_KEY

const typeDefs = [
  `
  type User {
    name: String!
  }

  type Query {
    allUsers: [User!]!
  }
  `,
  `
  type Budget {
    name: String!
    owner: User! @relation
  }
  extend type User {
    budget: Budget! @relation
  }
  `,
]

const schema = makeSchema(typeDefs)

console.log('\n*** SCHEMA ***')
console.log(schema)
console.log('\n*** RESULT ***')

importSchema(secret, schema).then((res) => console.log(res))
