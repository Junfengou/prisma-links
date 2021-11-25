import { links } from "../data/links"
import {prisma} from "../lib/prisma";


export const resolvers = {
    Query: {
        // _parent -> Not currently being used
        // args -> arguments that's passed in, in an object form. Usually contains things like ID of a product of something along that lines
        // context -> this could be something along the line of whether a user is logged in or a database string or custom fetch function
        links: async (_parent, _args, context) => await context.prisma.link.findMany()
    }
}