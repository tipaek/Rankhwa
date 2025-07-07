import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/* 1. Zod schemas                                                      */
/* ------------------------------------------------------------------ */

/* ── shared primitives ─────────────────────────────── */
const email = z.string().email();
const pwd = z.string().min(8, 'Password ≥ 8 chars');

/* ── LOGIN form ────────────────────────────────────── */
const LoginSchema = z.object({
  email,
  password: pwd,
});
type LoginVals = z.infer<typeof LoginSchema>;

/* ── REGISTER step-1 (creds) ───────────────────────── */
const CredsSchema = z
  .object({
    email,
    password: pwd,
    confirmPassword: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.password !== v.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });
type CredVals = z.infer<typeof CredsSchema>;

/* ── REGISTER step-2 (display name) ────────────────── */
const NameSchema = z.object({
  displayName: z.string().min(2, 'Name ≥ 2 chars'),
});
type NameVals = z.infer<typeof NameSchema>;

/* ------------------------------------------------------------------ */
/* 2. Component                                                        */
/* ------------------------------------------------------------------ */
export default function LoginRegister() {
  /* top-level UI state */
  const [tab, setTab] = useState<0 | 1>(0);            // 0 login, 1 register
  const [stage, setStage] = useState<'creds' | 'name'>('creds'); // register sub-flow
  const [creds, setCreds] = useState<CredVals | null>(null);    // holds step-1 values

  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();

  /* ------------- React Hook Form instances (always created once) ---- */
  const loginForm = useForm<LoginVals>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const credsForm = useForm<CredVals>({
    resolver: zodResolver(CredsSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const nameForm = useForm<NameVals>({
    resolver: zodResolver(NameSchema),
    defaultValues: { displayName: '' },
  });

  /* ------------- redirect if already logged in ---------------------- */
  useEffect(() => {
    if (!loading && user) {
      const id = setTimeout(() => navigate('/', { replace: true }), 700);
      return () => clearTimeout(id);
    }
  }, [user, loading, navigate]);

  /* ------------- early loading states -------------------------------- */
  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (user) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">Already logged in – redirecting…</Typography>
      </Box>
    );
  }

  /* ------------- submit handlers ------------------------------------ */
  const submitLogin = async (vals: LoginVals) => {
    await login(vals.email, vals.password);
    navigate('/', { replace: true });
  };

  const submitCreds = (vals: CredVals) => {
    setCreds(vals);
    setStage('name'); // go to step 2
  };

  const submitName = async (vals: NameVals) => {
    if (!creds) return; // safety
    await register(creds.email, creds.password, vals.displayName);
    setTimeout(() => navigate('/', { replace: true }), 0);
  };

  /* ------------- tab switch helper ---------------------------------- */
  const handleTabChange = (_: unknown, value: 0 | 1) => {
    setTab(value);
    // reset sub-flow if user flips back to login
    if (value === 0) {
      setStage('creds');
      credsForm.reset();
      nameForm.reset();
    }
  };

  /* ------------------------------------------------------------------ */
  /* 3. Render                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <Paper sx={{ maxWidth: 440, mx: 'auto', mt: 6, p: 3 }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      {/* ---------- LOGIN TAB ------------------------------------- */}
      {tab === 0 && (
        <Box
          component="form"
          sx={{ mt: 2 }}
          onSubmit={loginForm.handleSubmit(submitLogin)}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...loginForm.register('email')}
            error={!!loginForm.formState.errors.email}
            helperText={loginForm.formState.errors.email?.message ?? ''}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...loginForm.register('password')}
            error={!!loginForm.formState.errors.password}
            helperText={loginForm.formState.errors.password?.message ?? ''}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            disabled={loginForm.formState.isSubmitting}
          >
            Login
          </Button>
        </Box>
      )}

      {/* ---------- REGISTER TAB ---------------------------------- */}
      {tab === 1 && stage === 'creds' && (
        <Box
          component="form"
          sx={{ mt: 2 }}
          onSubmit={credsForm.handleSubmit(submitCreds)}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...credsForm.register('email')}
            error={!!credsForm.formState.errors.email}
            helperText={credsForm.formState.errors.email?.message ?? ''}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...credsForm.register('password')}
            error={!!credsForm.formState.errors.password}
            helperText={credsForm.formState.errors.password?.message ?? ''}
          />
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            margin="normal"
            {...credsForm.register('confirmPassword')}
            error={!!credsForm.formState.errors.confirmPassword}
            helperText={
              credsForm.formState.errors.confirmPassword?.message ?? ''
            }
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            disabled={credsForm.formState.isSubmitting}
          >
            Next
          </Button>
        </Box>
      )}

      {tab === 1 && stage === 'name' && (
        <Box
          component="form"
          sx={{ mt: 2 }}
          onSubmit={nameForm.handleSubmit(submitName)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton size="small" onClick={() => setStage('creds')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              What should we call you?
            </Typography>
          </Box>

          <TextField
            label="Display name"
            fullWidth
            margin="normal"
            {...nameForm.register('displayName')}
            error={!!nameForm.formState.errors.displayName}
            helperText={nameForm.formState.errors.displayName?.message ?? ''}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            disabled={nameForm.formState.isSubmitting}
          >
            Create account
          </Button>
        </Box>
      )}
    </Paper>
  );
}
