import { Role } from '@prisma/client';

export type CurrentUserPayload = {
  id: string;
  email: string;
  role: Role;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
};
