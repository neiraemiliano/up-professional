// src/routes/routeConfig.ts
import { JSX } from "react";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import Blank from "../pages/Blank";
import Calendar from "../pages/Calendar";
import BarChart from "../pages/Charts/BarChart";
import LineChart from "../pages/Charts/LineChart";
import Home from "../pages/Dashboard/Home";
import FormElements from "../pages/Forms/FormElements";
import NotFound from "../pages/OtherPage/NotFound";
import BasicTables from "../pages/Tables/BasicTables";
import Alerts from "../pages/UiElements/Alerts";
import Avatars from "../pages/UiElements/Avatars";
import Badges from "../pages/UiElements/Badges";
import Buttons from "../pages/UiElements/Buttons";
import Images from "../pages/UiElements/Images";
import Videos from "../pages/UiElements/Videos";
import UserProfiles from "../pages/UserProfiles";
import HomeCustomer from "../pages/HomeCustomer/HomeCustomer";

export interface RouteConfig {
  path: string;
  element: JSX.Element;
  roles?: string[]; // [ 'customer' ], [ 'professional' ], [ 'admin' ]
  public?: boolean; // true = acceso sin auth
}

export const routes: RouteConfig[] = [
  // públicas
  { path: "/signin", element: <SignIn />, public: true },
  { path: "/signup", element: <SignUp />, public: true },

  // rutas protegidas sin restricción de rol
  { path: "/", element: <HomeCustomer />, public: true },

  // cliente
  { path: "/profile", element: <UserProfiles />, roles: ["admin"] },
  { path: "/calendar", element: <Calendar />, roles: ["admin", "customer"] },
  {
    path: "/form-elements",
    element: <FormElements />,
    roles: ["admin", "customer"],
  },
  {
    path: "/basic-tables",
    element: <BasicTables />,
    roles: ["admin", "customer"],
  },

  // profesional
  { path: "/avatars", element: <Avatars />, roles: ["admin", "professional"] },
  { path: "/images", element: <Images />, roles: ["admin", "professional"] },
  { path: "/videos", element: <Videos />, roles: ["admin", "professional"] },
  {
    path: "/line-chart",
    element: <LineChart />,
    roles: ["admin", "professional"],
  },
  {
    path: "/bar-chart",
    element: <BarChart />,
    roles: ["admin", "professional"],
  },

  // admin
  { path: "/home", element: <Home />, roles: ["admin"] },
  { path: "/alerts", element: <Alerts />, roles: ["admin"] },
  { path: "/badge", element: <Badges />, roles: ["admin"] },
  { path: "/buttons", element: <Buttons />, roles: ["admin"] },

  // fallback
  { path: "*", element: <NotFound />, public: true },
];
