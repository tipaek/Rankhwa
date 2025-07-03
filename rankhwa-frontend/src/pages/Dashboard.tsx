import { Typography, Button } from '@mui/material';
import { useAuth } from '../auth/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Welcome, {user?.displayName}!
      </Typography>
      <Button variant="outlined" onClick={logout}>
        Sign out
      </Button>
    </>
  );
}
