import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

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