import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config.js';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { PostServices } from './post.services.js';

const createPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let payload = req.body;

    if (typeof payload.data === 'string') {
      try {
        payload = JSON.parse(payload.data);
      } catch {}
    }

    if (req.file) {
      const uploadRes = await uploadBufferToCloudinary(
        req.file.buffer,
        'portfolio'
      );
      payload.thumbnail = uploadRes.secure_url;
    }

    if (payload.serial !== undefined) {
      payload.serial = Number(payload.serial);
    }
    if (typeof payload.isFeatured === 'string') {
      payload.isFeatured = payload.isFeatured === 'true';
    }
    if (typeof payload.isPublished === 'string') {
      payload.isPublished = payload.isPublished === 'true';
    }
    if (typeof payload.tags === 'string') {
      try {
        payload.tags = JSON.parse(payload.tags);
      } catch {
        payload.tags = payload.tags.split(',').map((t: string) => t.trim());
      }
    }

    const post = await PostServices.createPost(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Post created successfully',
      data: post,
    });
  }
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { isFeatured, category, isPublished } = req.query;

    const filters: {
      isFeatured?: boolean;
      category?: string;
      isPublished?: boolean;
    } = {};

    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }
    if (typeof category === 'string') {
      filters.category = category;
    }
    if (isPublished !== undefined) {
      filters.isPublished = isPublished === 'true';
    }

    const posts = await PostServices.getAllPosts(filters);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Posts retrieved successfully (sorted by serial)',
      data: posts,
    });
  }
);

const getPostById = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const post = await PostServices.getPostById(Number(req.params.id));

    if (!post) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Post not found',
        data: null,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post retrieved successfully',
      data: post,
    });
  }
);

const updatePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let payload = req.body;

    if (typeof payload.data === 'string') {
      try {
        payload = JSON.parse(payload.data);
      } catch {}
    }

    if (req.file) {
      const uploadRes = await uploadBufferToCloudinary(
        req.file.buffer,
        'portfolio'
      );
      payload.thumbnail = uploadRes.secure_url;
    }

    if (payload.serial !== undefined) {
      payload.serial = Number(payload.serial);
    }
    if (typeof payload.isFeatured === 'string') {
      payload.isFeatured = payload.isFeatured === 'true';
    }
    if (typeof payload.isPublished === 'string') {
      payload.isPublished = payload.isPublished === 'true';
    }
    if (typeof payload.tags === 'string') {
      try {
        payload.tags = JSON.parse(payload.tags);
      } catch {
        payload.tags = payload.tags.split(',').map((t: string) => t.trim());
      }
    }

    const post = await PostServices.updatePost(Number(req.params.id), payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post updated successfully',
      data: post,
    });
  }
);

const deletePost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const deleted = await PostServices.deletePost(Number(req.params.id));

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post deleted successfully',
      data: deleted,
    });
  }
);

const updatePostSerial = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { serial } = req.body;
    const post = await PostServices.updatePostSerial(
      Number(req.params.id),
      Number(serial)
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post serial updated successfully',
      data: post,
    });
  }
);

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostSerial,
};
