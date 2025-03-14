import type { BookDocument } from '../models/Book.js';

export default interface User {
  username: string | null
  email: string | null
  password: string | null
  savedBooks: BookDocument[]
  isCorrectPassword(password: string): Promise<boolean>
  bookCount: number | null;
}
