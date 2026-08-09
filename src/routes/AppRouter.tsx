import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";
import type { AuthContextType } from "@auth/authContext";
import { searchParamsSchema, type SearchParams } from "@schemas/router.schema";
import { valibotValidator } from "@tanstack/valibot-adapter";
import { buildBreadcrumbs } from "@utils/breadcrumbs";

type Breadcrumbs = ReturnType<typeof buildBreadcrumbs>;

export interface AppRouterContext {
  auth: AuthContextType;
  getBreadcrumbs?: () => Breadcrumbs;
}

declare module "@tanstack/react-router" {
  interface RouteContext {
    getBreadcrumbs?: () => Breadcrumbs;
  }
}

const rootRoute = createRootRouteWithContext<AppRouterContext>()({
  component: Outlet,
  validateSearch: valibotValidator(searchParamsSchema),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: lazyRouteComponent(
    () => import("@views/Login/LoginView"),
    "LoginView",
  ),
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: lazyRouteComponent(
    () => import("@components/RootLayout/RootLayout"),
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/dashboard",
  component: lazyRouteComponent(
    () => import("@views/Dashboard/DashboardView"),
    "DashboardView",
  ),
});

const imagesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/images",
  component: lazyRouteComponent(() => import("@views/Images/ImagesView")),
});

const locationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/locations",
  component: lazyRouteComponent(() => import("@views/Locations/LocationsView")),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/locations", deps),
  }),
});

const editLocationRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/locations/edit",
  component: lazyRouteComponent(
    () => import("@views/Locations/EditLocationView"),
    "EditLocationView",
  ),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/locations", deps, "Edit Location"),
  }),
});

const newLocationRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/locations/new",
  component: lazyRouteComponent(
    () => import("@views/Locations/NewLocationView"),
    "NewLocationView",
  ),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/locations", deps, "New Location"),
  }),
});

const pathsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/paths",
  component: lazyRouteComponent(() => import("@views/Paths/PathsView")),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/paths", deps),
  }),
});

const editPathRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/paths/edit",
  component: lazyRouteComponent(
    () => import("@views/Paths/EditPathView"),
    "EditPathView",
  ),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/paths", deps, "Edit Path"),
  }),
});

const newPathRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/paths/new",
  component: lazyRouteComponent(
    () => import("@views/Paths/NewPathView"),
    "NewPathView",
  ),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/paths", deps, "New Path"),
  }),
});

const qrCodeRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/qrcodes",
  component: lazyRouteComponent(() => import("@views/QRCodes/QRCodesView")),
  loaderDeps: ({ search }) => search as SearchParams,
  context: ({ deps }) => ({
    getBreadcrumbs: () => buildBreadcrumbs("/qrcodes", deps),
  }),
});

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/settings",
  component: lazyRouteComponent(() => import("@views/Settings/SettingsView")),
});

const translationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/translations",
  component: lazyRouteComponent(
    () => import("@views/Translations/TranslationsView"),
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "*",
  component: () => <div>Not Found</div>,
});

const authenticatedRouteTree = authenticatedRoute.addChildren([
  homeRoute,
  dashboardRoute,
  locationsRoute,
  imagesRoute,
  pathsRoute,
  qrCodeRoute,
  settingsRoute,
  translationsRoute,
  newLocationRoute,
  editLocationRoute,
  newPathRoute,
  editPathRoute,
  notFoundRoute,
]);

export const AppRouter = rootRoute.addChildren([
  loginRoute,
  authenticatedRouteTree,
]);
