import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { PageTransitionRouter, PageLoader } from './components/PageTransition';
import AnalyticsService from './services/analyticsService';

const Chatbot = lazy(() => import('./views/chatbot/Chatbot'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const scrollToTop = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollY = 0;
    };
    requestAnimationFrame(scrollToTop);
  }, [pathname]);
  return null;
}

function AnalyticsInit() {
  useEffect(() => {
    AnalyticsService.init();
  }, []);
  return null;
}

function ChatbotLoader() {
  return (
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AnalyticsInit />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <PageTransitionRouter />
          </Suspense>
          <ChatbotLoader />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
