import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.SUPER_SECRET_TOKEN;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authorization header missing or invalid format' 
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (token !== expectedToken) {
    return res.status(401).json({ 
      error: 'Invalid authorization token' 
    });
  }

  next();
};
