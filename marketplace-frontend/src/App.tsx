import { ThemeProvider } from "./context/ThemeContext";
import PageMeta, { AppWrapper } from "./components/template/common/PageMeta";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { FeatureFlagsProvider } from "./context/FeatureFlagsContext";
import { AnnouncementsProvider } from "./context/AnnouncementsContext";
import { getText } from "./config/texts/texts";

export default function App() {
  return (
    <AuthProvider>
      <FeatureFlagsProvider>
        <AnnouncementsProvider>
          <ThemeProvider>
            <AppWrapper>
              <PageMeta
                title={getText("appTitle").toUpperCase()}
                description={getText("appTitle")}
              />
              <AppRoutes />
            </AppWrapper>
          </ThemeProvider>
        </AnnouncementsProvider>
      </FeatureFlagsProvider>
    </AuthProvider>
  );
}
