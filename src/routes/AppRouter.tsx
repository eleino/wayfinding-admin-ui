// AppRouter.tsx
// using Tanstack Router
import { createRootRoute, createRoute } from '@tanstack/react-router'
import { LoginView } from '../views/LoginView';
import RootLayout from '../components/RootLayout/RootLayout';

const rootRoute = createRootRoute({
    component: RootLayout,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <h1>Home</h1>,
});


const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <LoginView />,
});

rootRoute.addChildren([indexRoute, loginRoute]);

export const AppRouter = rootRoute;