# FaunaDB GraphQL Schema Loader

[![npm version](https://badge.fury.io/js/faunadb-graphql-schema-loader.svg)](https://badge.fury.io/js/faunadb-graphql-schema-loader) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

A lib with some helper functions to make uploading a schema to FaunaDB easier.

It allows you to combine multiple SDL strings and use `extend type`.

# Basic Usage

```javascript
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

```typescript
importSchema = (
  faunadbKey: string,
  schema: string,
  mode: 'merge' | 'override' = 'merge'
) => Promise<string>
```

Takes a schema string and uploads that to the database with the provided Admin Key.

**Parameters**

- `faunadbKey` An Admin key for your database
- `schema` An SDL schema string
- `mode` Import mode. Defaults to `merge`.

**Returns** a Promise for the `response.body` from the http request.

See [basic example](/examples/basic/setup.js)

## `makeSchema`

```typescript
makeSchema = (typeDefs: string[]) => string
```

Takes a list of SDL schema strings and combines them. This allows for using `extends` in your type definitions.

**Parameters**

- `typeDefs` Array of SDL schema strings

**Returns** A single SDL schema string.

See [extended types example](/examples/extended-types/setup.js)

# Using and Contributing

Any feedback is appreciated, and if folks see ways to make this into a useful and viable package, I will work to make it so! Please fill out a Github Issue if you see anything.

Thanks!

# License

The MIT License (MIT)
