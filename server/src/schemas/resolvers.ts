import type Context from '../interfaces/Context.js';
import type UserInterface from '../interfaces/User.js';
import type Book from '../interfaces/Book.js';
import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<UserInterface | null> => {
      
      if (context.user) {

        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addUser: async (_parent: any, args: any): Promise<{ token: string; user: UserInterface }> => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
            
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: UserInterface }> => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw AuthenticationError;
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, { bookData }: { bookData: Book }, context: Context): Promise<UserInterface | null> => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return updatedUser;
      }

      throw AuthenticationError;
    },
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: Context): Promise<UserInterface | null> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw AuthenticationError;
    },
  },
};

export default resolvers;