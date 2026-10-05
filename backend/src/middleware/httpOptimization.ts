// Responsibility: HTTP response compression and caching header middleware orchestration

import compression from "compression";
import type { Request, Response, NextFunction, RequestHandler } from "express";

export const compressionMiddleware: RequestHandler = compression({
  threshold: 1024,
});

export const cacheControlMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    return next();
  }

  if (req.path.includes("/health")) {
    res.setHeader("Cache-Control", "no-cache");
  } else {
    res.setHeader("Cache-Control", "private, no-cache, must-revalidate");
  }

  next();
};
