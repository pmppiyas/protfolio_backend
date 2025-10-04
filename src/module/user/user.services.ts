import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db.js";

const googleLogin = async (data: Prisma.UsersCreateInput) => {
  let user = await prisma.users.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    user = await prisma.users.create({
      data,
    });
  }

  return user;
};

export const AuthServices = {
  googleLogin,
};
