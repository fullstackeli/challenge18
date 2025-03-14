import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = ({ req }: { req: Request }) => {
  let token;
  if(req.body && req.body.token) {
    token= req.body.token
  } else if (req.query && req.query.token) {
    token= req.query.token
  } else if (req.headers && req.headers.authorization){
    token = req.headers.authorization.split(' ')[1];
  } else {
    return req
  }
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        return req;
      }
      req.user = user as JwtPayload;
      return req;
    });
    return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const AuthenticationError = new GraphQLError('Authentication Error', {
  extensions: {
    code: 'UNAUTHENTICATED',
  },
})