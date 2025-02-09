import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { NodeCalendar } from "./pages/Calendar";
import { Home } from "./pages/Home";
import { TagPage } from "./pages/Tags";
import { NavigationDrawer } from "./components/NavigationDrawer";

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
  component: Home,
});

const tagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tag",
  component: TagPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: NodeCalendar,
});

const routeTree = rootRoute.addChildren([indexRoute, tagsRoute, calendarRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
