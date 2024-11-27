import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface PrinterConfigProps {
  printerId: string;
  onConfigSaved?: () => void;
}

interface PrinterSettings {
  name: string;
  location: string;
  department: string;
  ipAddress: string;
  defaultPaperSize: string;
  defaultQuality: string;
  colorEnabled: boolean;
  duplexEnabled: boolean;
  maxJobSize: number;
  alertEmail: string;
  maintenanceSchedule: string;
  securityLevel: string;
}

const PrinterConfig: React.FC<PrinterConfigProps> = ({ printerId, onConfigSaved }) => {
  const [settings, setSettings] = useState<PrinterSettings>({
    name: '',
    location: '',
    department: '',
    ipAddress: '',
    defaultPaperSize: 'A4',
    defaultQuality: 'normal',
    colorEnabled: true,
    duplexEnabled: true,
    maxJobSize: 100,
    alertEmail: '',
    maintenanceSchedule: 'monthly',
    securityLevel: 'medium',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [printerId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simulação - substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings({
        name: `Impressora ${printerId}`,
        location: 'Escritório Principal',
        department: 'TI',
        ipAddress: '192.168.1.100',
        defaultPaperSize: 'A4',
        defaultQuality: 'normal',
        colorEnabled: true,
        duplexEnabled: true,
        maxJobSize: 100,
        alertEmail: 'admin@empresa.com',
        maintenanceSchedule: 'monthly',
        securityLevel: 'medium',
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulação - substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      onConfigSaved?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PrinterSettings) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.type === 'checkbox'
      ? (event.target as HTMLInputElement).checked
      : event.target.value;

    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" component="h2">
              Configurações da Impressora
            </Typography>
            <Box>
              <Tooltip title="Recarregar configurações">
                <IconButton onClick={loadSettings} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Configurações salvas com sucesso!
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome da Impressora"
                value={settings.name}
                onChange={handleChange('name')}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localização"
                value={settings.location}
                onChange={handleChange('location')}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                value={settings.department}
                onChange={handleChange('department')}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Endereço IP"
                value={settings.ipAddress}
                onChange={handleChange('ipAddress')}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Configurações de Impressão
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tamanho de Papel Padrão</InputLabel>
                <Select
                  value={settings.defaultPaperSize}
                  onChange={handleChange('defaultPaperSize')}
                  label="Tamanho de Papel Padrão"
                  disabled={loading}
                >
                  <MenuItem value="A4">A4</MenuItem>
                  <MenuItem value="A3">A3</MenuItem>
                  <MenuItem value="Letter">Carta</MenuItem>
                  <MenuItem value="Legal">Ofício</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Qualidade Padrão</InputLabel>
                <Select
                  value={settings.defaultQuality}
                  onChange={handleChange('defaultQuality')}
                  label="Qualidade Padrão"
                  disabled={loading}
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">Alta Qualidade</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.colorEnabled}
                    onChange={handleChange('colorEnabled')}
                    disabled={loading}
                  />
                }
                label="Permitir Impressão Colorida"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.duplexEnabled}
                    onChange={handleChange('duplexEnabled')}
                    disabled={loading}
                  />
                }
                label="Permitir Impressão Frente e Verso"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Configurações Avançadas
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Tamanho Máximo do Trabalho (MB)"
                value={settings.maxJobSize}
                onChange={handleChange('maxJobSize')}
                disabled={loading}
                InputProps={{ inputProps: { min: 1, max: 1000 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="email"
                label="Email para Alertas"
                value={settings.alertEmail}
                onChange={handleChange('alertEmail')}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Agenda de Manutenção</InputLabel>
                <Select
                  value={settings.maintenanceSchedule}
                  onChange={handleChange('maintenanceSchedule')}
                  label="Agenda de Manutenção"
                  disabled={loading}
                >
                  <MenuItem value="weekly">Semanal</MenuItem>
                  <MenuItem value="monthly">Mensal</MenuItem>
                  <MenuItem value="quarterly">Trimestral</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Nível de Segurança</InputLabel>
                <Select
                  value={settings.securityLevel}
                  onChange={handleChange('securityLevel')}
                  label="Nível de Segurança"
                  disabled={loading}
                >
                  <MenuItem value="low">Baixo</MenuItem>
                  <MenuItem value="medium">Médio</MenuItem>
                  <MenuItem value="high">Alto</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  Salvar Configurações
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { PrinterConfig };
export default PrinterConfig;
