import { Request, Response, NextFunction } from "express";

const asyncResolver = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err: any) =>
      next(err),
    );
  };
};

export default asyncResolver;
