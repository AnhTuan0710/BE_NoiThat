import { SetMetadata } from '@nestjs/common';
import { APP_URL } from '../config';
export const jwtConstants = {
  secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const SIGNIN_ROUTE = `${APP_URL.ADMIN_URL}/auth/login`;