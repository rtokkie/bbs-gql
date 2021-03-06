import { ApolloServer } from "apollo-server-express";
import express from "express";
import expressPlayground from "graphql-playground-middleware-express";

import { serverContext } from "./context";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./resolvers";

async function start() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: serverContext,
  });

  server.start().then(() => {
    server.applyMiddleware({ app });
  });

  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  app.listen({ port: process.env.PORT || 3000 }, () => console.log("GraphQL Server started!"));
}

start();
