import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
// Define Role enum locally if not available from '@prisma/client'
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export function ApiDocFor(apiDoc: {
  summary: string;
  status: number;
  description: string;
  authRequired?: boolean;
  role?: Role;
}) {
  const decorators = [
    ApiOperation({ summary: apiDoc.summary }),
    ApiResponse({ status: apiDoc.status, description: apiDoc.description }),
  ];

  if (apiDoc.authRequired) {
    decorators.push(ApiBearerAuth());
  }

  if (apiDoc.role === Role.ADMIN) {
    decorators.push(ApiSecurity(Role.ADMIN));
  }

  return applyDecorators(...decorators);
}