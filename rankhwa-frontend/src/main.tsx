import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app';
import HomePage from './routes/Home';
import SearchPage from './routes/Search';
import ManhwaPage from './routes/Manhwa';
import AuthPage from './routes/Auth';
import ProfilePage from './routes/Profile';
import SubmitPage from './routes/Submit';
import NotFoundPage from './routes/NotFound';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from '@/features/auth/auth.store';
import { Protected } from '@/features/auth/Protected';
import { ToastProvider } from '@/components/Toast';
import './styles/globals.css';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}> 
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="manhwa/:id" element={<ManhwaPage />} />
                <Route path="login" element={<AuthPage />} />
                <Route path="register" element={<AuthPage />} />
                <Route
                  path="me"
                  element={
                    <Protected>
                      <ProfilePage />
                    </Protected>
                  }
                />
                <Route
                  path="submit"
                  element={
                    <Protected>
                      <SubmitPage />
                    </Protected>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);