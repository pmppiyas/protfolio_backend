import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { BlogServices } from "./blog.services.js";

const DEFAULT_BLOG_THUMBNAIL = "https://i.ibb.co.com/fV500sDk/download-2.jpg";

const createPost = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let payload = req.body;

    if (typeof payload.data === "string") {
      try {
        payload = JSON.parse(payload.data);
      } catch {}
    }

    let thumbnailUrl = payload.thumbnail;

    if (req.file) {
      try {
        const uploadRes = await uploadBufferToCloudinary(
          req.file.buffer,
          "portfolio/blogs"
        );
        thumbnailUrl = uploadRes.secure_url;
      } catch (uploadErr) {
        console.warn(
          "Cloudinary upload failed (DNS or network issue). Falling back to base64 Data URL:",
          uploadErr
        );
        thumbnailUrl = `data:${req.file.mimetype || "image/jpeg"};base64,${req.file.buffer.toString(
          "base64"
        )}`;
      }
    }

    if (!thumbnailUrl || typeof thumbnailUrl !== "string" || !thumbnailUrl.trim()) {
      thumbnailUrl = DEFAULT_BLOG_THUMBNAIL;
    }

    let tags: string[] = [];
    if (typeof payload.tags === "string") {
      try {
        tags = JSON.parse(payload.tags);
      } catch {
        tags = payload.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
    } else if (Array.isArray(payload.tags)) {
      tags = payload.tags;
    }

    const isFeatured =
      payload.isFeatured === true ||
      payload.isFeatured === "true" ||
      payload.isFeatured === 1;

    // Build strict Prisma payload to avoid any unknown argument errors
    const blogData = {
      title: (payload.title || "").trim(),
      content: (payload.content || "").trim(),
      author: (payload.author || "Prince Mahmud Piyas").trim(),
      thumbnail: thumbnailUrl,
      tags: tags,
      isFeatured: isFeatured,
    };

    if (!blogData.title || !blogData.content) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Article title and content are required",
        data: null,
      });
    }

    const create = await BlogServices.createBlog(blogData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Blog article published successfully",
      data: create,
    });
  }
);

const getAllBlogs = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogs = await BlogServices.getAllBlogs();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All blogs retrieved successfully",
      data: blogs,
    });
  }
);

const getByBlogId = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogId = Number(req.params.id);
    if (isNaN(blogId)) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid blog ID",
        data: null,
      });
    }

    const blog = await BlogServices.getByBlogId(blogId);

    if (!blog) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: "Blog article not found",
        data: null,
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "This blog retrieved successfully",
      data: blog,
    });
  }
);

const updateBlog = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogId = Number(req.params.id);
    let payload = req.body;

    if (typeof payload.data === "string") {
      try {
        payload = JSON.parse(payload.data);
      } catch {}
    }

    const updateData: any = {};

    if (payload.title !== undefined) updateData.title = payload.title.trim();
    if (payload.content !== undefined) updateData.content = payload.content.trim();
    if (payload.author !== undefined) updateData.author = payload.author.trim();
    if (payload.isFeatured !== undefined) {
      updateData.isFeatured =
        payload.isFeatured === true ||
        payload.isFeatured === "true" ||
        payload.isFeatured === 1;
    }

    if (payload.tags !== undefined) {
      if (typeof payload.tags === "string") {
        try {
          updateData.tags = JSON.parse(payload.tags);
        } catch {
          updateData.tags = payload.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
        }
      } else if (Array.isArray(payload.tags)) {
        updateData.tags = payload.tags;
      }
    }

    if (req.file) {
      try {
        const uploadRes = await uploadBufferToCloudinary(
          req.file.buffer,
          "portfolio/blogs"
        );
        updateData.thumbnail = uploadRes.secure_url;
      } catch (uploadErr) {
        console.warn(
          "Cloudinary upload failed during update, falling back to base64 Data URL:",
          uploadErr
        );
        updateData.thumbnail = `data:${req.file.mimetype || "image/jpeg"};base64,${req.file.buffer.toString(
          "base64"
        )}`;
      }
    } else if (payload.thumbnail && typeof payload.thumbnail === "string" && payload.thumbnail.trim()) {
      updateData.thumbnail = payload.thumbnail.trim();
    }

    const update = await BlogServices.updateBlog(blogId, updateData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "This blog updated successfully",
      data: update,
    });
  }
);

const deleteBlog = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blogId = Number(req.params.id);
    const deleteBlog = await BlogServices.deletePost(blogId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "This blog deleted successfully",
      data: deleteBlog,
    });
  }
);

export const BlogController = {
  createPost,
  getAllBlogs,
  getByBlogId,
  updateBlog,
  deleteBlog,
};
