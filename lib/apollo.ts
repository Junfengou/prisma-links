import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    // Change this link when you're in production, otherwise graphql won't work
    uri: "http://localhost:3000/api/graphql",
    cache: new InMemoryCache(),
});