export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export const userRoles = ["admin", "maintainer", "user"] as const;
export type UserRole = (typeof userRoles)[number];

// GET /users
export interface UsersList {
  data: User[];
  meta: {
    users: {
      limit: number;
      total: number;
    };
  };
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}
