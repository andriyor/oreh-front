import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { NavigationDrawer } from "./components/NavigationDrawer";
import { TagPage } from "./pages/Tags";
import { Home } from "./pages/Home";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <>
      <NavigationDrawer />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <Home />;
  },
});

const tagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tag",
  component: function About() {
    return <TagPage />;
  },
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: function About() {
    return <div>Calendar</div>;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, tagsRoute, calendarRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
