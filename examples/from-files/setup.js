const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env.example') })
const {
  // getTypeDefsFromFiles,
  importSchema,
  makeSchema,
} = require('../../build/index')

const secret = process.env.FAUNADB_ADMIN_KEY
const endpoint = process.env.FAUNADB_ENDPOINT

const filePaths = ['./main.gql', './budget.gql']
const typeDefs = filePaths.map(f => fs.readFileSync(path.join(__dirname, f), 'utf-8'))

const schema = makeSchema(typeDefs)

console.log('\n*** SCHEMA ***')
console.log(schema)
console.log('\n*** RESULT ***')

importSchema(secret, schema, 'replace', endpoint).then((res) => console.log(res))
