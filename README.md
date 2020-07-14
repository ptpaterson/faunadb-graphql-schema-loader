# FaunaDB GraphQL Schema Loader

A lib with some helper functions to make uploading a schema to FaunaDB easier.

# Basic Usage

``` javascript
const { importSchema } = require('faunadb-graphql-schema-loader')

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

importSchema(secret, schema).then((res) => console.log(res))
```

# API

## `importSchema`

``` typescript
importSchema = (faunadbKey: string, schema: string) => Promise<string>
```
Takes a schema string and uploads that to the database with the provided Admin Key.

**Parameters**
- `faunadbKey` An Admin key for your database
- `schema` An SDL schema string

**Returns** a Promise for the `response.body`  from the http request.

See [basic example](/examples/basic/setup.js)

## `makeSchema`

``` typescript
makeSchema = (typeDefs: string[]) => string
```
Takes a list of SDL schema strings and combines them.  This allows for using `extends` in your type definitions.

**Parameters**
- `typeDefs` Array of SDL schema strings

**Returns** A single SDL schema string.

See [extended types example](/examples/extended-types/setup.js)

## `getTypeDefsFromFiles`

``` typescript
getTypeDefsFromFiles = (paths: string[]) => string[]
```
Takes a list of relative file paths (**from current working directory**) and synchronously reads them.

**Parameters**
- `paths` Array of relative file paths.

**Returns** An array of strings containing contents of the files indicated.  Hopefully SDL schemas!

See [modules example](/examples/modules/setup.js)

# Using and Contributing

This package is quite small, and a bit opinionated on how to read in SDL files.  Rather than add this as a project dependancy, I would actually recommend (at this point) just copying the source or the basics of it to your own code.

However, any feedback is appreciated, and if folks see ways to make this into a useful and viable package, I will work to make it so!  Please fill out a Github Issue if you see anything.

Thanks!

# License

The MIT License (MIT)