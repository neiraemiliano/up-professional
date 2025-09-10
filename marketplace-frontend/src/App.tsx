import { ThemeProvider } from "./context/ThemeContext";
import PageMeta, { AppWrapper } from "./components/template/common/PageMeta";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { FeatureFlagsProvider } from "./context/FeatureFlagsContext";
import { AnnouncementsProvider } from "./context/AnnouncementsContext";
import { getText } from "./config/texts/texts";
import PWAPrompt from "./components/PWA/PWAPrompt";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary level="route">
      <AuthProvider>
        <FeatureFlagsProvider>
          <AnnouncementsProvider>
            <ThemeProvider>
              <AppWrapper>
                <PageMeta
                  title={getText("appTitle").toUpperCase()}
                  description={getText("appTitle")}
                />
                <ErrorBoundary level="component">
                  <AppRoutes />
                </ErrorBoundary>
                <PWAPrompt />
              </AppWrapper>
            </ThemeProvider>
          </AnnouncementsProvider>
        </FeatureFlagsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
