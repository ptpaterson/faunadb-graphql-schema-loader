const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.example') })
const { importSchema } = require('../../build/index')

const secret = process.env.FAUNADB_ADMIN_KEY

const schema = `
  type Budget {
    name: String!
    owner: User! @relation
  }
  type User {
    budget: Budget! @relation
    name: String!
  }
  `

console.log('\n*** SCHEMA ***')
console.log(schema)
console.log('\n*** RESULT ***')

importSchema(secret, schema).then((res) => console.log(res))
