const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.example') })
const {
  getTypeDefsFromFiles,
  importSchema,
  makeSchema,
} = require('../../build/index')

const secret = process.env.FAUNADB_ADMIN_KEY

const filePaths = ['./main.gql', './budget.gql']

// make sure you current working directory is this one!
const typeDefs = getTypeDefsFromFiles(filePaths)

const schema = makeSchema(typeDefs)

console.log('\n*** SCHEMA ***')
console.log(schema)
console.log('\n*** RESULT ***')

importSchema(secret, schema).then((res) => console.log(res))
