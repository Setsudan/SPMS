import { Request } from 'express';
import { Prisma } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: Prisma.UserGetPayload<{ select: { id: true } }>;
}
