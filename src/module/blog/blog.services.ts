import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db.js";

const createBlog = async (blogData: Prisma.BlogsCreateInput) => {
  const newBlog = await prisma.blogs.create({
    data: blogData,
  });

  return newBlog;
};

const getAllBlogs = async () => {
  const blogs = await prisma.blogs.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return blogs;
};

const getByBlogId = async (id: number) => {
  const blog = await prisma.blogs.findUnique({
    where: { id },
  });

  if (!blog) return null;

  const updatedBlog = await prisma.blogs.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return updatedBlog;
};

const updateBlog = async (id: number, payload: Prisma.BlogsUpdateInput) => {
  const update = await prisma.blogs.update({
    where: {
      id,
    },
    data: payload,
  });
  return update;
};

const deletePost = async (id: number) => {
  await prisma.blogs.delete({
    where: {
      id,
    },
  });
  return null;
};

export const BlogServices = {
  createBlog,
  getAllBlogs,
  getByBlogId,
  updateBlog,
  deletePost,
};
