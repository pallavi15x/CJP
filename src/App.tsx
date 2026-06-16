import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider, AuthProvider, CartProvider, DataProvider, ToastProvider } from './contexts';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import { ToastContainer } from './components/ui';
import NotFound from './components/ui/NotFound';
import {
  HomePage,
  StorePage, ProductDetailPage,
  CartPage, OrdersPage,
  StoryWallPage,
  PetitionsPage, PetitionDetailPage,
  LeaderboardPage,
  ProfilePage,
  MemeParliamentPage,
  VoicePollsPage,
  ManifestoPage,
  YouthDashboardPage,
  IssueMapPage,
  CommunitiesPage,
  AIAssistantPage,
  LoginPage,
  SignupPage,
  SettingsPage,
  NotificationsPage,
  UserDashboardPage,
  SearchPage,
} from './pages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <ToastProvider>
              <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen bg-dark-bg">
                  <Navbar />
                  <div className="flex pt-16">
                    <LeftSidebar />
                    <main className="flex-1 lg:ml-64 xl:mr-80 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
                      <Routes>
                        {/* Main Pages */}
                        <Route path="/" element={<HomePage />} />

                        {/* Auth */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/settings" element={<SettingsPage />} />

                        {/* User */}
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/dashboard" element={<UserDashboardPage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/search" element={<SearchPage />} />

                        {/* Content */}
                        <Route path="/story-wall" element={<StoryWallPage />} />
                        <Route path="/stories" element={<StoryWallPage />} />
                        <Route path="/petitions" element={<PetitionsPage />} />
                        <Route path="/petitions/:id" element={<PetitionDetailPage />} />
                        <Route path="/polls" element={<VoicePollsPage />} />
                        <Route path="/manifesto" element={<ManifestoPage />} />
                        <Route path="/meme-parliament" element={<MemeParliamentPage />} />
                        <Route path="/memes" element={<MemeParliamentPage />} />
                        <Route path="/communities" element={<CommunitiesPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/ai-assistant" element={<AIAssistantPage />} />
                        <Route path="/assistant" element={<AIAssistantPage />} />
                        <Route path="/issue-map" element={<IssueMapPage />} />
                        <Route path="/youth-dashboard" element={<YouthDashboardPage />} />

                        {/* Store */}
                        <Route path="/store" element={<StorePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/orders" element={<OrdersPage />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <RightSidebar />
                  </div>
                  <ToastContainer />
                </div>
              </BrowserRouter>
            </ToastProvider>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
