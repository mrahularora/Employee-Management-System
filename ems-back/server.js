const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./database/db");
const typeDefs = require("./graphql/schema/schema");
const resolvers = require("./graphql/resolvers/resolvers");
const { verifyToken } = require("./utils/auth");

require("dotenv").config();

async function startServer() {
  const app = express();

  // Connect to the database
  await connectDB();

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      return { user: verifyToken(token) };
    },
  });

  // Starting the Apollo Server
  await server.start();

  // Apply middleware to the Apollo Server
  server.applyMiddleware({ app });

  // Define the port
  const PORT = process.env.PORT || 4000;

  // Start the Express server
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
