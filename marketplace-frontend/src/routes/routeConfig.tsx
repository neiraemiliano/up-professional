// src/routes/routeConfig.ts
import { JSX } from "react";

import AISearch from "../components/AISearch/AISearch";
import PublicLayout from "../layout/PublicLayout";
import UnifiedDashboardLayout from "../layout/UnifiedDashboardLayout";
import UnifiedAdminDashboard from "../pages/AdminDashboard/UnifiedAdminDashboard";
import AdminLogin from "../pages/AuthPages/AdminLogin";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import CustomerDashboard from "../pages/CustomerDashboard/CustomerDashboard";
import HomeCustomer from "../pages/HomeCustomer/HomeCustomer";
import PaymentFailure from "../pages/Payment/PaymentFailure";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import ProfessionalDashboard from "../pages/ProfessionalDashboard/ProfessionalDashboard";
import ProfessionalProfileEdit from "../pages/ProfessionalDashboard/ProfessionalProfileEdit";
import ProfessionalLanding from "../pages/ProfessionalLanding/ProfessionalLanding";
import ProfessionalOnboarding from "../pages/ProfessionalOnboarding/ProfessionalOnboarding";
import ProfessionalProfile from "../pages/ProfessionalProfile/ProfessionalProfile";
import SearchProfessional from "../pages/SearchProfessional/SearchProfessional";
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

export interface RouteConfig {
  path: string;
  layout?: JSX.Element;
  element: JSX.Element;
  roles?: string[]; // [ 'customer' ], [ 'professional' ], [ 'admin' ]
  public?: boolean; // true = acceso sin auth
}

export const routes: RouteConfig[] = [
  // públicas
  { path: "/signin", element: <SignIn />, public: true },
  { path: "/signup", element: <SignUp />, public: true },
  { path: "/admin-login", element: <AdminLogin />, public: true },

  // rutas protegidas sin restricción de rol
  {
    path: "/",
    element: <HomeCustomer />,

    public: true,
  },
  {
    path: "/search",
    element: <SearchProfessional />,
    layout: <PublicLayout />,
    public: true,
  },
  {
    path: "/ai-search",
    element: <AISearch />,
    public: true,
  },
  {
    path: "professional",
    element: <ProfessionalLanding />,
    public: true,
  },
  {
    path: "/professionals/:id",
    element: <ProfessionalProfile />,
    layout: <PublicLayout />,
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

  // Professional onboarding (authenticated but no role restriction)
  { path: "/professional-onboarding", element: <ProfessionalOnboarding /> },

  // Payment result pages (public access)
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
    layout: <PublicLayout />,
    public: true,
  },
  {
    path: "/payment/failure",
    element: <PaymentFailure />,
    layout: <PublicLayout />,
    public: true,
  },

  // Unified Dashboard Routes
  // Customer Dashboard
  {
    path: "/customer-dashboard",
    element: <CustomerDashboard />,
    layout: <UnifiedDashboardLayout />,
    roles: ["customer"],
  },

  // Professional Dashboard
  {
    path: "/professional-dashboard",
    element: <ProfessionalDashboard />,
    layout: <UnifiedDashboardLayout />,
    roles: ["professional"],
  },
  {
    path: "/professional-dashboard/profile",
    element: <ProfessionalProfileEdit />,
    layout: <UnifiedDashboardLayout />,
    roles: ["professional"],
  },
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

  // admin - Updated to use Unified Layout
  {
    path: "/admin",
    element: <UnifiedAdminDashboard />,
    layout: <UnifiedDashboardLayout />,
    roles: ["admin"],
  },
  { path: "/template/home", element: <Home />, roles: ["admin"] },
  { path: "/template/alerts", element: <Alerts />, roles: ["admin"] },
  { path: "/template/badge", element: <Badges />, roles: ["admin"] },
  { path: "/template/buttons", element: <Buttons />, roles: ["admin"] },

  // fallback
  { path: "*", element: <NotFound />, public: true },
];
