// AppRouter.tsx
// using Tanstack Router
import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { LoginView } from '@views/Login/LoginView';
import RootLayout from '@components/RootLayout/RootLayout';
import { getIsAuthenticated } from '@auth/authUtils';
import { DashboardView } from '@views/Dashboard/DashboardView';
import ImagesView from '@views/Images/ImagesView';
import LocationsView from '@views/Locations/LocationsView';
import PathsView from '@views/Paths/PathsView';
import QRCodesView from '@views/QRCodes/QRCodesView';
import SettingsView from '@views/Settings/SettingsView';
import TranslationsView from '@views/Translations/TranslationsView';
import { NewLocationView } from '@views/Locations/NewLocationView';
import { EditLocationView } from '@views/Locations/EditLocationView';
import { NewPathView } from '@views/Paths/NewPathView';
import { EditPathView } from '@views/Paths/EditPathView';

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

const EditPathRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/paths/edit',
    component: () => <EditPathView />,
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


rootRoute.addChildren([indexRoute, loginRoute, LocationsRoute, ImagesRoute, PathsRoute, QRCodeRoute, SettingsRoute, TranslationsRoute, NotFoundRoute, NewLocationRoute, EditLocationRoute, NewPathRoute, EditPathRoute]);


export const AppRouter = rootRoute;