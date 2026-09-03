import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { MockAuthProvider } from '@/lib/mockAuth';
import SiteLayout from '@/components/SiteLayout';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import Reservation from '@/pages/Reservation';
import PolicyTerms from '@/pages/PolicyTerms';
import AuthLogin from '@/pages/AuthLogin';
import AuthSignup from '@/pages/AuthSignup';
import Logout from '@/pages/Logout';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PageTransition from './components/PageTransition';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <PageTransition>
      {(location) => (
        <Routes location={location}>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/policy" element={<PolicyTerms />} />
          </Route>
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/signup" element={<AuthSignup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </PageTransition>
  );
};


function App() {

  return (
    <MockAuthProvider>
      <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
      </AuthProvider>
    </MockAuthProvider>
  )
}

export default App