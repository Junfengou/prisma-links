import { objectType, extendType } from "nexus"
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
        t.string('caategory');
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

export const LinksQuery = extendType({
    type: 'Query',
    definition(t) {
        // I'm pretty sure the t means generic, should rename it. This is confusing AF
        t.nonNull.list.field('links', {
            type: 'Link',
            resolve(_parent, _args, ctx) {
                // In here, we're using context to perform a custom fetch function by telling prisma to access the link table and return back a list of links
                return ctx.prisma.link.findMany()
            }
        })
    }
})