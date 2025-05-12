// src/routes/routeConfig.ts
import { JSX } from "react";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import Blank from "../pages/template/Blank";
import Calendar from "../pages/template/Calendar";
import BarChart from "../pages/template/Charts/BarChart";
import LineChart from "../pages/template/Charts/LineChart";
import Home from "../pages/template/Dashboard/Home";
import FormElements from "../pages/template/Forms/FormElements";
import NotFound from "../pages/template/OtherPage/NotFound";
import BasicTables from "../pages/template/Tables/BasicTables";
import Alerts from "../pages/template/UiElements/Alerts";
import Avatars from "../pages/template/UiElements/Avatars";
import Badges from "../pages/template/UiElements/Badges";
import Buttons from "../pages/template/UiElements/Buttons";
import Images from "../pages/template/UiElements/Images";
import Videos from "../pages/template/UiElements/Videos";
import UserProfiles from "../pages/template/UserProfiles";
import HomeCustomer from "../pages/HomeCustomer/HomeCustomer";
import ProfessionalLanding from "../pages/ProfessionalLanding/ProfessionalLanding";
import SearchProfessional from "../pages/SearchProfessional/SearchProfessional";
import ProfessionalProfile from "../pages/ProfessionalProfile/ProfessionalProfile";

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
  { path: "/search", element: <SearchProfessional />, public: true },
  { path: "professional", element: <ProfessionalLanding />, public: true },
  {
    path: "/professionals/:id",
    element: <ProfessionalProfile />,
    public: true,
  },

  // cliente
  { path: "/template/profile", element: <UserProfiles />, roles: ["admin"] },
  {
    path: "/template/calendar",
    element: <Calendar />,
    roles: ["admin"],
  },
  {
    path: "/template/form-elements",
    element: <FormElements />,
    roles: ["admin"],
  },
  {
    path: "/template/form-elements",
    element: <BasicTables />,
    roles: ["admin"],
  },

  // profesional
  {
    path: "/template/avatars",
    element: <Avatars />,
    roles: ["admin"],
  },
  {
    path: "/template/images",
    element: <Images />,
    roles: ["admin"],
  },
  {
    path: "/template/videos",
    element: <Videos />,
    roles: ["admin"],
  },
  {
    path: "/template/line-chart",
    element: <LineChart />,
    roles: ["admin"],
  },
  {
    path: "/template/bar-chart",
    element: <BarChart />,
    roles: ["admin"],
  },

  // admin
  { path: "/template/home", element: <Home />, roles: ["admin"] },
  { path: "/template/alerts", element: <Alerts />, roles: ["admin"] },
  { path: "/template/badge", element: <Badges />, roles: ["admin"] },
  { path: "/template/buttons", element: <Buttons />, roles: ["admin"] },

  // fallback
  { path: "*", element: <NotFound />, public: true },
];
