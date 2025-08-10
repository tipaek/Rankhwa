import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth.store';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/components/Toast';

/**
 * Authentication page that handles both login and registration.  The
 * current mode is determined by the pathname: `/login` shows the
 * login form and `/register` shows the registration form.  A toggle
 * link lets the user switch between them.  After a successful
 * operation the user is redirected to the `redirectTo` query
 * parameter or the home page.
 */
const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initialMode = location.pathname.includes('register') ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode as 'login' | 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(location.pathname.includes('register') ? 'register' : 'login');
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({ title: 'Welcome back!', description: 'Logged in successfully', variant: 'success' });
      } else {
        await register(email, password, displayName);
        toast({ title: 'Account created', description: 'You are now logged in', variant: 'success' });
      }
      const redirectTo = searchParams.get('redirectTo') || '/';
      navigate(decodeURIComponent(redirectTo), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {mode === 'login' ? 'Log in to Rankhwa' : 'Create an account'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input
              id="displayName"
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? 'Submitting…' : mode === 'login' ? 'Log in' : 'Register'}
          </Button>
        </form>
        <div className="text-center mt-4 text-sm">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary" onClick={() => setMode('register')}>
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-primary" onClick={() => setMode('login')}>
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;