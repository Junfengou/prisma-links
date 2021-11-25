import { objectType, extendType, intArg, stringArg, nonNull } from "nexus"
import { User } from "./User";

// This is called "Code First Approach"

// IMPORTANT: 
    // In order to generate the schema after completing these code, we need to visit [localhost:3000/api/graphql] endpoint in order for the project to know when to generate these types

// Make sure your definition in here actually matches your schema.prisma types, otherwise you will run into issues
export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.string('id');
        t.string('title');
        t.string('url');
        t.string('description');
        t.string('imageUrl');
        t.string('category');
        // This is an array
        t.list.field('users', { 

            type: User,
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.link
                // nuff said
                .findUnique({
                    where: {
                        // parent refers to this objectType
                        // in this case [parent.id] is referring to [this.link.id] that the user is currently looking at and use the id to query the [user]
                        id: parent.id,
                    }
                }).users();
            }
        })
    }
})


/*
    ObjectType [Edge, PageInfo, Response] are all useful for pagination with prisma
        This type of pagination is called Relay Pagination
*/

export const Edge = objectType({
    name: 'Edge',
    definition(t) {
        t.string('cursor');
        // array of nodes
        t.field('node', { 
            type: Link,
        })
    }
})

export const PageInfo = objectType({
    name: 'PageInfo',
    definition(t) {
        t.string('endCursor');
        t.boolean('hasNextPage');
    }
})

export const Response = objectType({
    name: 'Response',
    definition(t) {
        t.field('pageInfo', { type: PageInfo });
        t.list.field('edges', {
            type: Edge,
        })
    }
})



// Client sends a request. From here on, two senarios could happen
/*
    1st -> On the initial request, the client will just send a barebone req to the server to ask for however many row of data from DB to display to the client
    2nd -> After the initial request, we need to start passing in arguments in each request to tell the server exactly what to extract from the DB.
            Obviously we don't want to show duplication in data in each request, the server need to have the necessary information to process that.
            = first arg [cursor] => Server will check if the cursor is being send back, then send over items to the client appropriately. Otherwise send the first item in the DB
*/
export const LinksQuery = extendType({
    type: "Query",
    definition(t) {
      t.field("links", {
        type: "Response",
        args: {
          first: intArg(), // how many items you want to return
          after: stringArg(), // the cursor
        },
        async resolve(_parent, args, ctx) {
          let queryResults = null; // The result of data gets store in this variable
          // Check to see if there is a cursor argument
          if (args.after) {
              // If there is a cursor, query the DB through Prisma
            queryResults = await ctx.prisma.link.findMany({
              take: args.first, // The number of items to return from the DB
              skip: 1,  // skip the cursor
              cursor: {
                id: args.after, // the cursor 
              },
            });
          } else {
              // If there is no cursor passed in, this means that this request is the first request
              // and we will return the first items in the DB
            queryResults = await ctx.prisma.link.findMany({
              take: args.first,
            });
          }
          // If queryResults is not empty, meaning there are more links to return from the DB
          if (queryResults.length > 0) {
            // Detect the last element from the first DB request result...which is -> [queryResults] 
            const lastLinkInResults = queryResults[queryResults.length - 1]; // accessing the last element
            // cursor we'll return
            const myCursor = lastLinkInResults.id; // set the cursor to that last item
  
            // queries after the cursor to check if we have nextPage
            const secondQueryResults = await ctx.prisma.link.findMany({
              take: args.first,
              cursor: {
                id: myCursor,
              },
            });
  
            const result = {
              pageInfo: {
                endCursor: myCursor,
                hasNextPage: secondQueryResults.length >= args.first,
              },
              edges: queryResults.map((link) => ({
                cursor: link.id,
                node: link,
              })),
            };
  
            return result;
          }
          // If (queryResults.length is < 0), we will return this empty object
          return {
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
            edges: [],
          };
        },
      });
    },
  });

  export const LinkByIDQuery = extendType({
    type: 'Query',
    definition(t) {
      t.nonNull.field('link', {
        type: 'Link',
        args: { id: nonNull(stringArg()) },
        resolve(_parent, args, ctx) {
          const link = ctx.prisma.link.findUnique({
            where: {
              id: args.id,
            },
          });
          return link;
        },
      });
    },
  });
  