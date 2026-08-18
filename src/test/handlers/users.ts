import { http, HttpResponse } from "msw";
import type { UpdateUserRequest, User, UserRole } from "@apptypes/users";

const initialUsers: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: 2,
    username: "maintainer",
    email: "maintainer@example.com",
    role: "maintainer",
  },
];

export const userMockData = {
  currentUserId: 1,
  users: structuredClone(initialUsers),
  selfUpdates: [] as UpdateUserRequest[],
};

export const resetUserMockData = () => {
  userMockData.currentUserId = 1;
  userMockData.users = structuredClone(initialUsers);
  userMockData.selfUpdates = [];
};

const currentUser = () =>
  userMockData.users.find((user) => user.id === userMockData.currentUserId);

const updateUser = (user: User, update: UpdateUserRequest): User => {
  Object.assign(user, {
    ...(update.username !== undefined ? { username: update.username } : {}),
    ...(update.email !== undefined ? { email: update.email } : {}),
  });
  return user;
};

export const userHandlers = [
  http.get("*/users/me", () => {
    const user = currentUser();
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),
  http.get("*/users", () =>
    HttpResponse.json({
      data: userMockData.users,
      meta: { users: { limit: 100, total: userMockData.users.length } },
    }),
  ),
  http.put("*/users/me", async ({ request }) => {
    const update = (await request.json()) as UpdateUserRequest;
    userMockData.selfUpdates.push(update);
    const user = currentUser();
    return user
      ? HttpResponse.json(updateUser(user, update))
      : HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),
  http.put("*/users/:userId", async ({ params, request }) => {
    const user = userMockData.users.find(
      (candidate) => candidate.id === Number(params.userId),
    );
    const update = (await request.json()) as UpdateUserRequest;
    return user
      ? HttpResponse.json(updateUser(user, update))
      : HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),
  http.patch("*/users/:userId/role", async ({ params, request }) => {
    const user = userMockData.users.find(
      (candidate) => candidate.id === Number(params.userId),
    );
    const { role } = (await request.json()) as { role: UserRole };
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    user.role = role;
    return HttpResponse.json(user);
  }),
];
