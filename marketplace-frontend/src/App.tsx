import { ThemeProvider } from "./context/ThemeContext";
import PageMeta, { AppWrapper } from "./components/template/common/PageMeta";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { getText } from "./config/texts/texts";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppWrapper>
          <PageMeta
            title={getText("appTitle").toUpperCase()}
            description={getText("appTitle")}
          />
          <AppRoutes />
        </AppWrapper>
      </ThemeProvider>
    </AuthProvider>
  );
}
