// AppRouter.tsx
// using Tanstack Router
import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { LoginView } from '@views/LoginView';
import RootLayout from '@components/RootLayout/RootLayout';
import { getIsAuthenticated } from '@auth/authUtils';
import { DashboardView } from '@views/DashboardView';

const rootRoute = createRootRoute({
    component: RootLayout,
    beforeLoad: ({ location }) => {
        if (location.pathname === '/login') return;
        if (!getIsAuthenticated(['admin', 'maintainer'])) {
            throw redirect({to: '/login'});
        }
    }
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <DashboardView />,
});


const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <LoginView />,
});

rootRoute.addChildren([indexRoute, loginRoute]);

export const AppRouter = rootRoute;