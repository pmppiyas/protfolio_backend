import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db.js';

const googleLogin = async (data: Prisma.UsersCreateInput) => {
  if (!data.email) {
    throw new Error('Email is required for Google login.');
  }

  let user = await prisma.users.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    user = await prisma.users.create({ data });
  }

  return user;
};

const credentialLogin = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error('Required fields missing!', {
      cause: '400',
    });
  }

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found!', {
      cause: '404',
    });
  }

  const isPasswordValid = user.password === password;

  if (!isPasswordValid) {
    throw new Error('Password is wrong');
  }

  const { password: _, ...safeUser } = user;

  return safeUser;
};

export const AuthServices = {
  googleLogin,
  credentialLogin,
};
