import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { AppError } from '../../lib/AppError';
import { User, type UserDoc } from '../users/user.model';
import type { LoginInput, RegisterInput } from './auth.schema';

export async function registerUser(input: RegisterInput): Promise<UserDoc> {
  const existing = await User.findOne({ email: input.email }).lean();
  if (existing) {
    throw AppError.conflict('An account with that email already exists');
  }
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  return User.create({ name: input.name, email: input.email, passwordHash });
}

export async function loginUser(input: LoginInput): Promise<UserDoc> {
  // Need the hash for comparison, so explicitly re-select it.
  const user = await User.findOne({ email: input.email }).select('+passwordHash');
  // Use the same generic message whether the email or password is wrong, so we
  // don't leak which accounts exist.
  if (!user || !(await user.comparePassword(input.password))) {
    throw AppError.unauthorized('Invalid email or password');
  }
  return user;
}

export async function getUserById(id: string): Promise<UserDoc> {
  const user = await User.findById(id);
  if (!user) {
    throw AppError.unauthorized('Your account could not be found');
  }
  return user;
}
