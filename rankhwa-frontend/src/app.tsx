import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth.store';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/Button';

const App: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-5">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/file.svg" alt="Rankhwa" className="w-[80px] h-[80px]" />
              <span className="text-lg font-semibold">Rankhwa</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                }
              >
                Search
              </NavLink>
              <NavLink
                to="/submit"
                className={({ isActive }) =>
                  isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                }
              >
                Submit
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <>
                <NavLink
                  to="/me"
                  className={({ isActive }) =>
                    isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                  }
                >
                  {user.displayName}
                </NavLink>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                  }
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                  }
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card text-center text-xs py-4 text-muted">
        © {new Date().getFullYear()} Rankhwa
      </footer>
    </div>
  );
};

export default App;