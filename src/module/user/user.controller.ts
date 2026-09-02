import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthServices } from "./user.services.js";

const googleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const login = await AuthServices.googleLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Google login successfully",
      data: login,
    });
  }
);

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const login = await AuthServices.credentialLogin(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Login successfully",
      data: login,
    });
  }
);

export const AuthControllers = {
  googleLogin,
  credentialLogin,
};
