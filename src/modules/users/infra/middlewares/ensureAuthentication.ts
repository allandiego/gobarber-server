/**
 * Middleware to check if the user is logged (== has a token) and if the
 * token is valid
 */

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

/**
 * The `verify` methody from `jsonwebtoken` returns in this format
 */
interface TokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

// Explicitly typing so we can have access to their properties
export default function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // It was predefined that the token will be sent through this property
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // token format = 'bearer dya89yd89asndua89nsdand9asnudas'
  // we do not need the `bearer` part, so we ignore it
  const [, token] = authorizationHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // `sub` is where the information we encoded is located
    const { sub } = decoded as TokenPayLoad;

    request.user = {
      id: sub,
    };

    // next middleware in the line
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
