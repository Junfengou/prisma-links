import { makeSchema } from "nexus"
import { join } from "path"
import * as types from "./types"


// For explaination, visit this video: https://www.youtube.com/watch?v=xub4lML2w18&list=PLn2e1F9Rfr6k6MwzS-p9FGK1NDBxxwLPk&index=13
// This is basically boilerplate code from Nexus
// The point of this setup is to provide code first approach by providing auto completion and generate the schema
export const schema = makeSchema({
    types,
    outputs: {
      typegen: join(
        process.cwd(),
        'node_modules',
        '@types',
        'nexus-typegen',
        'index.d.ts'
      ),
      schema: join(process.cwd(), 'graphql', 'schema.graphql'),
    },
    contextType: {
      export: 'Context',
      module: join(process.cwd(), 'graphql', 'context.ts'),
    },
  });



// Below code is from older version without nexus package
/**
 * 
 * import { gql } from "apollo-server-micro";

export const typeDefs = gql`
    type Link {
        id: String
        title: String
        description: String
        url: String
        category: String
        imageUrl: String
        users: [String]
    }

    # Purely for reading operation
    type Query {
        links: [Link]! # This will never be null
    }

    # If you define mutation here and you don't have anything inside, it will break the program
    #  Create, Update, Delete
    # type Mutation {

    # }
`
 */