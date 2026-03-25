import type { Response } from "express";

export class ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
  }

  // static helpers

  static send<T>(res: Response, statusCode: number, message: string, data: T) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }

  static success<T>(res: Response, data: T, message: string = "Success") {
    return this.send(res, 200, message, data);
  }

  static created<T>(res: Response, data: T, message: string = "Created") {
    return this.send(res, 201, message, data);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
