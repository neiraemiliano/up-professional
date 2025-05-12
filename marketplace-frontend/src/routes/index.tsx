// src/routes/index.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ScrollToTop } from "../components/template/common/ScrollToTop";
import AppLayout from "../layout/AppLayout";
import { routes } from "./routeConfig";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {routes.map(({ path, element, public: isPublic, roles }, i) => {
          if (isPublic) return <Route key={i} path={path} element={element} />;

          return (
            <Route key={i} element={<AppLayout />}>
              <Route
                path={path}
                element={<PrivateRoute roles={roles}>{element}</PrivateRoute>}
              />
            </Route>
          );
        })}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
