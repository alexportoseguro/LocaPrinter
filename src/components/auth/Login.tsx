import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { auditService } from '../../services/auditService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      
      // Log successful login
      await auditService.logAction(
        'LOGIN',
        'USER',
        data.user?.id || '',
        {},
        data.user?.id || '',
        data.user?.user_metadata?.organization_id || ''
      );

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, insira seu email para redefinir a senha');
      return;
    }

    try {
      await authService.resetPassword(email);
      setError('');
      alert('Instruções de redefinição de senha foram enviadas para seu email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          LocaPrinter
        </Typography>
        
        <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
          Faça login para continuar
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleForgotPassword}
          >
            Esqueceu a senha?
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/signup')}
          >
            Criar conta
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
