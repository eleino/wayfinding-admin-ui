// AppRouter.tsx
// using Tanstack Router
import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { LoginView } from '@views/LoginView';
import RootLayout from '@components/RootLayout/RootLayout';
import { getIsAuthenticated } from '@auth/authUtils';
import { DashboardView } from '@views/DashboardView';
import ImagesView from '@views/ImagesView';
import LocationsView from '@views/LocationsView';
import PathsView from '@views/PathsView';
import QRCodesView from '@views/QRCodesView';
import SettingsView from '@views/SettingsView';
import TranslationsView from '@views/TranslationsView';
import { NewLocationView } from '@views/NewLocationView';
import { EditLocationView } from '@views/EditLocationView';
import { NewPathView } from '@views/NewPathView';

const rootRoute = createRootRoute({
    component: () => <RootLayout />,
    beforeLoad: ({ location }) => {
        if (location.pathname === '/login') return;
        if (!getIsAuthenticated(['admin', 'maintainer'])) {
            throw redirect({to: '/login'});
        } else if (location.pathname === '/') {
            throw redirect({to: '/dashboard'});
        }
    }
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => <DashboardView />,
});


const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <LoginView />,
});

const ImagesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/images',
    component: () => <ImagesView />,
});

const LocationsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/locations',
    component: () => <LocationsView />,
});

// route for editing locations
const EditLocationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/locations/edit',
    component: () => <EditLocationView />,
});

const NewLocationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/locations/new',
    component: () => <NewLocationView />,
});

const PathsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/paths',
    component: () => <PathsView />,
});

const NewPathRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/paths/new',
    component: () => <NewPathView />,
});

const QRCodeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/qrcodes',
    component: () => <QRCodesView />,
});

const SettingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: () => <SettingsView />,
});

const TranslationsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/translations',
    component: () => <TranslationsView />,
});

const NotFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: () => <div>Not Found</div>,
});


rootRoute.addChildren([indexRoute, loginRoute, LocationsRoute, ImagesRoute, PathsRoute, QRCodeRoute, SettingsRoute, TranslationsRoute, NotFoundRoute, NewLocationRoute, EditLocationRoute, NewPathRoute]);


export const AppRouter = rootRoute;