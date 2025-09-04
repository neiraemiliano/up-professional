// src/routes/index.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router";

import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import { ScrollToTop } from "../components/template/common/ScrollToTop";
import AppLayout from "../layout/AppLayout";

import { routes } from "./routeConfig";

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {routes.map(({ path, element, layout, public: isPublic, roles }, i) => {
          if (isPublic)
            return (
              <Route key={i} element={layout}>
                <Route key={i} path={path} element={element} />
              </Route>
            );

          return (
            <Route key={i} element={layout || <AppLayout />}>
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
