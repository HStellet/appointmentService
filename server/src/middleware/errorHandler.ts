import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // keep logging minimal but useful
  console.error(err && err.stack ? err.stack : err);
  res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
}
