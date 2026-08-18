import { beforeEach, describe, expect, test } from "vitest";
import { renderWithQuery } from "test/render";
import {
  resetUserMockData,
  userMockData,
} from "test/handlers/users";
import UsersView from "./UsersView";

describe("UsersView", () => {
  beforeEach(resetUserMockData);

  test("lets a non-admin view and edit only their own unified user record", async () => {
    userMockData.currentUserId = 2;
    const screen = await renderWithQuery(<UsersView />);

    await expect
      .element(screen.getByText("maintainer@example.com"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("heading", { name: "User management" }))
      .not.toBeInTheDocument();

    await screen.getByRole("button", { name: "Edit profile" }).click();
    await screen.getByLabelText("Username").fill("renamed-maintainer");
    await expect
      .element(screen.getByLabelText("Role"))
      .not.toBeInTheDocument();
    await screen.getByRole("button", { name: "Save changes" }).click();

    await expect.poll(() => userMockData.selfUpdates).toEqual([
      {
        username: "renamed-maintainer",
        email: "maintainer@example.com",
      },
    ]);
  });

  test("uses the same user shape for the admin profile and user list", async () => {
    const screen = await renderWithQuery(<UsersView />);

    await expect
      .element(screen.getByRole("heading", { name: "User management" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("maintainer@example.com"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("maintainer", { exact: true }).first())
      .toBeInTheDocument();
  });
});
