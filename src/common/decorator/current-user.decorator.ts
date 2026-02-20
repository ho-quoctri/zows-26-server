import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Nếu truyền @CurrentUser('id') -> trả về user.id
    // Nếu truyền @CurrentUser() -> trả về cả object user
    return data ? user?.[data] : user;
  },
);