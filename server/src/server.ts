import express from 'express';
import path from 'path';      
import db from './config/connection'; // Make sure this path is correct
import type { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';
import { authenticateToken } from './services/auth';

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db;  // Wait for DB connection

  // Middleware for parsing JSON and URL-encoded requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // GraphQL endpoint middleware
  app.use('/graphql', expressMiddleware(server as any, {
    context: authenticateToken as any
  }));

  // Static files and production build handling
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Serving index.html for any route not handled by GraphQL
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
