import { ReactFlowProvider } from "@xyflow/react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VictoryPie, VictoryTheme } from "victory";

import { GraphFlow } from "./features/graph/components/Graph";
import { TagValues } from "./features/tags/components/TagVlues";
import { TopTimer } from "./components/Timer";

import { DoneToday } from "./features/dashboard/components/DoneToday";
import { HeatMap } from "./features/dashboard/components/HeatMap";
import { ChartByTags } from "./features/tags/components/TagChart";
import { TagList } from "./features/tags/components/Tags";
import { EntryList } from "./features/time-entry/components/EntryList";
import { useTimerStore } from "./store";

const Wrapper = () => {
  const matches = useMediaQuery("(min-width: 1500px)");
  const [checkboxState, setCheckboxState] = useLocalStorage("tags-state", {});
  const chartData = useTimerStore((store) => store.chartData);

  return (
    <div style={{ height: "100%", display: matches ? "flex" : "block" }}>
      <div style={{ height: "50%", width: matches ? "50%" : "98%" }}>
        <TopTimer />
        <div className="p-5 border-1 rounded-md border-solid border-gray-600">
          Current tags:
          <TagValues
            entryTags={checkboxState}
            onChange={(state) => setCheckboxState(state)}
          />
        </div>
        <ReactFlowProvider>
          <GraphFlow />
        </ReactFlowProvider>
        <div>
          <DoneToday />
        </div>
        <div className="m-5">
          <HeatMap />
        </div>
        <div className="m-5 border-1 rounded-md border-solid border-gray-600">
          Tag list:
          <TagList />
        </div>

        <div className="m-5 marker:border-1 rounded-md border-solid border-gray-600">
          chart by tags:
          <ChartByTags />
        </div>
        <div className="m-5 border-1 rounded-md border-solid border-gray-600">
          Chart by selected node:
          {Boolean(chartData.length) && (
            <div style={{ height: "350px" }}>
              <VictoryPie data={chartData} theme={VictoryTheme.clean} />
            </div>
          )}
        </div>
      </div>

      <div className="flex m-5" style={{ width: matches ? "50%" : "98%" }}>
        <div className="flex-1">
          <EntryList />
        </div>
      </div>
    </div>
  );
};

import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export const MiniDrawer = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open ? (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div>kek</div>
    </Box>
  );
};

const queryClient = new QueryClient();

import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'


const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


export default () => (
  <QueryClientProvider client={queryClient}>
    <Wrapper/>
    {/* <MiniDrawer /> */}
    {/* <RouterProvider router={router} /> */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

