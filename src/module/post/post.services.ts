import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db.js";

// Supports prisma.project (with fallback to prisma.post until prisma generate runs)
const getPrismaProject = () => ((prisma as any).project || (prisma as any).post);

export interface IProjectFilters {
  isFeatured?: boolean | undefined;
  category?: string | undefined;
  isPublished?: boolean | undefined;
}

const createProject = async (data: any) => {
  const model = getPrismaProject();
  const newProject = await model.create({
    data,
  });
  return newProject;
};

const getAllProjects = async (filters?: IProjectFilters) => {
  const whereClause: any = {};

  if (filters?.isFeatured !== undefined) {
    whereClause.isFeatured = filters.isFeatured;
  }
  if (filters?.category) {
    whereClause.category = filters.category;
  }
  if (filters?.isPublished !== undefined) {
    whereClause.isPublished = filters.isPublished;
  }

  const model = getPrismaProject();
  const projects = await model.findMany({
    where: whereClause,
    orderBy: [
      { serial: "asc" },
      { createdAt: "desc" },
    ],
  });

  return projects;
};

const getProjectById = async (id: number) => {
  const model = getPrismaProject();
  const project = await model.findUnique({
    where: { id },
  });

  if (!project) return null;

  const updatedProject = await model.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return updatedProject;
};

const updateProject = async (id: number, payload: any) => {
  const model = getPrismaProject();
  const updated = await model.update({
    where: { id },
    data: payload,
  });
  return updated;
};

const deleteProject = async (id: number) => {
  const model = getPrismaProject();
  await model.delete({
    where: { id },
  });
  return null;
};

const updateProjectSerial = async (id: number, serial: number) => {
  const model = getPrismaProject();
  const updated = await model.update({
    where: { id },
    data: { serial },
  });
  return updated;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectSerial,
  // Backwards compatibility aliases
  createPost: createProject,
  getAllPosts: getAllProjects,
  getPostById: getProjectById,
  updatePost: updateProject,
  deletePost: deleteProject,
  updatePostSerial: updateProjectSerial,
};

export const PostServices = ProjectServices;
