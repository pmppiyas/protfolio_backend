import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db.js";

const createPost = async (data: Prisma.PostCreateInput) => {
  const newPost = await prisma.post.create({
    data,
  });
  return newPost;
};

export interface IPostFilters {
  isFeatured?: boolean | undefined;
  category?: string | undefined;
  isPublished?: boolean | undefined;
}

const getAllPosts = async (filters?: IPostFilters) => {
  const whereClause: Prisma.PostWhereInput = {};

  if (filters?.isFeatured !== undefined) {
    whereClause.isFeatured = filters.isFeatured;
  }
  if (filters?.category) {
    whereClause.category = filters.category;
  }
  if (filters?.isPublished !== undefined) {
    whereClause.isPublished = filters.isPublished;
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: [
      { serial: "asc" },
      { createdAt: "desc" },
    ],
  });

  return posts;
};

const getPostById = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
    });

    if (!post) return null;

    const updatedPost = await tx.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return updatedPost;
  });

  return result;
};

const updatePost = async (id: number, payload: Prisma.PostUpdateInput) => {
  const updated = await prisma.post.update({
    where: { id },
    data: payload,
  });
  return updated;
};

const deletePost = async (id: number) => {
  await prisma.post.delete({
    where: { id },
  });
  return null;
};

const updatePostSerial = async (id: number, serial: number) => {
  const updated = await prisma.post.update({
    where: { id },
    data: { serial },
  });
  return updated;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostSerial,
};
