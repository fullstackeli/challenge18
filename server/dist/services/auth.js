import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();
export const authenticateToken = ({ req }) => {
    let token;
    if (req.body && req.body.token) {
        token = req.body.token;
    }
    else if (req.query && req.query.token) {
        token = req.query.token;
    }
    else if (req.headers && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    else {
        return req;
    }
    const secretKey = process.env.JWT_SECRET_KEY || '';
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return req;
        }
        req.user = user;
        return req;
    });
    return req;
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
export const AuthenticationError = new GraphQLError('Authentication Error', {
    extensions: {
        code: 'UNAUTHENTICATED',
    },
});
