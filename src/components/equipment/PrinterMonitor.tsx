import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Print as PrintIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePrinters } from '../../hooks/usePrinters';

interface PrinterMonitorProps {
  printerId: string;
  onError?: (error: Error) => void;
}

interface SupplyLevel {
  type: string;
  level: number;
  color?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'online':
      return 'success';
    case 'offline':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'online':
      return <CheckCircleIcon color="success" />;
    case 'offline':
      return <ErrorIcon color="error" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    default:
      return <PrintIcon />;
  }
};

const SupplyLevelIndicator: React.FC<{ supply: SupplyLevel }> = ({ supply }) => {
  const getColor = (level: number) => {
    if (level <= 10) return 'error';
    if (level <= 25) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="textSecondary">
          {supply.type}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {supply.level}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={supply.level}
        color={getColor(supply.level)}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
      />
    </Box>
  );
};

const PrinterMonitor: React.FC<PrinterMonitorProps> = ({ printerId, onError }) => {
  const { getPrinter, refreshPrinter, loading } = usePrinters();
  const printer = getPrinter(printerId);

  if (!printer) {
    return null;
  }

  const handleRefresh = async () => {
    try {
      await refreshPrinter(printerId);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[4],
          },
        }}
      >
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
            }}
          />
        )}
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {printer.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {printer.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Tooltip title="Atualizar status">
                <IconButton
                  onClick={handleRefresh}
                  disabled={loading}
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              icon={getStatusIcon(printer.status)}
              label={printer.status}
              color={getStatusColor(printer.status) as any}
              size="small"
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Suprimentos
              </Typography>
              {printer.supplies?.map((supply, index) => (
                <SupplyLevelIndicator key={index} supply={supply} />
              ))}
            </Grid>

            {printer.lastPrintJob && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Último Trabalho
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {printer.lastPrintJob.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(printer.lastPrintJob.timestamp).toLocaleString()}
                </Typography>
              </Grid>
            )}

            {printer.error && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {printer.error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { PrinterMonitor };
export default PrinterMonitor;
