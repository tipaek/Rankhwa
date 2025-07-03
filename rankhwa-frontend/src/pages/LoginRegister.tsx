import { Box, Tab, Tabs, TextField, Button, Paper } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type {FieldErrors} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../auth/useAuth'; 

/* ------------------------------------------------------------------ */
/* 1. Zod discriminated-union schema                                   */
/* ------------------------------------------------------------------ */
const base = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const formSchema = z.discriminatedUnion('mode', [
  base.extend({ mode: z.literal('login') }),
  base.extend({
    mode: z.literal('register'),
    displayName: z.string().min(2),
  }),
]);

type FormValues = z.infer<typeof formSchema>;           
type RegisterForm = Extract<FormValues, { mode: 'register' }>;

/* ------------------------------------------------------------------ */
/* 2. Component                                                        */
/* ------------------------------------------------------------------ */
export default function LoginRegister() {
  const [tab, setTab] = useState<0 | 1>(0);             
  const { login, register } = useAuth();

  const {
    register: rhf,
    handleSubmit,
    formState: { errors },
    reset,                                              
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { mode: 'login' },                   
  });

  const handleTabChange = (_: unknown, value: 0 | 1) => {
    setTab(value);
    reset({ mode: value === 0 ? 'login' : 'register' } as FormValues, {
      keepErrors: false,
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (data.mode === 'login') {
      await login(data.email, data.password);
    } else {
      await register(data.email, data.password, data.displayName);
    }
  };

  return (
    <Paper sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3 }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit(onSubmit)}>
      {tab === 1 && (
  <TextField
    label="Display name"
    fullWidth
    margin="normal"
    {...rhf('displayName')}
    error={Boolean(
      (errors as FieldErrors<RegisterForm>).displayName
    )}
    helperText={
      (errors as FieldErrors<RegisterForm>).displayName?.message ?? ''
    }
  />
)}

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          {...rhf('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...rhf('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <input type="hidden" {...rhf('mode')} />

        <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
          {tab === 0 ? 'Login' : 'Create account'}
        </Button>
      </Box>
    </Paper>
  );
}
