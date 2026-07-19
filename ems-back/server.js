const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express4");
const connectDB = require("./database/db");
const typeDefs = require("./graphql/schema/schema");
const resolvers = require("./graphql/resolvers/resolvers");
const { verifyToken } = require("./utils/auth");

require("dotenv").config();

async function startServer() {
  const app = express();

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: ({ req }) => {
        const token = req.headers.authorization?.replace("Bearer ", "");
        return { user: verifyToken(token) };
      },
    })
  );

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
